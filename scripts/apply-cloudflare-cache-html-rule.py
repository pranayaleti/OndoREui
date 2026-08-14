#!/usr/bin/env python3
"""
Idempotent apply of the www/apex HTML cache rule (crawler stampede / 504 mitigation).

Does not touch DNS. Does not change Under Attack Mode.

Usage:
    python3 scripts/apply-cloudflare-cache-html-rule.py
    python3 scripts/apply-cloudflare-cache-html-rule.py --dry-run

Reads scripts/cf.env (gitignored) or the environment:
    CF_API_TOKEN   Zone > Cache Rules > Edit (+ Zone > Zone > Read to verify zone name)
    CF_ZONE_ID     must be the ondorealestate.com zone
    Aliases: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID

Refuses to run if GET /zones/:id name is not ondorealestate.com (api/app share this
zone; the rule expression must never match those hosts).

If this exits 403, apply the same rule in the dashboard:
    Caching > Cache Rules > Create or edit
    Name: Cache static HTML on www and apex (504 mitigation)
    Then Deploy. Do not match api. or app.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
SPEC_PATH = SCRIPT_DIR / "cloudflare-cache-html-rule.json"
API = "https://api.cloudflare.com/client/v4"
PHASE = "http_request_cache_settings"
RULE_PAYLOAD_KEYS = ("ref", "description", "expression", "action", "enabled", "action_parameters")


def load_env_file(path: Path) -> None:
    if not path.is_file():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def api(token: str, method: str, url: str, payload: dict | None = None) -> tuple[int, dict | str]:
    data = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode()
        try:
            return exc.code, json.loads(raw)
        except json.JSONDecodeError:
            return exc.code, raw


def first_error(body: dict | str) -> str:
    if isinstance(body, dict):
        errors = body.get("errors") or []
        if errors:
            return str(errors[0].get("message") or errors[0])
    return str(body)[:240]


def rule_payload(rule: dict) -> dict:
    return {key: rule[key] for key in RULE_PAYLOAD_KEYS if key in rule}


def same_rule(existing: dict, desired: dict) -> bool:
    for key in ("ref", "description", "expression", "action", "enabled"):
        if key in desired and existing.get(key) != desired.get(key):
            return False
    left = json.dumps(existing.get("action_parameters") or {}, sort_keys=True)
    right = json.dumps(desired.get("action_parameters") or {}, sort_keys=True)
    return left == right


def find_existing(rules: list, desired: dict) -> dict | None:
    ref = desired.get("ref")
    description = desired.get("description")
    for existing in rules:
        if ref and existing.get("ref") == ref:
            return existing
        if description and existing.get("description") == description:
            return existing
    return None


def verify_zone(token: str, zone_id: str, expected_name: str) -> int:
    status, body = api(token, "GET", f"{API}/zones/{zone_id}")
    if status == 403:
        print(
            "Refusing to apply: token cannot GET the zone (need Zone > Zone > Read) "
            f"so this script cannot confirm the zone is {expected_name}."
        )
        return 2
    if status != 200 or not isinstance(body, dict):
        print(f"Failed to read zone ({status}): {first_error(body)}")
        return 1
    name = ((body.get("result") or {}) if isinstance(body.get("result"), dict) else {}).get("name")
    if name != expected_name:
        print(
            f"Refusing to apply: zone name is {name!r}, expected {expected_name!r}. "
            "This rule is only for the marketing zone (www + apex). "
            "api.ondorealestate.com / app.ondorealestate.com must not get this cache policy."
        )
        return 1
    print(f"Zone ok: {name}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    load_env_file(SCRIPT_DIR / "cf.env")
    token = os.environ.get("CF_API_TOKEN") or os.environ.get("CLOUDFLARE_API_TOKEN")
    zone_id = os.environ.get("CF_ZONE_ID") or os.environ.get("CLOUDFLARE_ZONE_ID")

    spec = json.loads(SPEC_PATH.read_text())
    expected_zone = spec["expected_zone_name"]
    rule = spec["rule"]
    payload = rule_payload(rule)
    print(f"Rule: {payload['description']}")
    print(f"Expression: {payload['expression']}")

    if args.dry_run:
        print("Dry run — not writing Cache Rules.")
        print(json.dumps({"expected_zone_name": expected_zone, "rule": payload}, indent=2))
        if not token or not zone_id:
            print("No credentials; skipped zone check.")
            return 0
        return verify_zone(token, zone_id, expected_zone)

    if not token or not zone_id:
        print("Missing CF_API_TOKEN or CF_ZONE_ID (see scripts/cf.env).")
        return 1

    zone_rc = verify_zone(token, zone_id, expected_zone)
    if zone_rc != 0:
        return zone_rc

    status, body = api(
        token,
        "GET",
        f"{API}/zones/{zone_id}/rulesets/phases/{PHASE}/entrypoint",
    )
    if status == 403:
        print(
            "Cloudflare 403: this token cannot edit Cache Rules "
            "(Analytics:Read is not enough). Use the dashboard steps in the "
            "docstring, or put a token with Zone > Cache Rules > Edit in cf.env."
        )
        return 2
    if status not in (200, 404):
        print(f"Failed to read cache ruleset ({status}): {first_error(body)}")
        return 1

    if status == 404:
        create_status, create_body = api(
            token,
            "POST",
            f"{API}/zones/{zone_id}/rulesets",
            {
                "name": "Cache Rules",
                "kind": "zone",
                "phase": PHASE,
                "rules": [payload],
            },
        )
        if create_status in (200, 201):
            print("Created http_request_cache_settings ruleset and deployed the rule.")
            return 0
        print(f"Create ruleset failed ({create_status}): {first_error(create_body)}")
        return 1

    result = body.get("result") if isinstance(body, dict) else None
    if not isinstance(result, dict):
        print("Unexpected ruleset payload.")
        return 1
    ruleset_id = result.get("id")
    existing_list = result.get("rules") or []
    existing = find_existing(existing_list, payload)

    if existing:
        rule_id = existing.get("id")
        if same_rule(existing, payload):
            print(f"Already up to date (id {rule_id}, enabled={existing.get('enabled')}).")
            return 0
        patch_status, patch_body = api(
            token,
            "PATCH",
            f"{API}/zones/{zone_id}/rulesets/{ruleset_id}/rules/{rule_id}",
            payload,
        )
        if patch_status in (200, 201):
            print(f"Updated cache rule {rule_id}.")
            return 0
        print(f"Update rule failed ({patch_status}): {first_error(patch_body)}")
        return 1

    add_status, add_body = api(
        token,
        "POST",
        f"{API}/zones/{zone_id}/rulesets/{ruleset_id}/rules",
        payload,
    )
    if add_status in (200, 201):
        print("Added cache rule to the existing http_request_cache_settings ruleset.")
        return 0
    print(f"Add rule failed ({add_status}): {first_error(add_body)}")
    return 1


if __name__ == "__main__":
    sys.exit(main())

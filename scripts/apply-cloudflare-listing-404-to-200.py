#!/usr/bin/env python3
"""
Idempotent apply of the www/apex listing 404→200 Cloudflare Snippet.

GitHub Pages is the origin. Cloudflare is the proxy (same zone as the HTML
cache rule). Do not migrate to Cloudflare Pages. Do not grey-cloud DNS.

A _redirects 200 rewrite is not used: it would replace prerendered
/properties/{id}/ HTML with the 404 shell. This snippet fetches origin first
and only substitutes /404.html when origin already returned 404.

Usage:
    python3 scripts/apply-cloudflare-listing-404-to-200.py
    python3 scripts/apply-cloudflare-listing-404-to-200.py --dry-run
    python3 scripts/apply-cloudflare-listing-404-to-200.py --print-dashboard

Reads scripts/cf.env (gitignored) or the environment:
    CF_API_TOKEN   Zone > Snippets > Write (+ Zone > Zone > Read)
    CF_ZONE_ID     must be the ondorealestate.com zone
    Aliases: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID

Zone > Zone > Read is not enough. Wrangler (workers:write) cannot create
Snippets. A 403 means paste in the dashboard — this script cannot mint
Cloudflare token permissions.

If this exits 403 (or you pass --print-dashboard):
    Rules → Snippets → Create  (zone ondorealestate.com)
    Name: listing-404-to-200
    Code: scripts/cloudflare-listing-404-to-200.js
    Expression: www + apex GET/HEAD, path ^/properties/[^/]+/?$
    Hosts: www.ondorealestate.com and ondorealestate.com only.
    Never match api.ondorealestate.com or app.ondorealestate.com.
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
SPEC_PATH = SCRIPT_DIR / "cloudflare-listing-404-to-200.json"
API = "https://api.cloudflare.com/client/v4"


def load_env_file(path: Path) -> None:
    if not path.is_file():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def api(
    token: str,
    method: str,
    url: str,
    payload: dict | None = None,
    raw: bytes | None = None,
    content_type: str | None = None,
) -> tuple[int, dict | str]:
    data = raw
    if data is None and payload is not None:
        data = json.dumps(payload).encode()
    headers = {"Authorization": f"Bearer {token}"}
    headers["Content-Type"] = content_type or "application/json"
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as exc:
        raw_body = exc.read().decode()
        try:
            return exc.code, json.loads(raw_body)
        except json.JSONDecodeError:
            return exc.code, raw_body


def first_error(body: dict | str) -> str:
    if isinstance(body, dict):
        errors = body.get("errors") or []
        if errors:
            return str(errors[0].get("message") or errors[0])
    return str(body)[:240]


def print_dashboard_steps(spec: dict, desired: dict, js: str, account_id: str | None) -> None:
    name = spec["snippet_name"]
    zone_name = spec["expected_zone_name"]
    dash = (
        f"https://dash.cloudflare.com/{account_id}/{zone_name}/rules/snippets"
        if account_id
        else "https://dash.cloudflare.com/?to=/:account/:zone/rules/snippets"
    )
    print()
    print("Dashboard paste (Rules → Snippets → Create, then Deploy):")
    print(f"  URL:  {dash}")
    print(f"  Zone: {zone_name}")
    print(f"  Name: {name}")
    print("  Hosts: www.ondorealestate.com and ondorealestate.com")
    print("  Never: api.ondorealestate.com, app.ondorealestate.com")
    print("  Expression:")
    print(f"    {desired['expression']}")
    print("  Code (paste the whole file):")
    print("----- begin snippet -----")
    print(js.rstrip())
    print("----- end snippet -----")
    print("After Deploy, a missing /properties/{uuid}/ on www should be HTTP 200")
    print("with the 404.html shell. A prerendered listing must still 200 from origin.")


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
            "This snippet is only for the marketing zone (www + apex)."
        )
        return 1
    print(f"Zone ok: {name}")
    return 0


def multipart_snippet(js: bytes, main_module: str) -> tuple[bytes, str]:
    boundary = "----OndoListingSnippetBoundary"
    metadata = json.dumps({"main_module": main_module}).encode()
    chunks = [
        (
            f"--{boundary}\r\n"
            "Content-Disposition: form-data; name=\"metadata\"\r\n"
            "Content-Type: application/json\r\n\r\n"
        ).encode()
        + metadata
        + b"\r\n",
        (
            f"--{boundary}\r\n"
            f"Content-Disposition: form-data; name=\"files\"; filename=\"{main_module}\"\r\n"
            "Content-Type: application/javascript\r\n\r\n"
        ).encode()
        + js
        + b"\r\n",
        f"--{boundary}--\r\n".encode(),
    ]
    return b"".join(chunks), f"multipart/form-data; boundary={boundary}"


def snippet_rule_payload(spec: dict) -> dict:
    return {
        "expression": spec["rule"]["expression"],
        "snippet_name": spec["snippet_name"],
        "description": spec["rule"]["description"],
        "enabled": spec["rule"].get("enabled", True),
    }


def merge_snippet_rules(existing: list, desired: dict) -> list:
    merged = []
    replaced = False
    for rule in existing:
        if not isinstance(rule, dict):
            continue
        if rule.get("snippet_name") == desired["snippet_name"]:
            keep = {k: v for k, v in rule.items() if k in ("id", "snippet_name")}
            keep.update(desired)
            merged.append(keep)
            replaced = True
        else:
            merged.append(rule)
    if not replaced:
        merged.append(desired)
    return merged


def existing_rules(body: dict | str) -> list:
    if not isinstance(body, dict):
        return []
    result = body.get("result")
    if isinstance(result, list):
        return result
    if isinstance(result, dict):
        rules = result.get("rules")
        if isinstance(rules, list):
            return rules
    return []


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument(
        "--print-dashboard",
        action="store_true",
        help="Print the Rules → Snippets paste and exit (no API write).",
    )
    args = parser.parse_args()

    load_env_file(SCRIPT_DIR / "cf.env")
    token = os.environ.get("CF_API_TOKEN") or os.environ.get("CLOUDFLARE_API_TOKEN")
    zone_id = os.environ.get("CF_ZONE_ID") or os.environ.get("CLOUDFLARE_ZONE_ID")
    account_id = os.environ.get("CF_ACCOUNT_ID") or os.environ.get("CLOUDFLARE_ACCOUNT_ID")

    spec = json.loads(SPEC_PATH.read_text())
    js_path = SCRIPT_DIR / spec["source_file"]
    js = js_path.read_bytes()
    js_text = js.decode()
    desired = snippet_rule_payload(spec)

    print(f"Snippet: {spec['snippet_name']}")
    print(f"Expression: {desired['expression']}")

    if args.print_dashboard:
        print_dashboard_steps(spec, desired, js_text, account_id)
        return 0

    if args.dry_run:
        print("Dry run — not writing Snippets.")
        print(json.dumps({"expected_zone_name": spec["expected_zone_name"], "rule": desired}, indent=2))
        if not token or not zone_id:
            print("No credentials; skipped zone check.")
            return 0
        return verify_zone(token, zone_id, spec["expected_zone_name"])

    if not token or not zone_id:
        print("Missing CF_API_TOKEN or CF_ZONE_ID (see scripts/cf.env).")
        print_dashboard_steps(spec, desired, js_text, account_id)
        return 1

    zone_rc = verify_zone(token, zone_id, spec["expected_zone_name"])
    if zone_rc != 0:
        return zone_rc

    body, content_type = multipart_snippet(js, spec["main_module"])
    put_status, put_body = api(
        token,
        "PUT",
        f"{API}/zones/{zone_id}/snippets/{spec['snippet_name']}",
        raw=body,
        content_type=content_type,
    )
    if put_status == 403:
        print(
            "Cloudflare 403: this token cannot write Snippets "
            "(need Zone > Snippets > Write; Zone > Zone > Read is not enough). "
            "Wrangler workers:write cannot create Snippets either."
        )
        print_dashboard_steps(spec, desired, js_text, account_id)
        return 2
    if put_status not in (200, 201):
        print(f"Upload snippet failed ({put_status}): {first_error(put_body)}")
        return 1
    print("Uploaded snippet listing-404-to-200.")

    list_status, list_body = api(token, "GET", f"{API}/zones/{zone_id}/snippets/snippet_rules")
    if list_status == 403:
        print(
            "Cloudflare 403: snippet uploaded but this token cannot update snippet rules. "
            "Add the rule in Rules → Snippets using the expression below."
        )
        print_dashboard_steps(spec, desired, js_text, account_id)
        return 2
    if list_status not in (200, 404):
        print(f"Failed to list snippet rules ({list_status}): {first_error(list_body)}")
        return 1

    merged = merge_snippet_rules(existing_rules(list_body) if list_status == 200 else [], desired)
    update_status, update_body = api(
        token,
        "PUT",
        f"{API}/zones/{zone_id}/snippets/snippet_rules",
        payload={"rules": merged},
    )
    if update_status not in (200, 201):
        print(f"Update snippet rules failed ({update_status}): {first_error(update_body)}")
        return 1
    print("Snippet rule applied for /properties/:id on www + apex.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

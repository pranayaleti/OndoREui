#!/usr/bin/env python3
"""
Apply Cloudflare agent-readability settings for ondorealestate.com.

The marketing origin is GitHub Pages (static). This script:

1. Turns on zone setting `content_converter` (Markdown for Agents, Pro+).
2. Turns off managed robots.txt (`is_robots_txt_managed`) so origin robots.txt
   is not prepended with Disallow: / for GPTBot / ClaudeBot / etc.
3. Disables `ai_bots_protection` block (WAF) so those crawlers are not 403'd.
4. Uploads the `markdown-negotiate` Snippet that maps Accept: text/markdown
   to the sibling `.md` twin (works on the Free plan).

Usage:
    python3 scripts/apply-cloudflare-agent-readability.py
    python3 scripts/apply-cloudflare-agent-readability.py --dry-run
    python3 scripts/apply-cloudflare-agent-readability.py --print-dashboard

Reads scripts/cf.env (gitignored) or the environment:
    CF_API_TOKEN   needs Zone Settings Edit + Bot Management Write + Snippets Write
    CF_ZONE_ID     ondorealestate.com zone
    Aliases: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID

The Cache Purge + Zone Read deploy token is not sufficient. On 403 this script
prints dashboard steps and exits 2 (same pattern as the listing-404 snippet).
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
SPEC_PATH = SCRIPT_DIR / "cloudflare-markdown-negotiate.json"
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
    zone_name = spec["expected_zone_name"]
    account = account_id or ":account"
    print()
    print("Dashboard steps (token lacks Settings/Bot/Snippets write, or Free plan):")
    print()
    print("1. Stop Cloudflare from blocking AI crawlers in robots.txt")
    print(f"   https://dash.cloudflare.com/{account}/{zone_name}/security/settings")
    print("   Filter Bot traffic → turn OFF")
    print('   "Set your preference to block training in robots.txt"')
    print("   (also called Instruct AI bot traffic with robots.txt).")
    print("   Confirm https://www.ondorealestate.com/robots.txt no longer contains")
    print("   '# BEGIN Cloudflare Managed content' or 'User-agent: GPTBot / Disallow: /'.")
    print()
    print("2. Optional, Pro plan: Markdown for Agents")
    print(f"   https://dash.cloudflare.com/{account}/{zone_name}/ai")
    print("   AI Crawl Control → Markdown for Agents → On.")
    print("   Free plan cannot enable this; use the Snippet in step 3 instead.")
    print()
    print("3. Snippet (Free-plan content negotiation) — Rules → Snippets → Create")
    print(f"   https://dash.cloudflare.com/{account}/{zone_name}/rules/snippets")
    print(f"   Name: {spec['snippet_name']}")
    print("   Hosts: www.ondorealestate.com and ondorealestate.com (never api. or app.)")
    print("   Expression:")
    print(f"     {desired['expression']}")
    print("   Code:")
    print("----- begin snippet -----")
    print(js.rstrip())
    print("----- end snippet -----")
    print()
    print("4. Cache Rules: exclude Accept: text/markdown from the HTML cache rule")
    print("   so HTML and Markdown are not stored under the same cache key.")
    print("   See scripts/cloudflare-cache-html-rule.json")
    print()
    print("Verify:")
    print('  curl -sI https://www.ondorealestate.com/robots.txt | head')
    print("  curl -s  https://www.ondorealestate.com/robots.txt | rg -F 'BEGIN Cloudflare'")
    print('  curl -sIH "Accept: text/markdown" https://www.ondorealestate.com/about/ | grep -i content-type')
    print("  curl -sI https://www.ondorealestate.com/about.md | grep -i content-type")


def verify_zone(token: str, zone_id: str, expected_name: str) -> tuple[int, str | None]:
    status, body = api(token, "GET", f"{API}/zones/{zone_id}")
    if status != 200 or not isinstance(body, dict):
        print(f"Failed to read zone ({status}): {first_error(body)}")
        return 1, None
    result = body.get("result") if isinstance(body.get("result"), dict) else {}
    name = result.get("name")
    plan = ((result.get("plan") or {}) if isinstance(result.get("plan"), dict) else {}).get("name")
    if name != expected_name:
        print(f"Refusing: zone name is {name!r}, expected {expected_name!r}.")
        return 1, None
    print(f"Zone ok: {name} (plan: {plan})")
    return 0, plan if isinstance(plan, str) else None


def multipart_snippet(js: bytes, main_module: str) -> tuple[bytes, str]:
    boundary = "----OndoMarkdownSnippetBoundary"
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


def enable_markdown_setting(token: str, zone_id: str) -> int:
    status, body = api(
        token,
        "PATCH",
        f"{API}/zones/{zone_id}/settings/content_converter",
        {"value": "on"},
    )
    if status == 403:
        print("content_converter: 403 (need Zone Settings Edit; Pro plan for Markdown for Agents).")
        return 2
    if status != 200:
        print(f"content_converter failed ({status}): {first_error(body)}")
        return 1
    value = (body.get("result") or {}).get("value") if isinstance(body, dict) else None
    print(f"content_converter: {value}")
    return 0


def disable_managed_robots(token: str, zone_id: str) -> int:
    status, body = api(token, "GET", f"{API}/zones/{zone_id}/bot_management")
    if status == 403:
        print("bot_management: 403 (need Bot Management Write).")
        return 2
    if status != 200 or not isinstance(body, dict) or not isinstance(body.get("result"), dict):
        print(f"bot_management GET failed ({status}): {first_error(body)}")
        return 1
    current = dict(body["result"])
    current.pop("stale_zone_configuration", None)
    current["is_robots_txt_managed"] = False
    current["ai_bots_protection"] = "disabled"
    if current.get("crawler_protection") == "enabled":
        current["crawler_protection"] = "disabled"
    put_status, put_body = api(token, "PUT", f"{API}/zones/{zone_id}/bot_management", current)
    if put_status == 403:
        print("bot_management PUT: 403.")
        return 2
    if put_status not in (200, 201):
        print(f"bot_management PUT failed ({put_status}): {first_error(put_body)}")
        return 1
    print("bot_management: is_robots_txt_managed=false, ai_bots_protection=disabled.")
    return 0


def apply_snippet(token: str, zone_id: str, spec: dict, js: bytes) -> int:
    body, content_type = multipart_snippet(js, spec["main_module"])
    put_status, put_body = api(
        token,
        "PUT",
        f"{API}/zones/{zone_id}/snippets/{spec['snippet_name']}",
        raw=body,
        content_type=content_type,
    )
    if put_status == 403:
        print("snippets: 403 (need Zone > Snippets > Write).")
        return 2
    if put_status not in (200, 201):
        print(f"Upload snippet failed ({put_status}): {first_error(put_body)}")
        return 1
    print(f"Uploaded snippet {spec['snippet_name']}.")

    desired = snippet_rule_payload(spec)
    list_status, list_body = api(token, "GET", f"{API}/zones/{zone_id}/snippets/snippet_rules")
    if list_status == 403:
        print("snippet rules: 403. Add the expression in Rules → Snippets.")
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
    print("Snippet rule applied for Accept: text/markdown on www + apex.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--print-dashboard", action="store_true")
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

    if args.print_dashboard:
        print_dashboard_steps(spec, desired, js_text, account_id)
        return 0

    if args.dry_run:
        print("Dry run — not writing Cloudflare settings.")
        print(json.dumps({"snippet": spec["snippet_name"], "expression": desired["expression"]}, indent=2))
        return 0

    if not token or not zone_id:
        print("Missing CF_API_TOKEN or CF_ZONE_ID (see scripts/cf.env).")
        print_dashboard_steps(spec, desired, js_text, account_id)
        return 1

    zone_rc, plan = verify_zone(token, zone_id, spec["expected_zone_name"])
    if zone_rc != 0:
        return zone_rc
    if plan and "free" in plan.lower():
        print("Plan is Free: Markdown for Agents (content_converter) is Pro+. Using the Snippet path.")

    codes = [
        enable_markdown_setting(token, zone_id),
        disable_managed_robots(token, zone_id),
        apply_snippet(token, zone_id, spec, js),
    ]
    if any(code == 2 for code in codes):
        print_dashboard_steps(spec, desired, js_text, account_id)
        return 2
    if any(code != 0 for code in codes):
        print_dashboard_steps(spec, desired, js_text, account_id)
        return 1
    print("Agent-readability Cloudflare settings applied.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

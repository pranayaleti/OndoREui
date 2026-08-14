#!/usr/bin/env python3
"""
cf_report.py — pull Cloudflare zone (and optional Worker) analytics for the
ondo-morning-brief scheduled task.

Usage:
    python3 cf_report.py 7 --compare

Reads credentials from environment variables (populate via cf.env, sourced by
the caller before this script runs):
    CF_API_TOKEN     required — Account Analytics:Read + Zone Analytics:Read
    CF_ZONE_ID        required — the ondorealestate.com zone ID
    CF_ACCOUNT_ID     optional — enables Worker (ondo-api-gateway) health section
    CF_WORKER_SCRIPT  optional — worker script name, default "ondo-api-gateway"

Output: plain text summary to stdout. Never raises on missing optional data —
prints "not available" for sections it can't fetch instead of failing the
whole report.
"""

import os
import sys
import json
import argparse
import datetime
import urllib.request
import urllib.error

GRAPHQL_URL = "https://api.cloudflare.com/client/v4/graphql"


def load_env_file(path):
    """Minimal .env parser fallback, in case the caller didn't `source` it."""
    if not os.path.isfile(path):
        return
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            k, v = k.strip(), v.strip().strip('"').strip("'")
            os.environ.setdefault(k, v)


def gql(token, query, variables):
    body = json.dumps({"query": query, "variables": variables}).encode()
    req = urllib.request.Request(
        GRAPHQL_URL,
        data=body,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"Cloudflare API HTTP {e.code}: {e.read().decode()[:300]}")
    except urllib.error.URLError as e:
        raise RuntimeError(f"Cloudflare API network error: {e}")
    if data.get("errors"):
        raise RuntimeError(f"Cloudflare API errors: {data['errors']}")
    return data["data"]


ZONE_QUERY = """
query ZoneReport($zoneTag: string!, $since: Time!, $until: Time!) {
  viewer {
    zones(filter: { zoneTag: $zoneTag }) {
      httpRequestsAdaptiveGroups(
        limit: 10000
        filter: { datetime_geq: $since, datetime_lt: $until }
      ) {
        count
        sum {
          visits
          edgeResponseBytes
        }
        dimensions {
          clientCountryName
          clientRequestHTTPHost
        }
        avg {
          sampleInterval
        }
      }
      httpRequestsAdaptiveGroupsCache: httpRequestsAdaptiveGroups(
        limit: 1
        filter: { datetime_geq: $since, datetime_lt: $until, cacheStatus: "hit" }
      ) {
        count
      }
      httpRequestsAdaptiveGroupsStatus: httpRequestsAdaptiveGroups(
        limit: 500
        filter: { datetime_geq: $since, datetime_lt: $until }
      ) {
        count
        dimensions {
          edgeResponseStatus
        }
      }
    }
  }
}
"""

FIREWALL_QUERY = """
query FirewallReport($zoneTag: string!, $since: Time!, $until: Time!) {
  viewer {
    zones(filter: { zoneTag: $zoneTag }) {
      firewallEventsAdaptiveGroups(
        limit: 1
        filter: { datetime_geq: $since, datetime_lt: $until }
      ) {
        count
      }
    }
  }
}
"""

WORKER_QUERY = """
query WorkerReport($accountTag: string!, $since: Time!, $until: Time!, $scriptName: string!) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      workersInvocationsAdaptive(
        limit: 1000
        filter: { datetime_geq: $since, datetime_lt: $until, scriptName: $scriptName }
      ) {
        sum {
          requests
          errors
          subrequests
        }
        quantiles {
          cpuTimeP50
          cpuTimeP99
        }
      }
    }
  }
}
"""


def iso(dt):
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


def day_bounds(days_ago):
    today = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    start = today - datetime.timedelta(days=days_ago)
    end = start + datetime.timedelta(days=1)
    return start, end


def fetch_zone_window(token, zone_id, since_dt, until_dt):
    data = gql(token, ZONE_QUERY, {
        "zoneTag": zone_id,
        "since": iso(since_dt),
        "until": iso(until_dt),
    })
    zones = data["viewer"]["zones"]
    if not zones:
        raise RuntimeError("No zone data returned — check CF_ZONE_ID and token scope.")
    z = zones[0]

    groups = z["httpRequestsAdaptiveGroups"]
    total_requests = sum(g["count"] for g in groups)
    total_visits = sum(g["sum"]["visits"] for g in groups)

    countries = {}
    for g in groups:
        c = g["dimensions"]["clientCountryName"] or "Unknown"
        countries[c] = countries.get(c, 0) + g["count"]
    top_countries = sorted(countries.items(), key=lambda kv: -kv[1])[:5]

    cached = sum(g["count"] for g in z["httpRequestsAdaptiveGroupsCache"])
    cache_pct = (cached / total_requests * 100) if total_requests else 0.0

    status_groups = z["httpRequestsAdaptiveGroupsStatus"]
    err4xx = sum(g["count"] for g in status_groups if 400 <= (g["dimensions"]["edgeResponseStatus"] or 0) < 500)
    err5xx = sum(g["count"] for g in status_groups if (g["dimensions"]["edgeResponseStatus"] or 0) >= 500)
    err_rate = ((err4xx + err5xx) / total_requests * 100) if total_requests else 0.0

    threats = None
    try:
        fw_data = gql(token, FIREWALL_QUERY, {
            "zoneTag": zone_id,
            "since": iso(since_dt),
            "until": iso(until_dt),
        })
        fw_zones = fw_data["viewer"]["zones"]
        if fw_zones:
            threats = sum(g["count"] for g in fw_zones[0]["firewallEventsAdaptiveGroups"])
    except RuntimeError:
        threats = None  # not available on this plan / token scope

    return {
        "requests": total_requests,
        "visits": total_visits,
        "page_views": total_requests,  # adaptive groups don't split pageviews; requests is closest proxy
        "cache_pct": round(cache_pct, 2),
        "err_rate_pct": round(err_rate, 2),
        "err4xx": err4xx,
        "err5xx": err5xx,
        "threats": threats,
        "top_countries": top_countries,
    }


def fetch_worker_window(token, account_id, script_name, since_dt, until_dt):
    data = gql(token, WORKER_QUERY, {
        "accountTag": account_id,
        "since": iso(since_dt),
        "until": iso(until_dt),
        "scriptName": script_name,
    })
    accounts = data["viewer"]["accounts"]
    if not accounts or not accounts[0]["workersInvocationsAdaptive"]:
        return None
    rows = accounts[0]["workersInvocationsAdaptive"]
    requests = sum(r["sum"]["requests"] for r in rows)
    errors = sum(r["sum"]["errors"] for r in rows)
    err_rate = (errors / requests * 100) if requests else 0.0
    return {"requests": requests, "errors": errors, "err_rate_pct": round(err_rate, 2)}


def fmt_zone(label, w):
    lines = [f"-- {label} --"]
    if w is None:
        lines.append("  not available")
        return "\n".join(lines)
    lines.append(f"  Requests: {w['requests']:,}")
    lines.append(f"  Visits (unique visitor proxy): {w['visits']:,}")
    lines.append(f"  Cache hit: {w['cache_pct']}%")
    lines.append(f"  4xx/5xx error rate: {w['err_rate_pct']}% ({w['err4xx']} 4xx / {w['err5xx']} 5xx)")
    threats_str = f"{w['threats']:,}" if w["threats"] is not None else "not available on this plan"
    lines.append(f"  Threats blocked: {threats_str}")
    if w["top_countries"]:
        top = ", ".join(f"{c} ({n:,})" for c, n in w["top_countries"])
        lines.append(f"  Top countries: {top}")
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("days", type=int, nargs="?", default=7, help="trailing window size in days")
    parser.add_argument("--compare", action="store_true", help="also show yesterday vs prior day")
    args = parser.parse_args()

    script_dir = os.path.dirname(os.path.abspath(__file__))
    load_env_file(os.path.join(script_dir, "cf.env"))

    token = os.environ.get("CF_API_TOKEN") or os.environ.get("CLOUDFLARE_API_TOKEN")
    zone_id = os.environ.get("CF_ZONE_ID") or os.environ.get("CLOUDFLARE_ZONE_ID")
    account_id = os.environ.get("CF_ACCOUNT_ID")
    worker_script = os.environ.get("CF_WORKER_SCRIPT", "ondo-api-gateway")

    if not token or not zone_id:
        print("Cloudflare: not connected — set CF_API_TOKEN and CF_ZONE_ID (see scripts/cf.env).")
        sys.exit(0)

    try:
        yest_start, yest_end = day_bounds(1)
        prior_start, prior_end = day_bounds(2)
        week_start, week_end = day_bounds(args.days)

        yesterday = fetch_zone_window(token, zone_id, yest_start, yest_end)
        print(fmt_zone("Yesterday", yesterday))

        if args.compare:
            prior = fetch_zone_window(token, zone_id, prior_start, prior_end)
            print()
            print(fmt_zone("Prior day", prior))

            week = fetch_zone_window(token, zone_id, week_start, week_end)
            avg_requests = week["requests"] / args.days
            avg_visits = week["visits"] / args.days
            print()
            print(f"-- {args.days}-day average --")
            print(f"  Requests/day: {avg_requests:,.0f}")
            print(f"  Visits/day: {avg_visits:,.0f}")
            print(f"  Cache hit: {week['cache_pct']}%")
            print(f"  4xx/5xx error rate: {week['err_rate_pct']}%")

        if account_id:
            print()
            worker_yest = fetch_worker_window(token, account_id, worker_script, yest_start, yest_end)
            if worker_yest:
                print(f"-- Worker health ({worker_script}), yesterday --")
                print(f"  Requests: {worker_yest['requests']:,}")
                print(f"  Errors: {worker_yest['errors']:,} ({worker_yest['err_rate_pct']}%)")
            else:
                print(f"Worker ({worker_script}): no invocation data for yesterday")
        else:
            print()
            print("Worker health: not available — set CF_ACCOUNT_ID in cf.env to enable")

    except RuntimeError as e:
        print(f"Cloudflare: error — {e}")
        sys.exit(0)


if __name__ == "__main__":
    main()

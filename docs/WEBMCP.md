# WebMCP alignment (Ondo RE consumer site)

This app is aligned with [WebMCP](https://developer.chrome.com/blog/webmcp-epp) (Chrome Early Preview Program / W3C draft) so AI agents can discover and use key actions reliably.

## What we implement

- **Progressive enhancement**: WebMCP tools register only when the browser already exposes `navigator.modelContext`. We do not load a global polyfill across the marketing site.
- **Declarative API**: Public HTML forms use `toolname`, `tooldescription`, `toolparamdescription`, and (when the HTML `name` is short) `toolparamtitle`. Browsers that support declarative WebMCP derive a JSON schema from the form.
  - **Contact** (`/contact`): `submit_contact_lead` — no `toolautosubmit`; the user (or `requestUserInteraction`) must confirm. `SubmitEvent.agentInvoked` + `respondWith()` return JSON to the agent without a navigation. `:tool-form-active` / `.tool-form-active` highlight the form while an agent fill is pending.
  - **Homepage ZIP** (`lookup_utah_zip_services`) and **ZIP search** (`search_city_by_zip`): `toolautosubmit` — read-only lookup / navigation.
  - **Properties search box** (`search_listings_by_text`): `toolautosubmit` — filters or navigates to listings.
- **Imperative API**:
  - **Contact** (`/contact`): `submit_contact_lead` (write; `readOnlyHint: false`) and `get_company_contact_info` (read-only).
  - **Opportunities** (`/investments/opportunities`): `list_investment_opportunities` and `get_investment_opportunity` (read-only; `untrustedContentHint` because deal copy is unstructured text).
  - **Buy** (`/buy`): `calculate_mortgage_payment` (read-only; principal, rate, term → monthly P&I).
  - **Properties** (`/properties`): `search_available_properties` (read-only; `untrustedContentHint` because listing descriptions are externally sourced).

Each imperative tool also sets a human-readable `title` for the browser’s tool inspector.

Shared attribute helpers live in `lib/webmcp-attrs.ts`.

## Tool descriptions

Descriptions are written so agents know when to use each tool and what to expect. Keep them under Chrome’s recommended budgets (30 chars for names, 150 for param descriptions, 500 for tool descriptions, 1.5K per output).

- **submit_contact_lead**: For property management, investments, or leasing inquiries in Utah; requires name and email. User confirmation is required. When the user’s tab has captured marketing params (UTMs / click ids from the landing URL), those are attached automatically on submit and stored on the lead in Supabase (`website_leads.attribution`).
- **get_company_contact_info**: Read-only; returns company name, URL, phone, address, business hours, Calendly scheduling URL (`calendlyUrl`), and topic-specific emails (e.g. investors, notary, mortgage).
- **list_investment_opportunities**: Read-only; returns open/coming-soon/fully-funded deals with slug, title, location, asset class, min investment, target return, hold period, status, and a short description. Optional `status` filter.
- **get_investment_opportunity**: Read-only; returns full details for one deal by slug (title, location, description, highlights, risk factors, etc.).
- **calculate_mortgage_payment**: Read-only; given principal (USD), annual rate (%), and term (years), returns monthly principal-and-interest payment. Does not include taxes, insurance, or PMI. Not a loan offer.
- **search_available_properties**: Read-only; fetches the current Ondo public listings feed and filters client-side by city (partial, case-insensitive), min bedrooms, max monthly rent, and/or free text (matched against title, description, address). Returns id, title, city, address, price, bedrooms, bathrooms, sqft, and a 200-char description; capped at 100 results per call.

## Testing

- Use Chrome 146+ with the “Experimental Web Platform features” or “WebMCP” flag enabled.
- The [Model Context Tool Inspector](https://chromewebstore.google.com/detail/model-context-tool-inspector/...) (Chrome Web Store) lets you inspect registered tools and invoke them manually.
- Keep tool count per page low; we only register tools on the pages where they are relevant.

## Security and privacy

- We do not use `toolautosubmit` on the contact form; submission always requires user action or explicit confirmation in the imperative flow.
- `toolautosubmit` is limited to read-only search/lookup forms.
- Write tools set `readOnlyHint: false`. Tools that return listing copy or other unstructured third-party/UGC-like text set `untrustedContentHint: true`.
- Agent-provided input is treated as untrusted; we validate and sanitize before calling our backend.
- No login, signup, payment, or administrative actions are exposed as tools.

## References

- [WebMCP EPP (Chrome blog)](https://developer.chrome.com/blog/webmcp-epp)
- [Declarative API](https://developer.chrome.com/docs/ai/webmcp/declarative-api)
- [Imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api)
- [Tool security](https://developer.chrome.com/docs/ai/webmcp/secure-tools)
- [W3C WebMCP draft](https://webmachinelearning.github.io/webmcp/)
- [Declarative explainer (GitHub)](https://github.com/webmachinelearning/webmcp/blob/main/declarative-api-explainer.md)

## Related

- [Agent readability runbook](./AGENT_READABILITY.md) — content negotiation, Markdown twins, Cloudflare Markdown for Agents, and how to measure crawler traffic in server logs.

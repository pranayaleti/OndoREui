# WebMCP alignment (Ondo RE consumer site)

This app is aligned with [WebMCP](https://developer.chrome.com/blog/webmcp-epp) (Chrome Early Preview Program / W3C draft) so AI agents can discover and use key actions reliably.

## What we implement

- **Progressive enhancement**: WebMCP tools register only when the browser already exposes `navigator.modelContext`. We do not load a global polyfill across the marketing site.
- **Declarative API**: The contact form on `/contact` has `toolname` and `tooldescription` (and `toolparamdescription` on inputs). Browsers that support declarative WebMCP can derive a JSON schema from the form and let agents fill it; the user confirms by submitting.
- **Imperative API**:
  - **Contact** (`/contact`): `submit_contact_lead` (with user confirmation) and `get_company_contact_info` (read-only).
  - **Opportunities** (`/investments/opportunities`): `list_investment_opportunities` (read-only, optional status filter) and `get_investment_opportunity` (read-only, by slug).
  - **Buy** (`/buy`): `calculate_mortgage_payment` (read-only; principal, rate, term → monthly P&I).

## Tool descriptions

Descriptions are written so agents know when to use each tool and what to expect:

- **submit_contact_lead**: For property management, investments, or leasing inquiries in Utah; requires name and email; we ask for user confirmation before sending. When the user’s tab has captured marketing params (UTMs / click ids from the landing URL), those are attached automatically on submit and stored on the lead in Supabase (`website_leads.attribution`).
- **get_company_contact_info**: Read-only; returns company name, URL, phone, address, business hours, Calendly scheduling URL (`calendlyUrl`), and topic-specific emails (e.g. investors, notary, mortgage).
- **list_investment_opportunities**: Read-only; returns open/coming-soon/fully-funded deals with slug, title, location, asset class, min investment, target return, hold period, status, and a short description. Optional `status` filter.
- **get_investment_opportunity**: Read-only; returns full details for one deal by slug (title, location, description, highlights, risk factors, etc.).
- **calculate_mortgage_payment**: Read-only; given principal (USD), annual rate (%), and term (years), returns monthly principal-and-interest payment. Does not include taxes, insurance, or PMI.

## Testing

- Use Chrome 146+ with the “Experimental Web Platform features” or “WebMCP” flag enabled.
- The [Model Context Tool Inspector](https://chromewebstore.google.com/detail/model-context-tool-inspector/...) (Chrome Web Store) lets you inspect registered tools and invoke them manually.
- Keep tool count per page low; we only register tools on the pages where they are relevant.

## Security and privacy

- We do not use `toolautosubmit` on the contact form; submission always requires user action or explicit confirmation in the imperative flow.
- Agent-provided input is treated as untrusted; we validate and sanitize before calling our backend.
- No administrative or destructive actions are exposed as tools.

## References

- [WebMCP EPP (Chrome blog)](https://developer.chrome.com/blog/webmcp-epp)
- [W3C WebMCP draft](https://webmachinelearning.github.io/webmcp/)
- [Declarative explainer (GitHub)](https://github.com/webmachinelearning/webmcp/pull/76)

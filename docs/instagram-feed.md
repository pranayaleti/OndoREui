# Instagram feed (/instagram)

`/instagram` shows the latest 12 posts from @OndoRealEstate. The site is a static export, so the
posts are pulled at build time by `scripts/fetch-instagram.ts` and saved to:

- `lib/instagram-feed.json`, the list the page renders
- `public/images/instagram/<post id>.webp`, a 640px square copy of each image

The images are copied onto our own site because Instagram's CDN links expire within days, and
loading them from Instagram would send every visitor's data to Meta, which the privacy policy does
not cover.

The page is `noindex` and left out of the sitemap, because the posts themselves live on Instagram.

## How it refreshes

`deploy.yml` runs `npm run fetch:instagram` before every production build. The feed is therefore as
fresh as the last deploy. A post published today shows up after the next push to `main`, or after
**Actions → Deploy static site to GitHub Pages → Run workflow**.

The step never fails the deploy. With no token, an expired token or an Instagram outage, it logs a
warning and the build ships whatever `lib/instagram-feed.json` is committed. If nothing has been
committed yet, the page shows a "Follow @OndoRealEstate" card.

## One-time setup

The account must be an Instagram **professional** (Business or Creator) account.

### Option A: Instagram API with Instagram Login (simplest)

1. At developers.facebook.com, create an app (type **Business**) and add the **Instagram** product.
2. Under *API setup with Instagram login*, add @OndoRealEstate as an account and generate a token with
   the `instagram_business_basic` permission.
3. Exchange it for a long-lived token (valid 60 days):
   `GET https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=<app secret>&access_token=<short token>`
4. In GitHub (OndoREui repo → Settings → Secrets and variables → Actions), add the repository
   **secret** `IG_ACCESS_TOKEN`. Leave `IG_USER_ID` unset.

The token expires after 60 days. Before then, refresh it and update the secret:
`GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=<token>`

### Option B: Facebook Login (the pair OndoRESocial uses)

If the Instagram account is linked to the Ondo Facebook Page and OndoRESocial already has a Page token,
reuse it: set the secret `IG_ACCESS_TOKEN` to that token and the repository **variable** `IG_USER_ID` to
the Instagram business account id. A Page token from a system user does not expire.

## Running it locally

```bash
IG_ACCESS_TOKEN=... npm run fetch:instagram         # Option A
IG_ACCESS_TOKEN=... IG_USER_ID=... npm run fetch:instagram   # Option B
```

Commit `lib/instagram-feed.json` and `public/images/instagram/` if you want that snapshot to be the
fallback that ships when the token is missing or expired.

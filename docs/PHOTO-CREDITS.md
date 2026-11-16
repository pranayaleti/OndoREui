# Photo credits

Banner photographs in `public/banners/`. All three are free to use commercially without attribution
(public domain or CC0). They are credited here anyway, and so the licence can be re-checked.

Each file is a 1600x667 crop of the source, converted to greyscale WebP. `components/page-banner.tsx`
shows them under a dark scrim, as decoration only (`alt=""`).

| File | Subject | Author | Licence | Source |
|---|---|---|---|---|
| `utah-mount-timpanogos.webp` | Mount Timpanogos, Uinta-Wasatch-Cache National Forest, June 2019 | USDA Forest Service, Intermountain Region (photo by Nathan Lowe) | Public domain (US government work) | https://commons.wikimedia.org/wiki/File:20190612-FS-UWC_NF-NL-Mount_Timpanogos-01_(48937237803).jpg |
| `utah-lake-wasatch.webp` | Utah Lake and the Wasatch Range, with Mount Timpanogos, from the Lake Mountain area | Bureau of Land Management, Utah | Public domain (US government work) | https://commons.wikimedia.org/wiki/File:Lake_Mountain_area_with_views_of_Mount_Timpanogos_(50702965666).jpg |
| `utah-mountain-clouds.webp` | Mountain in cloud above Draper, Utah, March 2017 | Mike Newbry, via Unsplash | CC0 | https://commons.wikimedia.org/wiki/File:Mountains_and_clouds_(Unsplash).jpg |

Licences are as stated on each Wikimedia Commons file page on 2026-11-14. Check the page again before
reusing a photo somewhere new.

## Which pages get which photo

Pages still name the old stock files in `backgroundImage` (their Open Graph metadata uses the same
names). `bannerImageSrc()` in `components/page-banner.tsx` swaps them:

| Old stock file | Banner photo |
|---|---|
| `modern-office-building`, `property-manager-meeting` | `utah-mount-timpanogos.webp` |
| `suburban-house-garden` | `utah-lake-wasatch.webp` |
| `modern-apartment-balcony`, `modern-townhouse-garage` | `utah-mountain-clouds.webp` |

A page that names no image gets the brand banner (the logo ring on black). To use one of your own
photos, add it to `public/` as WebP and name it in that page's `backgroundImage`.

## Link-preview cards

The share images in `public/og/` (one brand card and one per service) are rendered by
`scripts/generate-share-images.mjs` from the same three photographs, the Ondo mark and the site fonts.
`lib/share-images.ts` lists them and decides which section shares which card. Rerun the script after a
headline on one of those pages changes.

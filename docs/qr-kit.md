# Ondo QR kit

Every QR code and short link below opens ondorealestate.com/links, the page for leads
coming from social bios and print. Each placement has its own short link, so analytics can
tell which placement brings visits and leads. **Use the file made for the placement.** A
business-card code on a yard sign still works, but the sign's traffic gets counted as
business-card traffic.

| Placement | Short link | Files in `public/qr/` | Shows up in analytics as |
|---|---|---|---|
| Business cards | ondorealestate.com/go/card/ | `ondo-links-card.svg` / `.png` | source `business_card`, medium `qr` |
| Yard and for-sale signs | ondorealestate.com/go/sign/ | `ondo-links-sign.svg` / `.png` | source `yard_sign`, medium `qr` |
| Flyers, postcards, brochures | ondorealestate.com/go/flyer/ | `ondo-links-flyer.svg` / `.png` | source `flyer`, medium `qr` |
| Open house table tents, sign-in sheets | ondorealestate.com/go/openhouse/ | `ondo-links-openhouse.svg` / `.png` | source `open_house`, medium `qr` |
| Office window and door | ondorealestate.com/go/office/ | `ondo-links-office.svg` / `.png` | source `office_window`, medium `qr` |
| Codes shown on the website | ondorealestate.com/go/web/ | `ondo-links-web.svg` / `.png`, and `public/links-qr.svg` | source `website`, medium `qr` |
| Email signature (a link, no QR) | https://www.ondorealestate.com/go/email/ | none | source `email_signature`, medium `email` |

## Printing

- **Send the SVG to printers and designers.** It is vector, so it stays sharp at any size. Use the 2048px PNG for Canva, slides, or anything that won't take SVG.
- **Minimum size:** 2 cm (0.8 in) square on anything held in the hand (cards, flyers, table tents). For things read from a distance, make the code at least a tenth of the scanning distance: a sign read from 1.5 m (5 ft) needs a code at least 15 cm (6 in) across.
- **Keep the white border.** The quiet zone around the code is part of the code. Don't crop it or print the code touching other artwork.
- **Black on white only.** Don't recolor, invert, stretch, or put the code on a photo.
- **Scan the final proof before printing,** with an iPhone camera and with an Android phone.

The codes use the highest error correction (level H), so the Ondo mark in the middle, and some wear on an outdoor sign, don't stop them from scanning.

## Changing or adding a placement

1. Edit `lib/qr-placements.json`. The `id` becomes the short link (`/go/<id>/`), and `source` is the name analytics shows.
2. Run `node scripts/generate-qr-kit.mjs`. It redraws every file and fails if any code doesn't scan back to its exact link.
3. Commit the JSON and the regenerated files. `lib/qr-kit-assets.test.ts` fails the build if a committed code and the placement list disagree.

Never change the `id` of a placement that is already printed: the old short link would stop working.

## Where to see results

- **Google Analytics:** Reports → Acquisition → Traffic acquisition, by session source / medium (for example `business_card / qr`). Taps on `/links` buttons are `links_click` events, and quick messages are `generate_lead`.
- **HubSpot:** the visits and the contacts created from `/links` forms carry the same source.

The `/go/` short links go live with the next deploy of the site.

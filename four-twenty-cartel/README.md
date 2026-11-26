# Four Twenty Cartel

A scroll-driven dispensary site built from `../RECREATE_PROMPT.md`. Open `index.html` through any static server, for example `python3 -m http.server` run in this folder. It has no build step, and GSAP, ScrollTrigger and Lenis are bundled in `vendor/`.

## Photos

The gallery, product, and interior slots currently hold placeholder stock photos (see `CREDITS.md`). Replace them with the client's own photos when available: just overwrite the files at the same paths.

## Adding real photos

Every image slot below shows a styled stand-in until a file exists at that path. Drop the file in and it replaces the stand-in automatically, with no code changes.

| File | Where it appears |
|---|---|
| `assets/storefront.jpg` | Hero street scene, revealed through the portal (replaces the illustrated storefront) |
| `assets/mascot.png` | Hero mascot. Use a transparent PNG; it replaces the illustrated stand-in |
| `assets/gallery/01.jpg` … `05.jpg` | "Elevate your everyday" cards: House Choice, The Counter, The Showroom, Glass Gallery, The Room (portrait, 3:4) |
| `assets/products/01.jpg` … `03.jpg` | Collection spotlights: Flower, Plum Velvet, Midnight Sherbet (square) |
| `assets/interior.jpg` | Background of the "Take the feeling with you." section |

## Placeholders to replace
- Brand name is now Four Twenty Cartel; still confirm spelling and logo with the client
- Address, city, hours, rating and phone number in the hero sign, the visit section and the footer
- Product names "Plum Velvet" and "Midnight Sherbet"
- The `tel:` and Google Maps links

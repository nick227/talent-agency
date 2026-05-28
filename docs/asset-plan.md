# Asset Plan

## Required Images

Placeholder images use picsum.photos with fixed seeds for reproducibility.

| Asset | Performer | URL | Used In |
|---|---|---|---|
| margaux-headshot.jpg | Margaux Delacroix | https://picsum.photos/seed/margaux1/800/1067 | Headshot, hero |
| theo-headshot.jpg | Theo Vance | https://picsum.photos/seed/theo1/800/1067 | Headshot, hero |
| ines-headshot.jpg | Inés Nakamura | https://picsum.photos/seed/ines1/800/1067 | Headshot, hero |
| rafferty-headshot.jpg | Rafferty Cole | https://picsum.photos/seed/rafferty1/800/1067 | Headshot, hero |
| zola-headshot.jpg | Zola Mensah | https://picsum.photos/seed/zola1/800/1067 | Headshot, hero |
| petra-headshot.jpg | Petra Wohl | https://picsum.photos/seed/petra1/800/1067 | Headshot, hero |
| luca-headshot.jpg | Luca Ferraro | https://picsum.photos/seed/luca1/800/1067 | Headshot, hero |
| sofia-headshot.jpg | Sofía Reyes | https://picsum.photos/seed/sofia1/800/1067 | Headshot, hero |

## Portfolio Photos Per Performer (3–4 each)

All using picsum.photos with unique seeds. Seeds listed as {name}{n}:
- margaux2–margaux4, theo2–theo4, ines2–ines4, rafferty2–rafferty4
- zola2–zola4, petra2–petra4, luca2–luca4, sofia2–sofia4

Portfolio photo base URL: `https://picsum.photos/seed/{seed}/1200/800`

## Video Reels

Seed data uses placeholder YouTube embed URLs. In production, upload .mp4 files via the file-upload interface.

| Performer | Placeholder URL |
|---|---|
| Margaux Delacroix | https://www.youtube.com/embed/dQw4w9WgXcQ |
| Theo Vance | https://www.youtube.com/embed/dQw4w9WgXcQ |
| Inés Nakamura | https://www.youtube.com/embed/dQw4w9WgXcQ |

## Brand Assets

- TALENT / AGENCY wordmark: typographic only — no image file needed. Rendered as text in DM Sans uppercase tracking.
- No logo image file.
- No favicon image — use a simple text-based SVG or just the T/A initials.

## Usage Map

| Asset | Status | Location |
|---|---|---|
| Performer headshots | Seed (picsum URLs in seed.ts) | PerformerProfile.headshotUrl |
| Portfolio photos | Seed (picsum URLs in seed.ts) | MediaItem.url |
| Video reels | Placeholder YouTube URLs | MediaItem.url (type: VIDEO) |
| Brand wordmark | Typographic (no file) | Shell.tsx, Public nav |

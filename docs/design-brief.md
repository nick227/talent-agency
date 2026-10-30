# Design Brief

## Product

TALENT / AGENCY — a dark editorial talent site for a talent agency to publish performer profiles and route casting inquiries.

## Audience

Casting directors, brand managers, and creative producers browsing a curated performer talent. They expect a premium, selective experience — closer to a gallery or fashion label than a software product.

## Design Direction

Archetype: editorial-agency (custom; luxury/premium direction, NOT marketplace or creator-social)

Identity: premium, quiet
Density: sparse
Shape: sharp (zero border radius — type and image lead, not rounded containers)
Media: editorial (large portrait photography, video reels, full-bleed imagery)

The site is chromeless: the performers are the experience. Interface chrome — nav, borders, controls — recedes to near-invisible. White text on near-black backgrounds. Names in large type. Images nearly full-screen. No colored accents. No decorative elements. No card grids. The brand (TALENT / AGENCY) is a typographic object, not a logo.

## Layout System

Public site: top nav with wordmark (TALENT / AGENCY) + Talent + About links. Full-viewport homepage with rotating performer feature. Talent page as an asymmetric image grid (performer faces, names on hover/tap). Performer profile as a full-width editorial layout — large headshot, name, bio, media gallery, inquiry form.

Admin/Performer: sidebar shell for authenticated users. Clean, dark, operational — but still chromeless. Not dashboard energy.

## Theme Tokens

Dark-first. No light mode.

```
--background: 0 0% 5%;           /* #0D0D0D — near-black */
--foreground: 0 0% 93%;          /* #EDEDED — near-white */
--surface: 0 0% 9%;              /* #171717 — card surface */
--surface-foreground: 0 0% 60%;
--primary: 0 0% 93%;             /* white — primary action color */
--primary-foreground: 0 0% 5%;   /* near-black */
--muted: 0 0% 13%;               /* #212121 */
--muted-foreground: 0 0% 55%;    /* #8C8C8C */
--accent: 0 0% 18%;              /* hover state */
--accent-foreground: 0 0% 93%;
--border: 0 0% 18%;              /* #2E2E2E — nearly invisible */
--input-border: 0 0% 25%;
--ring: 0 0% 60%;
--radius: 0;                     /* SHARP — zero radius */
--radius-sm: 0;
--radius-lg: 0;
```

Typography:
- Display: Cormorant Garamond — editorial serif, high contrast, for performer names at large size
- Body: DM Sans — clean contemporary sans-serif, UI and body copy
- Loaded via Google Fonts in index.html

## Component Packs

- **smart-media** — lazy image/video wrappers with shimmer; needed for performer portfolio grids
- **slideshow** — HeroSlider for homepage rotating feature + GalleryBrowser for performer media gallery
- **animation** — FadeIn (section reveals), SlideUp (name/bio entrance), StaggerList (talent grid entrance)

No theme pack selected — editorial-agency has its own custom token set that fits neither admin-ops nor creator-social.

## Page Composition

- **HomePage** → [HeroSlider, StaggerList, PerformerCard, SlideUp, FadeIn] — rotating performer feature hero, staggered talent preview grid, "View Talent" CTA
- **RosterPage** → [StaggerList, PerformerCard, CategoryFilter, Input] — full image grid, name-reveal cards, category/location/search filter bar
- **PerformerPage** → [GalleryBrowser, FadeIn, SlideUp, InquiryForm, MediaFrame] — full-width headshot, bio, media gallery, inquiry form
- **LoginPage** → [Input, Button] — minimal centered form, no decoration
- **AdminPerformers** → [EmptyState, PerformerRow, Button] — table-style list, no dashboard energy
- **AdminPerformerEdit** → [FileUpload, Input, Textarea, Button, MediaGallery] — full form for editing performer data
- **AdminInquiries** → [InquiryRow, EmptyState] — paginated inquiry list
- **PerformerDashboard** → [FadeIn, StatCard] — minimal read-only view: name, category, inquiry count

## Content And Media

8 performers seeded for development:
- Margaux Delacroix (MODEL, Paris) — fashion print + runway, 24yo
- Theo Vance (ACTOR, Los Angeles) — dramatic/thriller lead, 31yo
- Inés Nakamura (DANCER, New York) — contemporary and ballet, 26yo
- Rafferty Cole (ACTOR, London) — stage and screen, 29yo
- Zola Mensah (MODEL, Lagos) — editorial and commercial, 22yo
- Petra Wohl (MUSICIAN, Berlin) — singer-songwriter, 28yo
- Luca Ferraro (HOST, Milan) — TV host and MC, 33yo
- Sofía Reyes (COMEDIAN, Mexico City) — stand-up and TV, 27yo

Images: use high-quality editorial portrait placeholder URLs (picsum.photos with performer-specific seeds). 3–5 portfolio photos per performer. 1 video reel per performer (hosted externally, YouTube embed or .mp4 URL).

## Avoid

- Blue/purple SaaS gradients or accent colors
- Rounded cards (radius: 0 enforces this)
- Generic hero + three cards layout
- Any social feed energy (no timestamps, no reaction counts)
- Cluttered filter UI (filter bar is minimal: category chips only, search input)
- Stock-looking photography with blurred backgrounds
- Light mode (dark editorial only)
- Dashboard energy on the public site

## Verification Notes

- [ ] Hero / first viewport: full-screen performer image with TALENT / AGENCY wordmark large — no page header visible, no white background
- [ ] Primary action color: near-white (#EDEDED) — no default blue, no colored accents anywhere
- [ ] Card density at 1440px wide: talent grid shows 3-4 performer images, names hidden until hover — image-forward
- [ ] Mobile at 320px: single-column grid, no horizontal scroll, nav collapses to hamburger or simple links
- [ ] Border radius: 0 everywhere — images, buttons, inputs, cards are all sharp-cornered
- [ ] Typography: performer names render in Cormorant Garamond at ≥48px on profile page; body text is DM Sans
- [ ] Seed content: 8 named performers from 6+ countries, no lorem ipsum
- [ ] Empty states: styled dark with muted text, not browser-default
- [ ] Performer page: bio and stats section has generous vertical spacing (≥64px top/bottom padding)
- [ ] Admin panel: sidebar is dark, no light-mode flicker, matches public site tokens

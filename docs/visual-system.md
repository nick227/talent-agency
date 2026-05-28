# Visual System

## Token Direction

Apply these values directly to `apps/web/src/index.css` `:root` block. No light mode override.

```css
:root {
  --background: 0 0% 5%;
  --foreground: 0 0% 93%;

  --surface: 0 0% 9%;
  --surface-foreground: 0 0% 60%;

  --primary: 0 0% 93%;
  --primary-foreground: 0 0% 5%;

  --muted: 0 0% 13%;
  --muted-foreground: 0 0% 55%;

  --accent: 0 0% 18%;
  --accent-foreground: 0 0% 93%;

  --border: 0 0% 18%;
  --input-border: 0 0% 25%;
  --ring: 0 0% 60%;

  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 98%;

  --radius: 0;
  --radius-sm: 0;
  --radius-lg: 0;
}
```

## Type Scale

| Role | Font | Weight | Size | Tracking |
|---|---|---|---|---|
| Brand wordmark | DM Sans | 400 | 13px | 0.25em uppercase |
| Performer name (hero) | Cormorant Garamond | 300 | 72–96px | -0.02em |
| Performer name (card) | Cormorant Garamond | 400 | 28–36px | -0.01em |
| Section heading | DM Sans | 300 | 32–48px | 0.05em uppercase |
| Body copy | DM Sans | 300 | 15–16px | 0 |
| Caption/meta | DM Sans | 400 | 11–12px | 0.05em uppercase |
| Admin UI | DM Sans | 400 | 14px | 0 |

DM Sans imported from Google Fonts. Cormorant Garamond imported from Google Fonts.

## Layout Rhythm

- Max content width (public): 1440px, full bleed on wider screens
- Gutter: 24px (mobile), 48px (tablet), 80px (desktop)
- Section vertical spacing: 96px between major sections
- Performer name / hero text: no max-width; let typography breathe
- Admin container: max-width 1200px, 32px padding

## Component Treatment

**Buttons:** Sharp-cornered (radius: 0). Primary = white background, dark text. Outline = white border, transparent bg. Ghost = no border. All uppercase tracking.

**Inputs:** Sharp, thin white/gray border, transparent background. Dark placeholder text. No rounded corners.

**Cards (Performer):** Image-first. No border, no shadow. Name overlay on hover with smooth opacity transition. Image fills the container.

**Nav:** Minimal. Wordmark on left, links on right. Single horizontal line of text. No background color (transparent over hero).

**Inquiry form:** Simple dark form section. Thin borders. Generous spacing. "Inquire" not "Submit".

## Motion And States

- Page transitions: `PageTransition` — fade + 6px y-shift, 180ms
- Section reveals: `FadeIn` with 400ms, delay increments for sequential elements
- Roster grid entrance: `StaggerList` with 80ms stagger
- Performer card hover: image scale 1.03, name opacity 1 → visible, 300ms ease
- Hero slider: Embla autoplay every 5000ms, fade crossfade if possible
- No bounce, no spring, no elastic — restrained premium motion only

## Media Rules

- All images served via `MediaFrame` wrapper for consistent aspect ratios
- Performer headshot: portrait aspect (3/4 or 2/3 preferred)
- Portfolio photos: mixed aspect ratios acceptable in grid
- Video reels: 16/9 aspect, max 100% width
- `SmartImage` shimmer while loading: dark shimmer (#171717 → #212121 pulse)
- All images: `object-cover` to fill containers
- No placeholder text in images (no "image here" boxes)

## Mobile Rules

- Roster grid: 2 columns on mobile (320–768px), 3 columns on tablet, 4 on desktop
- Performer name on cards: always visible on mobile (no hover-reveal required)
- Hero: full-screen height, performer name visible above fold
- Nav: wordmark + hamburger menu (or just two links: Roster / Contact)
- Inquiry form: full-width stacked inputs
- Admin sidebar collapses to top bar on mobile

## Accessibility Notes

- Minimum contrast ratio 4.5:1 for all body text (foreground on background ≈ 18:1)
- Hover states accompanied by focus-visible ring for keyboard navigation
- All images have `alt` text
- Inquiry form: all fields labeled (visually hidden OK if placeholder text is descriptive)
- Slider: keyboard arrow key navigation via Embla

---
name: Stark Utility
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1b1b1b'
  on-surface-variant: '#4c4546'
  inverse-surface: '#303030'
  inverse-on-surface: '#f1f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdf'
  on-secondary-container: '#626262'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1b'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e4e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9f9'
  on-background: '#1b1b1b'
  surface-variant: '#e2e2e2'
typography:
  display-xl:
    fontFamily: Hanken Grotesk
    fontSize: 80px
    fontWeight: '800'
    lineHeight: 88px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system adopts a radical "anti-brand" philosophy, stripping away decorative artifice to prioritize pure information density and clarity. It is designed for high-performance SaaS and developer tools where utility is the primary aesthetic.

The visual style is **High-Contrast Minimalism**. By utilizing a binary palette and an uncompromising grid, the UI evokes a sense of architectural precision and professional authority. The emotional response is one of focus, efficiency, and transparency. All forms of skeuomorphism, including gradients and shadows, are replaced by structural borders and intentional whitespace.

## Colors

The palette is strictly monochromatic to ensure maximum legibility and a neutral professional tone. 

- **Primary (#000000):** Used for all core text, structural borders, and primary action states.
- **Secondary (#666666):** Reserved for supporting metadata, placeholder text, and secondary UI elements.
- **Background (#FFFFFF):** A clean, stark white canvas that provides the foundation for the entire system.
- **Surface (#F5F5F5):** A subtle off-white used exclusively for code blocks, disabled states, or subtle section nesting to maintain hierarchy without introducing shadows.

## Typography

Typography is the primary driver of the brand's identity. This design system uses a triple-font strategy:
- **Display/Headlines:** Hanken Grotesk in heavy weights for an oversized, "industrial" impact.
- **Body:** Inter for its systematic, utilitarian legibility in long-form content.
- **Labels/Technical:** JetBrains Mono for metadata, tags, and small utility labels to reinforce the "pro" tool aesthetic.

Text should always be #000000 against the #FFFFFF background. Avoid grey text for body copy to maintain accessibility and the "stark" look.

## Layout & Spacing

The layout is governed by a **fixed-column grid** on desktop and a **fluid grid** on mobile. 
- **Desktop:** 12-column grid, 1200px max-width, 24px gutters. Content is centered.
- **Mobile:** 4-column fluid grid with 16px side margins.

Spacing follows a strict 4px base unit. Heavy use of whitespace (xl spacing) between major sections is encouraged to replace the need for dividers or shadows. Use "negative space" as a functional separator.

## Elevation & Depth

This design system is strictly **flat**. Depth is communicated through **structural borders** and **tonal layering** rather than shadows.

- **Level 0 (Base):** #FFFFFF background.
- **Level 1 (Containers/Cards):** Defined by a 1px solid #000000 border. No shadow.
- **Level 2 (Modals/Overlays):** Defined by a 2px solid #000000 border with a stark #FFFFFF fill.
- **Interaction:** Hover states are indicated by an invert effect (Background becomes #000000 and Text becomes #FFFFFF) rather than a lift or shadow.

## Shapes

The shape language is **Sharp (0px roundedness)**. Every UI element—from buttons and input fields to cards and modals—must feature 90-degree corners. This reinforces the systematic, architectural, and utilitarian nature of the design system. Any rounded corners are considered a deviation from the system's core identity.

## Components

- **Buttons:** Primary buttons are solid #000000 with #FFFFFF text. Secondary buttons are #FFFFFF with a 1px #000000 border. No rounded corners.
- **Input Fields:** 1px #000000 bottom border only for a "minimalist form" look, or a full 1px box for high-density data entry.
- **Chips/Tags:** Use `label-mono` typography. Solid #000000 background with white text for "active," and a simple 1px border for "inactive."
- **Lists:** Separated by 1px #000000 horizontal rules. Large padding (16px-24px) between list items.
- **Cards:** No shadows. Defined by a 1px #000000 border. Headers within cards should use a bottom border to separate from the body.
- **Checkboxes/Radios:** Pure geometric forms. Square for both (differentiated by an "X" mark for checkboxes and a smaller solid square for radios) to maintain the sharp aesthetic.
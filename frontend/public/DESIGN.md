---
name: Clinical Ethereal
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#3f4848'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#6f7978'
  outline-variant: '#bfc8c8'
  surface-tint: '#296767'
  primary: '#003434'
  on-primary: '#ffffff'
  primary-container: '#004d4d'
  on-primary-container: '#80bdbc'
  inverse-primary: '#94d1d1'
  secondary: '#006875'
  on-secondary: '#ffffff'
  secondary-container: '#00e3fd'
  on-secondary-container: '#00616d'
  tertiary: '#2b2f30'
  on-tertiary: '#ffffff'
  tertiary-container: '#424546'
  on-tertiary-container: '#b0b2b3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0eeed'
  primary-fixed-dim: '#94d1d1'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#044f4f'
  secondary-fixed: '#9cf0ff'
  secondary-fixed-dim: '#00daf3'
  on-secondary-fixed: '#001f24'
  on-secondary-fixed-variant: '#004f58'
  tertiary-fixed: '#e1e3e4'
  tertiary-fixed-dim: '#c4c7c8'
  on-tertiary-fixed: '#191c1d'
  on-tertiary-fixed-variant: '#444748'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  deep-teal: '#004D4D'
  electric-cyan: '#00E5FF'
  soft-slate: '#475569'
  glass-border: rgba(255, 255, 255, 0.4)
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The brand identity centers on "Clinical Ethereal"—a fusion of high-end medical expertise and advanced 3D technology. It targets a discerning clientele seeking premium dental care. The aesthetic is sophisticated and high-tech, yet retains the warmth necessary for a healthcare environment.

The design style is a refined **Glassmorphism** mixed with **Tactile** depth. It utilizes soft, multi-layered shadows to create a sense of physical space, mimicking the precision of dental instruments and the cleanliness of a modern operatory. Translucent surfaces and background blurs imply transparency and honesty, while 3D depth provides a modern, "expensive" interface feel that differentiates the clinic from traditional medical sites.

## Colors

The palette is rooted in medical professionalism and high-tech precision. 

*   **Deep Teal** (#004D4D) serves as the primary anchor, providing a sense of heritage, trust, and depth. 
*   **Clean White** (#FFFFFF) is the structural foundation, ensuring the UI feels sterile, bright, and airy.
*   **Electric Cyan** (#00E5FF) is used sparingly as a high-tech accent, signifying advanced 3D scanning and digital dentistry.
*   **Soft Slate** (#475569) handles secondary text, reducing visual strain compared to pure black.

The design operates in a light mode default to maximize the "clean medical" aesthetic, using subtle gradients between white and very light cool-greys to define 3D volumes.

## Typography

The typography strategy pairs tradition with innovation. **Libre Caslon Text** is utilized for headlines to evoke the authority of established medical practice and "expensive" luxury. It provides a literary, refined character that feels bespoke.

**Hanken Grotesk** is the functional counterpart for body and UI elements. Its sharp, contemporary grotesque structure maintains a technical, clean-room aesthetic that is highly legible. 

Large-scale display types should use tighter letter-spacing for a modern editorial feel, while labels utilize slight tracking and uppercase styling to denote hierarchy and system functions.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to maintain a controlled, gallery-like presentation of 3D assets, transitioning to a fluid model for smaller screens. 

*   **Desktop:** A 12-column grid with a wide 64px margin to allow the UI to "breathe." Gutters are kept at 24px to maintain tight groupings of related information.
*   **Tablet:** Reflows to an 8-column grid with 32px margins.
*   **Mobile:** A 4-column grid with 20px margins. 

Spacing rhythm is strictly 8px-based. Vertical rhythm uses generous whitespace (80px–120px) between major sections to emphasize the premium nature of the brand, ensuring that 3D elements never feel crowded.

## Elevation & Depth

Depth is the primary communicator of hierarchy. The design system uses three distinct layers:

1.  **The Floor (Base):** Subtle cool-grey gradients create a sense of a physical environment.
2.  **Glass Containers:** Elevated cards use a backdrop blur (20px–30px) and a semi-transparent white fill (opacity 0.6–0.8). They feature a thin 1px border (`glass-border`) to catch "light."
3.  **Floating Elements (High Elevation):** 3D dental models and primary CTAs use soft, multi-layered "ambient" shadows. These shadows are tinted with Deep Teal to prevent a "dirty" grey look and use a high blur radius (40px+) for a weightless, high-tech effect.

Interactive elements should appear to physically "lift" or "sink" slightly on hover/active states using transition-based shadow adjustments.

## Shapes

The shape language is "Softly Geometric." A 0.5rem (8px) base radius is applied to standard cards and containers to feel approachable. Larger decorative elements or featured 3D "modules" should utilize more aggressive rounding (1.5rem) to mimic the organic shapes of dental anatomy and high-end medical equipment. 

Buttons and specialized badges utilize a "Pill" shape to contrast against the structured grid and provide a friendly, touchable interface.

## Components

**Buttons:** Primary buttons are Deep Teal with white text, featuring a subtle inner glow on the top edge to simulate 3D volume. Secondary buttons use a glassmorphic background with a cyan border.

**Cards:** Must feature a `backdrop-filter: blur()` and a subtle 45-degree linear gradient border. Content within cards should have ample internal padding (32px) to maintain the premium feel.

**Input Fields:** Clean, minimal fields with a bottom-border focus state in Electric Cyan. The background is a very faint version of the tertiary color to provide a "well" effect.

**Chips/Badges:** Small, pill-shaped indicators using Electric Cyan with low opacity (10%) and high-contrast text for a digital, high-tech appearance.

**3D Model Viewers:** Should be framed in circular or organically shaped glass containers, separated from the background with significant depth-of-field blurs to focus the user's eye on the "tech."
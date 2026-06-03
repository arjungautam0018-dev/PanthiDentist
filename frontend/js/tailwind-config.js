/**
 * Panthi Clinic - Tailwind CSS Shared Theme Configuration
 * 
 * This file centralizes the visual design tokens for the "Clinical Ethereal" brand.
 * By defining our color tokens, spacing scales, and typography hierarchies here, 
 * we ensure a consistent look and feel across both the homepage and appointment pages,
 * making changes to the UI branding as simple as modifying a single variable.
 * 
 * Integration:
 * In HTML files, import this script AFTER loading the Tailwind CSS CDN script:
 *   <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
 *   <script src="../js/tailwind-config.js"></script>
 */

tailwind.config = {
  // Class-based dark mode (we can add class="dark" to the HTML element to enable dark mode)
  darkMode: "class",
  
  theme: {
    extend: {
      // 1. Color Palette: Built on "Clinical Ethereal" concept (Deep Teal + Clean White + Cyan details)
      colors: {
        // Brand Primary Colors
        "deep-teal": "#004D4D",          // Deep Teal: Represents clinical depth, authority, trust, and luxury
        "electric-cyan": "#00E5FF",      // Electric Cyan: Highlights futuristic 3D imaging & digital scanning tech
        "soft-slate": "#475569",         // Soft Slate: Secondary text color for optimal legibility without harsh contrast
        "glass-border": "rgba(255, 255, 255, 0.4)", // Translucent white for glassmorphism boundaries

        // Primary Surface Colors
        "primary": "#003434",
        "on-primary": "#ffffff",
        "primary-container": "#004d4d",
        "on-primary-container": "#80bdbc",
        "inverse-primary": "#94d1d1",

        // Secondary & Tech Colors
        "secondary": "#006875",
        "on-secondary": "#ffffff",
        "secondary-container": "#00e3fd",
        "on-secondary-container": "#00616d",

        // Tertiary (Neutral slate and soft tones)
        "tertiary": "#2b2f30",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#424546",
        "on-tertiary-container": "#b0b2b3",

        // Elevation & Container Surfaces
        "background": "#f9f9f9",
        "on-background": "#1a1c1c",
        "surface": "#f9f9f9",
        "on-surface": "#1a1c1c",
        "surface-bright": "#f9f9f9",
        "surface-dim": "#dadada",
        "surface-variant": "#e2e2e2",
        "on-surface-variant": "#3f4848",
        
        // Detailed Surface Elevations (Light Mode material depths)
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f3f4",
        "surface-container": "#eeeeee",
        "surface-container-high": "#e8e8e8",
        "surface-container-highest": "#e2e2e2",

        // System feedback states (Errors & warnings)
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        // Constant Fixed colors
        "primary-fixed": "#b0eeed",
        "primary-fixed-dim": "#94d1d1",
        "on-primary-fixed": "#002020",
        "on-primary-fixed-variant": "#044f4f",
        "secondary-fixed": "#9cf0ff",
        "secondary-fixed-dim": "#00daf3",
        "on-secondary-fixed": "#001f24",
        "on-secondary-fixed-variant": "#004f58",
        "tertiary-fixed": "#e1e3e4",
        "tertiary-fixed-dim": "#c4c7c8",
        "on-tertiary-fixed": "#191c1d",
        "on-tertiary-fixed-variant": "#444748",
        "surface-tint": "#296767",
        "outline": "#6f7978",
        "outline-variant": "#bfc8c8"
      },

      // 2. Corner Radii: "Softly Geometric" curve scales
      borderRadius: {
        "DEFAULT": "0.25rem",            // 4px: standard micro-controls (checkboxes, tags)
        "lg": "0.5rem",                 // 8px: buttons, smaller input fields
        "xl": "0.75rem",                // 12px: medium badges, small popovers
        "2xl": "1rem",                  // 16px: standard cards (additional default fallback)
        "3xl": "1.5rem",                // 24px: large modules, main outer containers, and dialogs
        "full": "9999px"                // Pill shapes: primary buttons, filter badges
      },

      // 3. Grid & Spacing Systems: Strict 8px increment rules
      spacing: {
        "unit": "8px",                  // Base grid spacing block
        "gutter": "24px",               // Grid column spacing
        "container-max": "1280px",      // Maximum width of main content container
        "margin-desktop": "64px",       // Left/Right margin on desktop viewports
        "margin-mobile": "20px"         // Left/Right margin on mobile viewports
      },

      // 4. Typography pairing: Libre Caslon Text (Luxury authority) + Hanken Grotesk (Modern clean technicality)
      fontFamily: {
        "display-lg": ["Libre Caslon Text"],
        "headline-lg": ["Libre Caslon Text"],
        "headline-md": ["Libre Caslon Text"],
        "headline-lg-mobile": ["Libre Caslon Text"],
        "body-lg": ["Hanken Grotesk"],
        "body-md": ["Hanken Grotesk"],
        "label-lg": ["Hanken Grotesk"],
        "label-md": ["Hanken Grotesk"]
      },

      // 5. Explicit typographic sizes & line heights
      fontSize: {
        "display-lg": ["64px", { "lineHeight": "72px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "headline-lg": ["48px", { "lineHeight": "56px", "fontWeight": "600" }],
        "headline-lg-mobile": ["32px", { "lineHeight": "40px", "fontWeight": "600" }],
        "headline-md": ["32px", { "lineHeight": "40px", "fontWeight": "500" }],
        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "label-lg": ["14px", { "lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "label-md": ["12px", { "lineHeight": "16px", "fontWeight": "500" }]
      }
    }
  }
};

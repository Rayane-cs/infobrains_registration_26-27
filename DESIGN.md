---
version: alpha
colors:
  primary: "#22D3EE"
  ink: "#080B16"
  surface: "#111827"
  surfaceLift: "#172033"
  paper: "#F8FAFC"
  text: "#F8FAFC"
  textMuted: "#94A3B8"
  border: "#273449"
  accent: "#22D3EE"
  success: "#22C55E"
  danger: "#FB7185"
typography:
  display:
    fontFamily: "Space Grotesk, Inter, system-ui, sans-serif"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, Liberation Mono, monospace"
rounded:
  sm: "4px"
  md: "8px"
  pill: "999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button:
    rounded: "999px"
  card:
    rounded: "8px"
  input:
    rounded: "8px"
---

## Overview

InfoBrains Open Day is a hybrid public site and lightweight product surface. The public register is expressive and technical; the attendance and category forms are disciplined, accessible, and honest about their frontend-only nature.

The north star is a field guide for interconnected technology domains: dark ink paper, precise labels, modular panels, and a signal-atlas motif that links six club categories without claiming fictional event details.

## Colors

The runtime owner is `src/styles/tokens.css`. This document mirrors the accepted semantic values and explains their use.

Use `ink` for the page foundation, `surface` and `surfaceLift` for owned panels, `paper` for the printable confirmation and occasional high-contrast content, and `accent` for primary action and focus. Category colors are scoped to category selection and summary states only: blue, purple, green, orange, navy, and pink.

## Typography

Display headings use Space Grotesk for a technical club voice with open counters and confident shapes. Body text and form controls use Inter for legibility. Small technical labels, generated references, and status captions use the monospace stack sparingly.

## Layout

Sections are full-width bands with constrained inner content. The hero uses an asymmetric layout with action-first copy and a signal-atlas visual. Form workflows use two-column layouts on desktop and single-column layouts on mobile. The page avoids nested card compositions; repeated category options are the only card grid.

## Elevation & Depth

Depth is expressed through borders, subtle inset highlights, and background contrast rather than heavy shadows. Static content should not float without a task reason.

## Shapes

Cards, inputs, and panels use an 8px radius. Buttons use pill geometry because they are command surfaces and must remain easy touch targets. The logo keeps its original proportions and is not redrawn.

## Components

Buttons expose solid, outline, and ghost treatments with visible hover, focus, active, disabled, and busy states. Forms own validation with `noValidate`, inline errors, and a form-level status. Category cards use real checkboxes and selected-state text/icon changes, not color alone.

## Do's and Don'ts

Do keep copy factual and editable where event details are unknown. Do preserve the demo disclaimer on attendance confirmation. Do use the category colors only where they carry meaning.

Do not claim official faculty approval, university authorization, membership numbers, sponsors, or event details not present in the provided brief. Do not add decorative glass effects, fake metrics, or generic AI-style glow backgrounds.

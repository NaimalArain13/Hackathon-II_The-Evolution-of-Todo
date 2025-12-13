# Research: Todo App Landing Page

**Feature Branch**: `005-landing-page`
**Date**: 2025-12-13
**Status**: Complete

## Research Summary

This document captures research findings and decisions for implementing the landing page feature. All technical unknowns have been resolved through analysis of the existing codebase and design specifications.

---

## 1. Framework & Technology Stack

### Decision: Next.js 16+ with App Router

**Rationale**:
- Already configured in the project (`frontend/package.json` shows Next.js 16.0.10)
- App Router provides optimal performance with Server Components by default
- Built-in image optimization for landing page visuals
- SEO-friendly with static generation capabilities

**Alternatives Considered**:
- Pages Router: Rejected - App Router is the modern standard and already configured
- Static site generators (Astro, Gatsby): Rejected - Would fragment the frontend codebase

---

## 2. Styling Approach

### Decision: Tailwind CSS with Design Tokens from FIGMA_DESIGN_SPEC.md

**Rationale**:
- Tailwind CSS v4 already configured in the project
- Comprehensive design tokens defined in `frontend/FIGMA_DESIGN_SPEC.md`
- Consistent with the rest of the application
- shadcn/ui components available for UI primitives

**Key Design Tokens to Use**:
```
Primary Color: #6366F1 (Indigo)
Secondary Color: #22C55E (Green)
Neutral Scale: #FAFAFA to #18181B
Type Scale: 48px Display down to 12px Caption
Spacing: 4px baseline grid (4, 8, 12, 16, 24, 32, 48, 64, 80, 96px)
Border Radius: 8px (md), 12px (lg), 16px (xl)
```

**Alternatives Considered**:
- CSS Modules: Rejected - Tailwind already provides utility-first approach
- Styled Components: Rejected - Would add bundle size and inconsistency

---

## 3. Animation Library

### Decision: Framer Motion for scroll animations and micro-interactions

**Rationale**:
- Already installed (`framer-motion: ^12.23.26` in package.json)
- Skill documentation available at `.claude/skills/framer-motion/`
- React-native animation library with excellent performance
- Supports scroll-based animations required by spec (VR-008)

**Animation Requirements from Spec**:
- Scroll reveal animations for sections
- Hover interactions on feature cards
- Smooth transitions between states
- Page load animations for hero section

**Alternatives Considered**:
- CSS animations only: Rejected - Limited scroll-based capabilities
- GSAP: Rejected - Would add another dependency when Framer Motion is available

---

## 4. Component Architecture

### Decision: Modular section components with shared UI primitives

**Rationale**:
- Follows existing project structure (`frontend/src/components/`)
- Enables reusability and maintainability
- Aligns with constitution's clean code principles

**Proposed Component Structure**:
```
frontend/src/components/landing/
├── HeroSection.tsx
├── FeaturesSection.tsx
├── HowItWorksSection.tsx
├── AppPreviewSection.tsx
├── TestimonialsSection.tsx
├── CTASection.tsx
├── LandingNavbar.tsx
└── LandingFooter.tsx
```

**Shared Components** (from `frontend/src/components/ui/`):
- Button (primary, secondary, ghost variants)
- Card (base, feature, testimonial variants)
- Badge (for feature icons)

---

## 5. Image Optimization Strategy

### Decision: Next.js Image component with placeholder images initially

**Rationale**:
- Next.js `<Image>` component provides automatic optimization
- Lazy loading for below-the-fold images
- Priority loading for hero section images
- Placeholder images from `/public/` or external sources initially

**Image Requirements**:
- Hero illustration/mockup (high priority)
- Feature icons (from Lucide React, already installed)
- App preview screenshots (placeholder initially)
- Testimonial avatars (placeholder/generated)

**Alternatives Considered**:
- External image CDN: May be added later for production
- SVG illustrations: Used for icons, but photos need Next/Image

---

## 6. Navigation Pattern

### Decision: Sticky header with smooth scroll navigation

**Rationale**:
- Spec requirement (FR-007): Navigation bar must remain visible when scrolling
- Spec requirement (FR-011): Smooth scrolling for internal links
- Mobile hamburger menu requirement (FR-012)

**Implementation Approach**:
- CSS `position: sticky` for desktop
- React state for mobile menu toggle
- `scroll-behavior: smooth` CSS property
- Optional: `scrollIntoView()` for programmatic scrolling

---

## 7. Responsive Design Strategy

### Decision: Mobile-first with Tailwind breakpoints

**Rationale**:
- Spec defines viewports: Desktop (1440px+), Tablet (768px-1439px), Mobile (320px-767px)
- Mobile-first approach ensures progressive enhancement
- Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) align with breakpoints

**Breakpoint Mapping**:
```
Mobile: default (no prefix)
Tablet: md: (768px)
Desktop: lg: (1024px), xl: (1280px), 2xl: (1536px)
```

---

## 8. Accessibility Considerations

### Decision: WCAG 2.1 AA compliance

**Rationale**:
- Spec requirements: 4.5:1 contrast ratio (VR-004), keyboard navigation (FR-015)
- Success criteria: 95+ accessibility score (SC-003)
- Design tokens already specify accessible color combinations

**Implementation Checklist**:
- Semantic HTML elements (header, main, section, footer, nav)
- Alt text for all images (FR-013)
- Focus indicators for interactive elements (VR-005)
- Skip navigation link
- ARIA labels where semantic HTML is insufficient
- Color contrast compliance for all text

---

## 9. Performance Optimization

### Decision: Server Components with strategic client islands

**Rationale**:
- Success criteria: 90+ performance score (SC-002), 3s load time (SC-008)
- Server Components reduce JavaScript bundle
- Client components only for interactive elements (navigation toggle, animations)

**Server Components** (static content):
- HeroSection (mostly static, CTA links)
- FeaturesSection (static feature cards)
- HowItWorksSection (static steps)
- TestimonialsSection (static testimonials)
- CTASection (static with link)
- LandingFooter (static)

**Client Components** (interactivity needed):
- LandingNavbar (scroll state, mobile menu toggle)
- Animation wrappers using Framer Motion

---

## 10. Content Strategy

### Decision: Static content with placeholder testimonials

**Rationale**:
- Landing page content is marketing-focused and relatively static
- Testimonials are placeholder per spec assumptions
- No CMS needed for initial implementation

**Content Sources**:
- Headline/copy: Derived from FIGMA_DESIGN_SPEC.md section 4
- Feature descriptions: Mapped from app capabilities
- Testimonials: 3 placeholder testimonials with generated avatars
- Legal links: Placeholder routes (/privacy, /terms)

---

## 11. Routing Integration

### Decision: Landing page at root route (/)

**Rationale**:
- Spec assumption: Landing page is default route
- Existing app structure supports this

**Route Configuration**:
```
/                    -> Landing page (this feature)
/signin              -> Authentication (existing)
/signup              -> Authentication (existing)
/(dashboard)/*       -> Protected routes (existing)
```

**CTA Navigation**:
- "Get Started" / "Sign Up" -> `/signup`
- "Login" -> `/signin`
- Internal links -> Smooth scroll to section IDs

---

## Unresolved Items

**None** - All technical decisions have been made based on existing project configuration and spec requirements.

---

## References

- Frontend CLAUDE.md: `frontend/CLAUDE.md`
- Design Spec: `frontend/FIGMA_DESIGN_SPEC.md`
- Package.json: `frontend/package.json`
- Feature Spec: `specs/005-landing-page/spec.md`
- Framer Motion Skill: `.claude/skills/framer-motion/`
- shadcn Skill: `.claude/skills/shadcn/`
- Next.js Skill: `.claude/skills/nextjs/`

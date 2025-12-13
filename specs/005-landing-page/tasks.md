# Tasks: Todo App Landing Page

**Input**: Design documents from `/specs/005-landing-page/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/, research.md, quickstart.md

**Tests**: Not explicitly requested - focusing on implementation tasks with manual testing at checkpoints.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US6)
- Include exact file paths in descriptions

## Path Conventions

- **Web app structure**: `frontend/src/` for all components
- **Components**: `frontend/src/components/landing/`
- **App routes**: `frontend/src/app/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create landing component directory structure and foundational files

- [x] T001 Create landing components directory at `frontend/src/components/landing/`
- [x] T002 [P] Create TypeScript types file at `frontend/src/components/landing/types.ts` with NavItem, Feature, Step, Testimonial, FooterLinkGroup, SocialLink interfaces
- [x] T003 [P] Create content data file at `frontend/src/components/landing/data.ts` with defaultNavItems, defaultFeatures, defaultSteps, defaultTestimonials, footerLinkGroups
- [x] T004 Add smooth scrolling CSS rule to `frontend/src/app/globals.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core layout components that ALL user stories depend on

**CRITICAL**: Navigation and Footer are shared infrastructure - must complete before user story sections

- [x] T005 [P] Create LandingNavbar client component at `frontend/src/components/landing/LandingNavbar.tsx` with sticky header, scroll state, mobile menu, and auth buttons
- [x] T006 [P] Create LandingFooter server component at `frontend/src/components/landing/LandingFooter.tsx` with logo, tagline, link groups, social links, and copyright
- [x] T007 Create barrel export file at `frontend/src/components/landing/index.ts` to export all components
- [x] T008 Update root layout metadata in `frontend/src/app/layout.tsx` with SEO title and description for TaskFlow

**Checkpoint**: Foundation ready - navigation and footer components available for page assembly

---

## Phase 3: User Story 1 - Visitor Discovers Value Proposition (Priority: P1) MVP

**Goal**: Hero section captures attention and communicates the app's value proposition immediately

**Independent Test**: Load landing page and verify hero section displays with headline, subheadline, CTAs above the fold within 3 seconds

### Implementation for User Story 1

- [x] T009 [US1] Create HeroSection server component at `frontend/src/components/landing/HeroSection.tsx` with badge, headline, subheadline, and gradient background
- [x] T010 [US1] Add primary CTA button "Get Started Free" linking to /signup in HeroSection
- [x] T011 [US1] Add secondary CTA button "See How It Works" linking to #how-it-works in HeroSection
- [x] T012 [US1] Add trust text "No credit card required" below CTAs in HeroSection
- [x] T013 [US1] Add hero image placeholder with responsive sizing in HeroSection
- [x] T014 [US1] Implement responsive layout (mobile stack, desktop 2-column grid) in HeroSection
- [x] T015 [US1] Update barrel export in `frontend/src/components/landing/index.ts` to include HeroSection

**Checkpoint**: Hero section complete - visitors can understand value proposition and see primary CTA

---

## Phase 4: User Story 5 - Visitor Takes Action to Sign Up (Priority: P1)

**Goal**: Clear CTAs throughout the page enable conversion at any point in the journey

**Independent Test**: Click any CTA button and verify navigation to /signup or /signin

### Implementation for User Story 5

- [x] T016 [US5] Create CTASection server component at `frontend/src/components/landing/CTASection.tsx` with gradient background, title, subtitle
- [x] T017 [US5] Add prominent "Create Free Account" button linking to /signup in CTASection
- [x] T018 [US5] Add trust text below CTA button in CTASection
- [x] T019 [US5] Implement centered layout with proper padding in CTASection
- [x] T020 [US5] Update barrel export in `frontend/src/components/landing/index.ts` to include CTASection

**Checkpoint**: CTA section complete - final conversion point before footer is ready

---

## Phase 5: User Story 6 - Visitor Navigates the Landing Page (Priority: P2)

**Goal**: Navigation enables quick access to any section with smooth scrolling

**Independent Test**: Click navigation links and verify smooth scrolling to sections; test mobile menu toggle

### Implementation for User Story 6

- [x] T021 [US6] Add scroll event listener to toggle navbar background in LandingNavbar
- [x] T022 [US6] Implement mobile hamburger menu with AnimatePresence animation in LandingNavbar
- [x] T023 [US6] Add navigation items for Features, How It Works, About (testimonials) in LandingNavbar
- [x] T024 [US6] Ensure Login and Sign Up buttons are visible and functional in LandingNavbar
- [x] T025 [US6] Add close-on-click behavior for mobile menu items in LandingNavbar
- [x] T026 [US6] Add aria-label for accessibility on mobile menu toggle button in LandingNavbar

**Checkpoint**: Navigation complete - users can navigate page sections and access auth pages

---

## Phase 6: User Story 2 - Visitor Explores Key Features (Priority: P2)

**Goal**: Feature cards showcase 4+ core app capabilities with icons and descriptions

**Independent Test**: Scroll to features section and verify 4 feature cards display with icons, titles, descriptions

### Implementation for User Story 2

- [x] T027 [P] [US2] Create FeaturesSection server component at `frontend/src/components/landing/FeaturesSection.tsx` with overline, title, subtitle header
- [x] T028 [US2] Add 4 feature cards (Task Management, Priority & Status, Progress Tracking, Secure & Private) in FeaturesSection
- [x] T029 [US2] Import Lucide icons (CheckSquare, Flag, BarChart3, Shield) for feature cards in FeaturesSection
- [x] T030 [US2] Implement icon container with colored background per feature card in FeaturesSection
- [x] T031 [US2] Add hover effect (translateY, shadow) on feature cards in FeaturesSection
- [x] T032 [US2] Implement responsive grid (1 col mobile, 2 col tablet, 4 col desktop) in FeaturesSection
- [x] T033 [US2] Update barrel export in `frontend/src/components/landing/index.ts` to include FeaturesSection

**Checkpoint**: Features section complete - visitors can explore app capabilities

---

## Phase 7: User Story 3 - Visitor Views App Preview (Priority: P2)

**Goal**: App preview section shows benefits list and visual demonstration of the interface

**Independent Test**: Scroll to preview section and verify benefits list and app screenshot/mockup display

### Implementation for User Story 3

- [x] T034 [P] [US3] Create HowItWorksSection server component at `frontend/src/components/landing/HowItWorksSection.tsx` with overline, title
- [x] T035 [US3] Add 3 step cards (Create Account, Add Tasks, Stay Organized) with numbered circles in HowItWorksSection
- [x] T036 [US3] Import Lucide icons (UserPlus, PlusCircle, CheckCircle) for step cards in HowItWorksSection
- [x] T037 [US3] Implement connecting line visual between steps in HowItWorksSection
- [x] T038 [US3] Apply primary-50 background color to HowItWorksSection
- [x] T039 [P] [US3] Create AppPreviewSection server component at `frontend/src/components/landing/AppPreviewSection.tsx` with overline, title
- [x] T040 [US3] Add benefits list with checkmark icons (Clean interface, All devices, Fast, Free) in AppPreviewSection
- [x] T041 [US3] Add app screenshot placeholder with shadow and rounded corners in AppPreviewSection
- [x] T042 [US3] Implement 2-column responsive layout (stack on mobile) in AppPreviewSection
- [x] T043 [US3] Update barrel export in `frontend/src/components/landing/index.ts` to include HowItWorksSection and AppPreviewSection

**Checkpoint**: How It Works and App Preview sections complete - visitors understand the product flow

---

## Phase 8: User Story 4 - Visitor Reads Social Proof (Priority: P3)

**Goal**: Testimonials section displays 3+ user quotes with names and optional roles

**Independent Test**: Scroll to testimonials section and verify 3 testimonial cards display with quotes, author names

### Implementation for User Story 4

- [x] T044 [P] [US4] Create TestimonialsSection server component at `frontend/src/components/landing/TestimonialsSection.tsx` with optional overline and title
- [x] T045 [US4] Add 3 testimonial cards with placeholder quotes (Sarah Johnson, Michael Chen, Emily Rodriguez) in TestimonialsSection
- [x] T046 [US4] Style testimonial cards with white background, shadow, rounded corners in TestimonialsSection
- [x] T047 [US4] Display author name, role, and company in each testimonial card in TestimonialsSection
- [x] T048 [US4] Apply neutral-50 background to TestimonialsSection
- [x] T049 [US4] Implement responsive grid (1 col mobile, 3 col desktop) in TestimonialsSection
- [x] T050 [US4] Update barrel export in `frontend/src/components/landing/index.ts` to include TestimonialsSection

**Checkpoint**: Testimonials section complete - social proof is visible to visitors

---

## Phase 9: Page Assembly & Integration

**Purpose**: Assemble all sections into the landing page and verify integration

- [x] T051 Update `frontend/src/app/page.tsx` to import all landing components from barrel export
- [x] T052 Compose landing page layout with LandingNavbar at top in `frontend/src/app/page.tsx`
- [x] T053 Add main element with all sections in order: Hero, Features, HowItWorks, AppPreview, Testimonials, CTA in `frontend/src/app/page.tsx`
- [x] T054 Add LandingFooter at bottom of page in `frontend/src/app/page.tsx`
- [x] T055 Add section id attributes (hero, features, how-it-works, app-preview, testimonials, cta) to enable anchor navigation

**Checkpoint**: Full page assembled - all sections integrated and navigable

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Animations, accessibility, and final optimizations

### Animations (VR-008)

- [x] T056 [P] Create animation variants file at `frontend/src/components/landing/animations.ts` with scrollReveal, staggerChildren, hoverLift variants
- [ ] T057 Add Framer Motion scroll reveal animation to HeroSection headline and subheadline
- [ ] T058 Add Framer Motion stagger animation to FeaturesSection cards
- [ ] T059 Add Framer Motion scroll reveal to HowItWorksSection steps
- [ ] T060 Add Framer Motion scroll reveal to TestimonialsSection cards

### Accessibility (FR-013, FR-015, VR-004, VR-005)

- [x] T061 [P] Add alt text to all images (hero placeholder, app preview placeholder) across components
- [x] T062 Ensure all interactive elements have visible focus states in LandingNavbar and CTA buttons
- [x] T063 Add skip-to-content link at top of page in `frontend/src/app/layout.tsx`
- [x] T064 Verify color contrast ratio meets 4.5:1 for all text elements
- [ ] T065 Test keyboard navigation through all sections and CTAs

### Responsive Polish (FR-010)

- [x] T066 Test and fix responsive layout at mobile (375px), tablet (768px), desktop (1440px) breakpoints
- [x] T067 Ensure touch targets are minimum 44x44px on mobile for all buttons

### Performance (SC-002, SC-008)

- [ ] T068 Run Lighthouse audit and optimize for 90+ performance score
- [ ] T069 Ensure page loads within 3 seconds on simulated 4G connection

### Final Validation

- [x] T070 Run TypeScript type-check with `pnpm type-check` in frontend directory
- [ ] T071 Run development server and manually test all user story acceptance scenarios from spec.md
- [x] T072 Verify all CTA buttons navigate to correct routes (/signup, /signin)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 - BLOCKS all user stories
- **US1 Hero (Phase 3)**: Depends on Phase 2 - First content section
- **US5 CTA (Phase 4)**: Depends on Phase 2 - Can parallel with US1
- **US6 Navigation (Phase 5)**: Depends on Phase 2 - Enhances existing navbar
- **US2 Features (Phase 6)**: Depends on Phase 2 - Can parallel with US1, US5
- **US3 Preview (Phase 7)**: Depends on Phase 2 - Can parallel with other US
- **US4 Testimonials (Phase 8)**: Depends on Phase 2 - Can parallel with other US
- **Page Assembly (Phase 9)**: Depends on all user story phases (3-8)
- **Polish (Phase 10)**: Depends on Phase 9 - Final refinements

### User Story Dependencies

| Story | Priority | Can Start After | Parallel With |
|-------|----------|-----------------|---------------|
| US1 (Hero) | P1 | Phase 2 | US5, US6, US2, US3, US4 |
| US5 (CTA) | P1 | Phase 2 | US1, US6, US2, US3, US4 |
| US6 (Nav) | P2 | Phase 2 | US1, US5, US2, US3, US4 |
| US2 (Features) | P2 | Phase 2 | US1, US5, US6, US3, US4 |
| US3 (Preview) | P2 | Phase 2 | US1, US5, US6, US2, US4 |
| US4 (Testimonials) | P3 | Phase 2 | US1, US5, US6, US2, US3 |

### Parallel Opportunities

After Phase 2 completion, these tasks can run in parallel:
- T009-T015 (US1: Hero)
- T016-T020 (US5: CTA)
- T027-T033 (US2: Features)
- T034-T043 (US3: Preview)
- T044-T050 (US4: Testimonials)

---

## Parallel Example: User Story Components

```bash
# After Phase 2 completes, launch these component tasks in parallel:

# Hero (US1):
Task: "Create HeroSection component at frontend/src/components/landing/HeroSection.tsx"

# CTA (US5):
Task: "Create CTASection component at frontend/src/components/landing/CTASection.tsx"

# Features (US2):
Task: "Create FeaturesSection component at frontend/src/components/landing/FeaturesSection.tsx"

# Preview sections (US3):
Task: "Create HowItWorksSection component at frontend/src/components/landing/HowItWorksSection.tsx"
Task: "Create AppPreviewSection component at frontend/src/components/landing/AppPreviewSection.tsx"

# Testimonials (US4):
Task: "Create TestimonialsSection component at frontend/src/components/landing/TestimonialsSection.tsx"
```

---

## Implementation Strategy

### MVP First (P1 User Stories Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T008)
3. Complete Phase 3: US1 Hero (T009-T015)
4. Complete Phase 4: US5 CTA (T016-T020)
5. **STOP and VALIDATE**: Landing page has hero + CTA - minimum viable conversion path
6. Can deploy/demo with just navbar, hero, CTA, and footer

### Incremental Delivery

1. Setup + Foundational → Navigation and footer ready
2. Add US1 Hero → Hero section visible
3. Add US5 CTA → Conversion path complete (MVP!)
4. Add US6 Navigation polish → Smooth scrolling works
5. Add US2 Features → Feature showcase visible
6. Add US3 Preview → App demo sections visible
7. Add US4 Testimonials → Social proof visible
8. Page Assembly → Full page integrated
9. Polish → Animations, accessibility, performance

---

## Task Summary

| Phase | Tasks | Parallelizable |
|-------|-------|----------------|
| Phase 1: Setup | 4 | 2 |
| Phase 2: Foundational | 4 | 2 |
| Phase 3: US1 Hero | 7 | 0 |
| Phase 4: US5 CTA | 5 | 0 |
| Phase 5: US6 Nav | 6 | 0 |
| Phase 6: US2 Features | 7 | 1 |
| Phase 7: US3 Preview | 10 | 2 |
| Phase 8: US4 Testimonials | 7 | 1 |
| Phase 9: Assembly | 5 | 0 |
| Phase 10: Polish | 17 | 3 |
| **Total** | **72** | **11** |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story phase is independently testable after completion
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- MVP can be delivered after Phase 4 (Hero + CTA)

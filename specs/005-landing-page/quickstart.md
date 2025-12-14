# Quickstart Guide: Todo App Landing Page

**Feature Branch**: `005-landing-page`
**Date**: 2025-12-13

## Prerequisites

Before implementing the landing page, ensure:

1. **Frontend project is set up** with Next.js 16+
2. **Dependencies installed**: framer-motion, lucide-react, tailwindcss
3. **Design system configured** in `tailwind.config.ts`

---

## Step 1: Create Component Directory

```bash
mkdir -p frontend/src/components/landing
```

## Step 2: Create Components (Priority Order)

### 2.1 LandingNavbar (Client Component)

**File**: `frontend/src/components/landing/LandingNavbar.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
}

interface LandingNavbarProps {
  navItems?: NavItem[];
}

const defaultNavItems: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#testimonials" },
];

export function LandingNavbar({ navItems = defaultNavItems }: LandingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary-600">
          TaskFlow
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/signin">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-neutral-600 hover:text-primary-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Button variant="outline" asChild>
                  <Link href="/signin">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
```

### 2.2 HeroSection (Server Component)

**File**: `frontend/src/components/landing/HeroSection.tsx`

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50 to-white -z-10" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              ✨ Your Personal Task Manager
            </span>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-neutral-900 leading-tight mb-6">
              Organize Your Life, One Task at a Time
            </h1>

            <p className="text-lg text-neutral-600 mb-8 max-w-xl mx-auto lg:mx-0">
              The simple, beautiful way to manage your tasks. Stay organized,
              boost productivity, and never miss a deadline.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </div>

            <p className="text-sm text-neutral-500 mt-6">
              No credit card required • Free forever
            </p>
          </div>

          {/* Right: Hero Image */}
          <div className="relative">
            {/* Placeholder for hero illustration/screenshot */}
            <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl shadow-2xl flex items-center justify-center">
              <span className="text-primary-600 text-lg font-medium">
                App Preview
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 2.3 FeaturesSection (Server Component)

**File**: `frontend/src/components/landing/FeaturesSection.tsx`

```tsx
import { CheckSquare, Flag, BarChart3, Shield } from "lucide-react";

const features = [
  {
    icon: CheckSquare,
    iconColor: "text-primary-500",
    bgColor: "bg-primary-50",
    title: "Easy Task Management",
    description: "Create, edit, and delete tasks in seconds. Simple interface, powerful results.",
  },
  {
    icon: Flag,
    iconColor: "text-amber-500",
    bgColor: "bg-amber-50",
    title: "Priority & Status",
    description: "Organize tasks by priority levels and track progress with status updates.",
  },
  {
    icon: BarChart3,
    iconColor: "text-green-500",
    bgColor: "bg-green-50",
    title: "Progress Tracking",
    description: "Visual dashboard shows your productivity stats at a glance.",
  },
  {
    icon: Shield,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
    title: "Secure & Private",
    description: "Your data is protected with industry-standard JWT authentication.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mt-2 mb-4">
            Everything You Need to Stay Organized
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Powerful features designed to help you manage tasks effortlessly
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl bg-neutral-50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 2.4 Additional Components

Continue creating the remaining components following the same pattern:
- `HowItWorksSection.tsx` - 3-step process
- `AppPreviewSection.tsx` - Benefits + screenshot
- `TestimonialsSection.tsx` - User testimonials grid
- `CTASection.tsx` - Final call-to-action banner
- `LandingFooter.tsx` - Multi-column footer

---

## Step 3: Create Barrel Export

**File**: `frontend/src/components/landing/index.ts`

```typescript
export { LandingNavbar } from "./LandingNavbar";
export { HeroSection } from "./HeroSection";
export { FeaturesSection } from "./FeaturesSection";
export { HowItWorksSection } from "./HowItWorksSection";
export { AppPreviewSection } from "./AppPreviewSection";
export { TestimonialsSection } from "./TestimonialsSection";
export { CTASection } from "./CTASection";
export { LandingFooter } from "./LandingFooter";
```

---

## Step 4: Update Landing Page

**File**: `frontend/src/app/page.tsx`

```tsx
import {
  LandingNavbar,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  AppPreviewSection,
  TestimonialsSection,
  CTASection,
  LandingFooter,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AppPreviewSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
```

---

## Step 5: Add Smooth Scrolling

**File**: `frontend/src/app/globals.css`

```css
html {
  scroll-behavior: smooth;
}
```

---

## Step 6: Configure Metadata

**File**: `frontend/src/app/layout.tsx`

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskFlow - Organize Your Life, One Task at a Time",
  description: "The simple, beautiful way to manage your tasks. Stay organized, boost productivity, and never miss a deadline.",
};
```

---

## Testing Checklist

- [ ] Page loads without errors
- [ ] Navigation scrolls to sections smoothly
- [ ] Mobile menu opens/closes correctly
- [ ] CTAs navigate to /signin and /signup
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Animations trigger on scroll
- [ ] Hover states work on feature cards
- [ ] Accessibility: keyboard navigation works
- [ ] Lighthouse score: Performance 90+, Accessibility 95+

---

## Development Commands

```bash
# Start development server
cd frontend
pnpm dev

# Check TypeScript
pnpm type-check

# Build for production
pnpm build

# Preview production build
pnpm start
```

---

## Related Resources

- Feature Spec: `specs/005-landing-page/spec.md`
- Design System: `frontend/FIGMA_DESIGN_SPEC.md`
- Components Contract: `specs/005-landing-page/contracts/components.yaml`
- Framer Motion Skill: `.claude/skills/framer-motion/`

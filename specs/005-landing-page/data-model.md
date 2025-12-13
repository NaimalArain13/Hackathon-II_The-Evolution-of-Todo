# Data Model: Todo App Landing Page

**Feature Branch**: `005-landing-page`
**Date**: 2025-12-13

## Overview

The landing page is a **static, presentational feature** with no persistent data storage requirements. This document defines the TypeScript interfaces for content structures used within the landing page components.

---

## 1. Content Entities

### 1.1 Navigation Item

Represents a link in the navigation bar.

```typescript
interface NavItem {
  label: string;        // Display text (e.g., "Features")
  href: string;         // Target URL or anchor (e.g., "#features", "/signin")
  isExternal?: boolean; // Opens in new tab if true
}
```

### 1.2 Feature Card

Represents a feature displayed in the Features section.

```typescript
interface Feature {
  id: string;           // Unique identifier (e.g., "task-management")
  icon: string;         // Lucide icon name (e.g., "CheckSquare")
  iconColor: string;    // Tailwind color class (e.g., "text-primary-500")
  bgColor: string;      // Icon background color (e.g., "bg-primary-50")
  title: string;        // Feature title (e.g., "Easy Task Management")
  description: string;  // Feature description (1-2 sentences)
}
```

### 1.3 How It Works Step

Represents a step in the How It Works section.

```typescript
interface Step {
  number: number;       // Step number (1, 2, 3)
  icon: string;         // Lucide icon name
  title: string;        // Step title (e.g., "Create Account")
  description: string;  // Step description (1 sentence)
}
```

### 1.4 Testimonial

Represents a user testimonial.

```typescript
interface Testimonial {
  id: string;           // Unique identifier
  quote: string;        // User quote text
  author: {
    name: string;       // User name
    role?: string;      // Optional role/title (e.g., "Product Manager")
    company?: string;   // Optional company name
    avatarUrl?: string; // Optional avatar image URL
  };
}
```

### 1.5 Footer Link Group

Represents a group of links in the footer.

```typescript
interface FooterLinkGroup {
  title: string;        // Group title (e.g., "Product")
  links: NavItem[];     // Array of navigation items
}
```

### 1.6 Social Link

Represents a social media link in the footer.

```typescript
interface SocialLink {
  platform: string;     // Platform name (e.g., "twitter", "github")
  href: string;         // Profile URL
  icon: string;         // Lucide icon name
}
```

---

## 2. Component Props Interfaces

### 2.1 Hero Section Props

```typescript
interface HeroSectionProps {
  badge?: string;                    // Optional badge text (e.g., "✨ Your Personal Task Manager")
  headline: string;                  // Main headline
  subheadline: string;               // Supporting text
  primaryCTA: {
    text: string;                    // Button text
    href: string;                    // Target URL
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  trustText?: string;                // Optional trust badge text
  heroImage?: {
    src: string;
    alt: string;
  };
}
```

### 2.2 Features Section Props

```typescript
interface FeaturesSectionProps {
  overline?: string;                 // Section overline (e.g., "FEATURES")
  title: string;                     // Section title
  subtitle?: string;                 // Section subtitle
  features: Feature[];               // Array of features (4+ items)
}
```

### 2.3 How It Works Section Props

```typescript
interface HowItWorksSectionProps {
  overline?: string;
  title: string;
  steps: Step[];                     // Array of steps (typically 3)
}
```

### 2.4 App Preview Section Props

```typescript
interface AppPreviewSectionProps {
  overline?: string;
  title: string;
  benefits: string[];                // List of benefit strings
  previewImage: {
    src: string;
    alt: string;
  };
}
```

### 2.5 Testimonials Section Props

```typescript
interface TestimonialsSectionProps {
  overline?: string;
  title?: string;
  testimonials: Testimonial[];       // Array of testimonials (3+ items)
}
```

### 2.6 CTA Section Props

```typescript
interface CTASectionProps {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonHref: string;
  trustText?: string;
}
```

### 2.7 Landing Navbar Props

```typescript
interface LandingNavbarProps {
  logo: {
    src?: string;
    text: string;
  };
  navItems: NavItem[];
  loginHref: string;
  signupHref: string;
}
```

### 2.8 Landing Footer Props

```typescript
interface LandingFooterProps {
  logo: {
    src?: string;
    text: string;
  };
  tagline: string;
  linkGroups: FooterLinkGroup[];
  socialLinks?: SocialLink[];
  copyrightText: string;
}
```

---

## 3. Default Content Data

### 3.1 Navigation Items

```typescript
const defaultNavItems: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];
```

### 3.2 Features Data

```typescript
const defaultFeatures: Feature[] = [
  {
    id: "task-management",
    icon: "CheckSquare",
    iconColor: "text-primary-500",
    bgColor: "bg-primary-50",
    title: "Easy Task Management",
    description: "Create, edit, and delete tasks in seconds. Simple interface, powerful results.",
  },
  {
    id: "priority-status",
    icon: "Flag",
    iconColor: "text-warning-500",
    bgColor: "bg-warning-50",
    title: "Priority & Status",
    description: "Organize tasks by priority levels and track progress with status updates.",
  },
  {
    id: "progress-tracking",
    icon: "BarChart3",
    iconColor: "text-secondary-500",
    bgColor: "bg-secondary-50",
    title: "Progress Tracking",
    description: "Visual dashboard shows your productivity stats at a glance.",
  },
  {
    id: "secure-private",
    icon: "Shield",
    iconColor: "text-success-500",
    bgColor: "bg-success-50",
    title: "Secure & Private",
    description: "Your data is protected with industry-standard JWT authentication.",
  },
];
```

### 3.3 Steps Data

```typescript
const defaultSteps: Step[] = [
  {
    number: 1,
    icon: "UserPlus",
    title: "Create Account",
    description: "Sign up in seconds with just your email and password.",
  },
  {
    number: 2,
    icon: "PlusCircle",
    title: "Add Your Tasks",
    description: "Create tasks with titles, descriptions, and priorities.",
  },
  {
    number: 3,
    icon: "CheckCircle",
    title: "Stay Organized",
    description: "Track progress, mark complete, and achieve your goals.",
  },
];
```

### 3.4 Testimonials Data (Placeholder)

```typescript
const defaultTestimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    quote: "TaskFlow has completely transformed how I manage my daily tasks. It's simple, intuitive, and just works!",
    author: {
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechCorp",
    },
  },
  {
    id: "testimonial-2",
    quote: "Finally, a task manager that doesn't get in the way. Clean design and powerful features.",
    author: {
      name: "Michael Chen",
      role: "Software Developer",
      company: "StartupXYZ",
    },
  },
  {
    id: "testimonial-3",
    quote: "I've tried dozens of todo apps, but TaskFlow is the one that stuck. Highly recommended!",
    author: {
      name: "Emily Rodriguez",
      role: "Freelance Designer",
    },
  },
];
```

---

## 4. Relationships & Validation

### 4.1 Entity Relationships

```
Landing Page
├── Navbar
│   ├── Logo
│   ├── NavItem[] (internal links)
│   └── Auth Buttons (external links)
├── Hero Section
│   ├── Content (headline, subheadline)
│   └── CTA Buttons
├── Features Section
│   └── Feature[] (4+ items)
├── How It Works Section
│   └── Step[] (3 items)
├── App Preview Section
│   ├── Benefits list
│   └── Preview image
├── Testimonials Section
│   └── Testimonial[] (3+ items)
├── CTA Section
│   └── CTA Button
└── Footer
    ├── Logo + Tagline
    ├── FooterLinkGroup[] (3-4 groups)
    ├── SocialLink[] (optional)
    └── Copyright
```

### 4.2 Validation Rules

| Entity | Field | Validation |
|--------|-------|------------|
| Feature | icon | Must be valid Lucide icon name |
| Feature | description | Max 100 characters |
| Step | number | 1-3 inclusive |
| Testimonial | quote | Max 200 characters |
| NavItem | href | Must start with "/" or "#" |

---

## 5. State Management

### 5.1 Client State (React useState)

```typescript
// Navbar scroll state
const [isScrolled, setIsScrolled] = useState<boolean>(false);

// Mobile menu state
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
```

### 5.2 No Server State Required

The landing page is entirely static and does not require:
- Database queries
- API calls
- Server-side data fetching
- Authentication state (until user clicks CTA)

---

## 6. SEO Metadata

```typescript
interface LandingPageMetadata {
  title: string;          // "TaskFlow - Organize Your Life, One Task at a Time"
  description: string;    // Meta description for search engines
  keywords: string[];     // SEO keywords
  ogImage: string;        // Open Graph image URL
  canonicalUrl: string;   // Canonical URL
}
```

---

## Notes

- All content is defined as static TypeScript constants
- No database tables or migrations required
- Content can be easily moved to CMS in future if needed
- Type definitions ensure compile-time safety for content structure

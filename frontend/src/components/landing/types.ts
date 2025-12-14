/**
 * Landing Page Type Definitions
 * Feature: 005-landing-page
 */

// Navigation Item - represents a link in the navigation bar
export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

// Feature Card - represents a feature displayed in the Features section
export interface Feature {
  id: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  title: string;
  description: string;
}

// How It Works Step - represents a step in the How It Works section
export interface Step {
  number: number;
  icon: string;
  title: string;
  description: string;
}

// Testimonial - represents a user testimonial
export interface Testimonial {
  id: string;
  quote: string;
  author: {
    name: string;
    role?: string;
    company?: string;
    avatarUrl?: string;
  };
}

// Footer Link Group - represents a group of links in the footer
export interface FooterLinkGroup {
  title: string;
  links: NavItem[];
}

// Social Link - represents a social media link in the footer
export interface SocialLink {
  platform: string;
  href: string;
  icon: string;
}

// Component Props Interfaces

export interface HeroSectionProps {
  badge?: string;
  headline?: string;
  subheadline?: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  trustText?: string;
}

export interface FeaturesSectionProps {
  overline?: string;
  title?: string;
  subtitle?: string;
  features?: Feature[];
}

export interface HowItWorksSectionProps {
  overline?: string;
  title?: string;
  steps?: Step[];
}

export interface AppPreviewSectionProps {
  overline?: string;
  title?: string;
  benefits?: string[];
}

export interface TestimonialsSectionProps {
  overline?: string;
  title?: string;
  testimonials?: Testimonial[];
}

export interface CTASectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  trustText?: string;
}

export interface LandingNavbarProps {
  logo?: {
    src?: string;
    text: string;
  };
  navItems?: NavItem[];
  loginHref?: string;
  signupHref?: string;
}

export interface LandingFooterProps {
  logo?: {
    src?: string;
    text: string;
  };
  tagline?: string;
  linkGroups?: FooterLinkGroup[];
  socialLinks?: SocialLink[];
  copyrightText?: string;
}

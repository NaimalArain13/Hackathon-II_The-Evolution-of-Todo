/**
 * Landing Page Content Data
 * Feature: 005-landing-page
 */

import type {
  NavItem,
  Feature,
  Step,
  Testimonial,
  FooterLinkGroup,
  SocialLink,
} from "./types";

// Default Navigation Items
export const defaultNavItems: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#testimonials" },
];

// Default Features Data
export const defaultFeatures: Feature[] = [
  {
    id: "task-management",
    icon: "CheckSquare",
    iconColor: "text-primary-500",
    bgColor: "bg-primary-100",
    title: "Easy Task Management",
    description:
      "Create, edit, and delete tasks in seconds. Simple interface, powerful results.",
  },
  {
    id: "priority-status",
    icon: "Flag",
    iconColor: "text-amber-500",
    bgColor: "bg-amber-50",
    title: "Priority & Status",
    description:
      "Organize tasks by priority levels and track progress with status updates.",
  },
  {
    id: "progress-tracking",
    icon: "BarChart3",
    iconColor: "text-green-500",
    bgColor: "bg-green-50",
    title: "Progress Tracking",
    description:
      "Visual dashboard shows your productivity stats at a glance.",
  },
  {
    id: "secure-private",
    icon: "Shield",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
    title: "Secure & Private",
    description:
      "Your data is protected with industry-standard JWT authentication.",
  },
];

// Default Steps Data
export const defaultSteps: Step[] = [
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

// Default Testimonials Data (Placeholder)
export const defaultTestimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    quote:
      "TaskFlow has completely transformed how I manage my daily tasks. It's simple, intuitive, and just works!",
    author: {
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechCorp",
    },
  },
  {
    id: "testimonial-2",
    quote:
      "Finally, a task manager that doesn't get in the way. Clean design and powerful features.",
    author: {
      name: "Michael Chen",
      role: "Software Developer",
      company: "StartupXYZ",
    },
  },
  {
    id: "testimonial-3",
    quote:
      "I've tried dozens of todo apps, but TaskFlow is the one that stuck. Highly recommended!",
    author: {
      name: "Emily Rodriguez",
      role: "Freelance Designer",
    },
  },
];

// Footer Link Groups
export const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#testimonials" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

// Social Links
export const defaultSocialLinks: SocialLink[] = [
  { platform: "twitter", href: "https://x.com/NaimalArain2001?s=09", icon: "Twitter" },
  { platform: "github", href: "https://github.com/NaimalArain13", icon: "Github" },
  { platform: "linkedin", href: "https://www.linkedin.com/in/naimal-arain-", icon: "Linkedin" },
];

# TaskFlow - Figma Design Specification

## Design System Overview

**App Name**: TaskFlow
**Tagline**: "Organize Your Life, One Task at a Time"
**Design Style**: Modern, Clean, Minimalist with vibrant accents
**Reference**: [Figma Community Todo Design](https://www.figma.com/design/94mDWGXUYL9S0Qdmz1E3Vv/)

---

## 1. Design Tokens

### 1.1 Color Palette

#### Primary Colors (Brand)
```
primary-50:  #EEF2FF (lightest)
primary-100: #E0E7FF
primary-200: #C7D2FE
primary-300: #A5B4FC
primary-400: #818CF8
primary-500: #6366F1 (main brand color - Indigo)
primary-600: #4F46E5
primary-700: #4338CA
primary-800: #3730A3
primary-900: #312E81 (darkest)
```

#### Secondary Colors (Accent)
```
secondary-50:  #F0FDF4
secondary-100: #DCFCE7
secondary-200: #BBF7D0
secondary-300: #86EFAC
secondary-400: #4ADE80
secondary-500: #22C55E (main accent - Green)
secondary-600: #16A34A
secondary-700: #15803D
secondary-800: #166534
secondary-900: #14532D
```

#### Neutral Colors (Grays)
```
neutral-50:  #FAFAFA (background light)
neutral-100: #F4F4F5
neutral-200: #E4E4E7
neutral-300: #D4D4D8
neutral-400: #A1A1AA
neutral-500: #71717A
neutral-600: #52525B
neutral-700: #3F3F46
neutral-800: #27272A (background dark)
neutral-900: #18181B (text dark)
```

#### Semantic Colors
```
Success:
  - success-light: #DCFCE7
  - success-main:  #22C55E
  - success-dark:  #15803D

Warning:
  - warning-light: #FEF3C7
  - warning-main:  #F59E0B
  - warning-dark:  #B45309

Error:
  - error-light:   #FEE2E2
  - error-main:    #EF4444
  - error-dark:    #B91C1C

Info:
  - info-light:    #DBEAFE
  - info-main:     #3B82F6
  - info-dark:     #1D4ED8
```

#### Priority Colors (Tasks)
```
priority-low:    #22C55E (Green)
priority-medium: #F59E0B (Amber)
priority-high:   #EF4444 (Red)
```

#### Status Colors (Tasks)
```
status-pending:     #A1A1AA (Gray)
status-in_progress: #3B82F6 (Blue)
status-completed:   #22C55E (Green)
```

### 1.2 Typography

#### Font Families
```
Primary Font: Inter (Google Fonts)
- Use for body text, buttons, inputs, labels

Heading Font: Inter (same, for consistency)
- Can use Poppins if you want more personality
```

#### Type Scale
```
Display:    48px / 1.1 / 700 (Bold)      - Hero headlines
H1:         36px / 1.2 / 700 (Bold)      - Page titles
H2:         30px / 1.25 / 600 (Semibold) - Section titles
H3:         24px / 1.3 / 600 (Semibold)  - Card titles
H4:         20px / 1.4 / 500 (Medium)    - Subsection titles
Body-lg:    18px / 1.6 / 400 (Regular)   - Large body text
Body:       16px / 1.5 / 400 (Regular)   - Default body text
Body-sm:    14px / 1.5 / 400 (Regular)   - Small body text
Caption:    12px / 1.4 / 400 (Regular)   - Captions, labels
Tiny:       10px / 1.4 / 500 (Medium)    - Badges, tags
```

### 1.3 Spacing System (4px baseline)
```
space-0:   0px
space-1:   4px
space-2:   8px
space-3:   12px
space-4:   16px
space-5:   20px
space-6:   24px
space-8:   32px
space-10:  40px
space-12:  48px
space-16:  64px
space-20:  80px
space-24:  96px
```

### 1.4 Border Radius
```
radius-none: 0px
radius-sm:   4px
radius-md:   8px
radius-lg:   12px
radius-xl:   16px
radius-2xl:  24px
radius-full: 9999px (pill/circle)
```

### 1.5 Shadows
```
shadow-sm:   0 1px 2px rgba(0, 0, 0, 0.05)
shadow-md:   0 4px 6px -1px rgba(0, 0, 0, 0.1)
shadow-lg:   0 10px 15px -3px rgba(0, 0, 0, 0.1)
shadow-xl:   0 20px 25px -5px rgba(0, 0, 0, 0.1)
shadow-card: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)
shadow-hover: 0 10px 20px -5px rgba(0, 0, 0, 0.15)
```

---

## 2. Component Library

### 2.1 Buttons

#### Primary Button
```
- Background: primary-500 (#6366F1)
- Text: White
- Padding: 12px 24px
- Border Radius: 8px
- Font: 14px / 500 weight
- Min Height: 44px

States:
- Hover: primary-600 (#4F46E5)
- Active: primary-700 (#4338CA)
- Disabled: 50% opacity, cursor not-allowed
- Loading: Spinner icon, text hidden
```

#### Secondary Button
```
- Background: Transparent
- Border: 1px solid primary-500
- Text: primary-500
- Padding: 12px 24px
- Border Radius: 8px

States:
- Hover: primary-50 background
- Active: primary-100 background
```

#### Ghost Button
```
- Background: Transparent
- Text: neutral-700
- Padding: 8px 16px

States:
- Hover: neutral-100 background
```

#### Destructive Button
```
- Background: error-main (#EF4444)
- Text: White
- Same sizing as primary

States:
- Hover: error-dark
```

#### Icon Button
```
- Size: 40x40px
- Icon: 20x20px centered
- Border Radius: 8px
- Background: Transparent

States:
- Hover: neutral-100 background
```

### 2.2 Input Fields

#### Text Input
```
- Height: 44px
- Padding: 12px 16px
- Border: 1px solid neutral-300
- Border Radius: 8px
- Background: White
- Font: 16px

States:
- Focus: 2px primary-500 border, no outline
- Error: 2px error-main border + error message below
- Disabled: neutral-100 background, 60% opacity
```

#### Textarea
```
- Min Height: 120px
- Same styling as text input
- Resize: vertical only
```

#### Select
```
- Same styling as text input
- Dropdown icon on right
- Dropdown menu with neutral-50 background
```

#### Checkbox
```
- Size: 20x20px
- Border: 2px solid neutral-400
- Border Radius: 4px
- Checked: primary-500 fill with white checkmark
```

### 2.3 Cards

#### Base Card
```
- Background: White
- Border Radius: 12px
- Padding: 24px
- Shadow: shadow-card
- Border: 1px solid neutral-200 (optional)
```

#### Task Card
```
- Same as base card
- Hover: shadow-hover, translateY(-2px)
- Completed state: 60% opacity, strikethrough title
```

#### Stat Card
```
- Same as base card
- Icon area (48x48px) with colored background
- Large number display
- Label below
```

### 2.4 Badges

#### Status Badge
```
- Padding: 4px 12px
- Border Radius: 9999px (pill)
- Font: 12px / 500 weight
- Height: 24px

Variants:
- Pending: neutral-200 bg, neutral-700 text
- In Progress: info-light bg, info-dark text
- Completed: success-light bg, success-dark text
```

#### Priority Badge
```
- Same sizing as status badge

Variants:
- Low: success-light bg, success-dark text
- Medium: warning-light bg, warning-dark text
- High: error-light bg, error-dark text
```

### 2.5 Navigation

#### Sidebar Nav Item
```
- Height: 44px
- Padding: 12px 16px
- Border Radius: 8px
- Icon (20px) + Label

States:
- Default: Transparent bg, neutral-600 text
- Hover: neutral-100 bg
- Active: primary-50 bg, primary-600 text, left border accent
```

#### Top Nav
```
- Height: 64px
- Background: White
- Border Bottom: 1px solid neutral-200
- Shadow: shadow-sm
```

### 2.6 Modals

#### Modal Container
```
- Background: White
- Border Radius: 16px
- Shadow: shadow-xl
- Max Width: 500px (forms), 600px (content)
- Padding: 24px

Backdrop:
- Background: rgba(0, 0, 0, 0.5)
- Blur: 4px (optional)
```

### 2.7 Toast Notifications

```
- Min Width: 300px
- Max Width: 500px
- Padding: 16px
- Border Radius: 8px
- Shadow: shadow-lg

Variants:
- Success: success-light bg, success border-left
- Error: error-light bg, error border-left
- Warning: warning-light bg, warning border-left
- Info: info-light bg, info border-left
```

---

## 3. Page Layouts

### 3.1 Viewport Sizes
```
Desktop:  1440px width
Tablet:   768px width
Mobile:   375px width
```

### 3.2 Grid System
```
Desktop:
- 12 columns
- Gutter: 24px
- Margins: 80px (sides)
- Max content width: 1280px

Tablet:
- 8 columns
- Gutter: 16px
- Margins: 40px

Mobile:
- 4 columns
- Gutter: 16px
- Margins: 20px
```

---

## 4. Landing Page Design

### 4.1 Navbar (Desktop: 1440x80px)
```
Layout: Horizontal, space-between
Background: Transparent (becomes white on scroll)
Padding: 0 80px

Left:
- Logo (32x32px icon)
- App name "TaskFlow" (H4, primary-600)

Center:
- Nav links: Features, How It Works, About
- Style: Body-sm, neutral-600
- Hover: primary-600
- Spacing: 32px between items

Right:
- Login button (Ghost)
- Sign Up button (Primary)
- Spacing: 16px between buttons
```

### 4.2 Hero Section (Desktop: 1440x700px)
```
Layout: Two columns (60% text, 40% image)
Background: Gradient (primary-50 to white) or subtle pattern
Padding: 80px sides, 120px top

Left Column:
- Badge: "✨ Your Personal Task Manager" (optional)
- Headline (Display): "Organize Your Life, One Task at a Time"
- Subheadline (Body-lg, neutral-600): "The simple, beautiful way to manage your tasks. Stay organized, boost productivity, and never miss a deadline."
- CTA Row:
  - Primary button: "Get Started Free" (with arrow icon)
  - Secondary button: "See How It Works"
- Trust text (Caption, neutral-500): "No credit card required • Free forever"

Right Column:
- Hero illustration or app mockup
- Floating task cards with subtle animation
- Or: Dashboard screenshot in browser frame
```

### 4.3 Features Section (Desktop: 1440x600px)
```
Layout: Section title + 4-column grid
Background: White
Padding: 80px

Header:
- Overline (Caption, primary-500, uppercase): "FEATURES"
- Title (H2): "Everything You Need to Stay Organized"
- Subtitle (Body-lg, neutral-600): "Powerful features designed to help you manage tasks effortlessly"

Feature Cards (4 cards):
1. Easy Task Management
   - Icon: CheckSquare (primary-500, 48x48px)
   - Title (H4): "Easy Task Management"
   - Description (Body-sm, neutral-600): "Create, edit, and delete tasks in seconds. Simple interface, powerful results."

2. Priority & Status
   - Icon: Flag (warning-main)
   - Title: "Priority & Status"
   - Description: "Organize tasks by priority levels and track progress with status updates."

3. Progress Tracking
   - Icon: BarChart (secondary-500)
   - Title: "Progress Tracking"
   - Description: "Visual dashboard shows your productivity stats at a glance."

4. Secure & Private
   - Icon: Shield (success-main)
   - Title: "Secure & Private"
   - Description: "Your data is protected with industry-standard JWT authentication."

Card Style:
- Background: neutral-50
- Padding: 32px
- Border Radius: 16px
- Icon container: 64x64px, 12px radius, colored background (10% opacity of icon color)
- Hover: shadow-hover, translateY(-4px)
```

### 4.4 How It Works Section (Desktop: 1440x500px)
```
Layout: Section header + 3 steps horizontal
Background: primary-50 (subtle)
Padding: 80px

Header:
- Overline: "HOW IT WORKS"
- Title (H2): "Get Started in 3 Easy Steps"

Steps Layout: 3 equal columns with connecting line

Step 1:
- Number circle: "1" (primary-500 bg, white text, 48px circle)
- Icon/Illustration: User registration
- Title (H4): "Create Account"
- Description (Body-sm): "Sign up in seconds with just your email and password."

Step 2:
- Number: "2"
- Icon: Task creation
- Title: "Add Your Tasks"
- Description: "Create tasks with titles, descriptions, and priorities."

Step 3:
- Number: "3"
- Icon: Completed tasks
- Title: "Stay Organized"
- Description: "Track progress, mark complete, and achieve your goals."

Connecting Element:
- Dashed line or arrow between steps
- Color: neutral-300
```

### 4.5 App Showcase Section (Desktop: 1440x600px)
```
Layout: Two columns (40% text, 60% image)
Background: White
Padding: 80px

Left Column:
- Overline: "APP PREVIEW"
- Title (H2): "Built for Productivity"
- Benefits list with checkmarks:
  ✓ Clean, intuitive interface
  ✓ Works on all devices
  ✓ Lightning-fast performance
  ✓ No credit card required
- Each item: Check icon (success-main) + Body text

Right Column:
- Large app screenshot/mockup
- Show dashboard with tasks
- Optional: Browser frame or device mockup
- Shadow: shadow-xl
- Rotation: Slight 3D perspective (optional)
```

### 4.6 CTA Section (Desktop: 1440x300px)
```
Layout: Centered content
Background: Gradient (primary-500 to primary-600)
Padding: 80px
Border Radius: 0 (full width) or 24px (contained)

Content:
- Title (H2, White): "Ready to Get Organized?"
- Subtitle (Body-lg, White/80% opacity): "Join thousands of users managing their tasks effectively"
- CTA Button: "Create Free Account" (White bg, primary-600 text, large size)
- Trust text (Caption, White/60%): "Free forever • No credit card needed"
```

### 4.7 Footer (Desktop: 1440x200px)
```
Layout: 4 columns + bottom bar
Background: neutral-900
Padding: 64px 80px top, 24px bottom

Column 1 (Brand):
- Logo + "TaskFlow" (White)
- Tagline (Body-sm, neutral-400): "Organize your life, one task at a time."

Column 2 (Product):
- Title (Body-sm, White, 600 weight): "Product"
- Links: Features, Pricing, FAQ

Column 3 (Company):
- Title: "Company"
- Links: About, Contact, Blog

Column 4 (Legal):
- Title: "Legal"
- Links: Privacy Policy, Terms of Service

Bottom Bar:
- Border top: 1px solid neutral-700
- Left: "© 2025 TaskFlow. All rights reserved." (neutral-500)
- Right: Social icons (neutral-500, hover: white)
```

---

## 5. Authentication Pages

### 5.1 Login Page (Desktop: 1440x900px)
```
Layout: Split screen (50/50)

Left Panel (Form):
- Background: White
- Padding: 80px
- Max width: 400px (centered)

Content:
- Logo + "TaskFlow" (top)
- Title (H2): "Welcome Back"
- Subtitle (Body, neutral-600): "Sign in to continue to your dashboard"

Form:
- Email input (label: "Email address")
- Password input (label: "Password", with show/hide toggle)
- Row: Checkbox "Remember me" + Link "Forgot password?"
- Primary button: "Sign In" (full width)
- Divider: "or continue with"
- Social buttons row: Google, GitHub (outlined buttons with icons)
- Bottom text: "Don't have an account? Sign up" (link styled)

Right Panel (Branding):
- Background: Gradient (primary-500 to primary-700)
- Large illustration or pattern
- Optional: Testimonial quote
- Decorative shapes/patterns
```

### 5.2 Registration Page
```
Same split layout as login

Form Content:
- Title: "Create Account"
- Subtitle: "Start organizing your tasks today"

Form Fields:
- Full name input
- Email input
- Password input (with strength indicator below)
- Confirm password input
- Checkbox: "I agree to the Terms of Service and Privacy Policy"
- Primary button: "Create Account"
- Divider + Social buttons
- "Already have an account? Sign in"
```

---

## 6. Dashboard Pages

### 6.1 Dashboard Layout
```
Sidebar (Left):
- Width: 240px (desktop), 64px (collapsed), hidden (mobile)
- Background: White
- Border right: 1px solid neutral-200

Top Nav:
- Height: 64px
- Full width minus sidebar
- Background: White
- Border bottom: 1px solid neutral-200

Main Content:
- Background: neutral-50
- Padding: 32px
```

### 6.2 Sidebar Content
```
Top:
- Logo + "TaskFlow" (or icon only when collapsed)
- Padding: 24px

Navigation:
- Dashboard (Home icon)
- Tasks (CheckSquare icon)
- Profile (User icon)
- Settings (Settings icon)
- Style: See Nav Item component

Bottom:
- User card (avatar + name + email)
- Logout button
```

### 6.3 Dashboard Home
```
Header:
- Welcome message: "Welcome back, {name}!"
- Subtitle: "Here's your task overview"
- "New Task" button (right aligned)

Stats Row (4 cards):
1. Total Tasks (neutral icon, neutral-600)
2. Completed (success icon, success colors)
3. In Progress (info icon, info colors)
4. Pending (warning icon, warning colors)

Recent Tasks Section:
- Title: "Recent Tasks"
- "View All" link
- 5 most recent task cards
```

### 6.4 Tasks Page
```
Header:
- Title: "Tasks"
- "New Task" button

Filters Bar:
- Status tabs: All | Pending | In Progress | Completed
- Priority dropdown: All Priorities, Low, Medium, High
- Sort dropdown: Newest, Oldest, Priority, Title
- Search input (right)

Task List:
- Vertical stack of task cards
- Infinite scroll or pagination
```

### 6.5 Task Card (List View)
```
Layout: Horizontal
Height: Auto (min 80px)
Padding: 16px

Left:
- Checkbox (mark complete)

Center:
- Title (H4) - strikethrough if completed
- Description (Body-sm, neutral-500, max 2 lines)
- Meta row: Created date, Updated date

Right:
- Priority badge
- Status badge
- Actions dropdown (Edit, Delete)
```

---

## 7. Modals

### 7.1 Create Task Modal
```
Width: 500px
Padding: 24px

Header:
- Title (H3): "Create New Task"
- Close button (X icon)

Form:
- Title input (required) - "What needs to be done?"
- Description textarea (optional) - "Add details..."
- Status select: Pending, In Progress, Completed
- Priority select: Low, Medium, High

Footer:
- Cancel button (Ghost)
- Create Task button (Primary)
```

### 7.2 Edit Task Modal
```
Same as create, but:
- Title: "Edit Task"
- Pre-filled values
- "Save Changes" button
- Delete button (Destructive, left aligned)
```

### 7.3 Delete Confirmation Modal
```
Width: 400px
Text align: Center

Content:
- Warning icon (error-main, 48px)
- Title (H3): "Delete Task?"
- Message (Body): "Are you sure you want to delete this task? This action cannot be undone."
- Task title preview (Body-sm, neutral-500)

Footer:
- Cancel button
- Delete button (Destructive)
```

---

## 8. States & Interactions

### 8.1 Loading States
- Skeleton screens for task lists (gray rectangles with shimmer)
- Spinner for buttons (white spinner, hide text)
- Progress bar for page loads

### 8.2 Empty States
- Illustration or icon
- Title: "No tasks yet"
- Description: "Create your first task to get started"
- CTA button: "Create Task"

### 8.3 Error States
- Input errors: Red border + error message below
- Form errors: Error toast or inline banner
- Page errors: Full page error with retry button

---

## 9. Responsive Behavior

### Mobile Adaptations (375px)
- Navbar: Logo left, hamburger right, menu slides from right
- Hero: Stack vertically, image below text
- Features: 1 column
- Steps: Vertical stack
- Footer: Stack columns
- Sidebar: Hidden, accessible via hamburger
- Task cards: Stack vertically, full width
- Modals: Full screen

### Tablet Adaptations (768px)
- Features: 2x2 grid
- Steps: 3 columns (compact)
- Sidebar: Collapsed (icons only)
- 2-column layouts become single column

---

## 10. Figma File Structure

```
Pages:
├── Cover
├── 🎨 Design System
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Icons
├── 🧩 Components
│   ├── Buttons
│   ├── Inputs
│   ├── Cards
│   ├── Navigation
│   ├── Modals
│   └── Badges
├── 💻 Desktop (1440px)
│   ├── Landing Page
│   ├── Login
│   ├── Register
│   ├── Dashboard
│   ├── Tasks
│   └── Profile
├── 📱 Mobile (375px)
│   ├── Landing Page
│   ├── Login
│   ├── Register
│   ├── Dashboard
│   ├── Tasks
│   └── Profile
└── 🔗 Prototype
    └── Interactive flows
```

---

## 11. Export Checklist

- [ ] All color styles created
- [ ] All text styles created
- [ ] All components have variants
- [ ] Responsive layouts complete
- [ ] Interactive prototype linked
- [ ] Design tokens documented
- [ ] Assets exportable (icons, illustrations)

---

**Design Inspiration**: [Figma Community Todo Design](https://www.figma.com/design/94mDWGXUYL9S0Qdmz1E3Vv/)
**Target Framework**: Next.js 16+ with Tailwind CSS
**Backend API**: `https://naimalcreativityai-sdd-todo-app.hf.space/`

---

*Generated by Claude Code - TaskFlow Design System v1.0*

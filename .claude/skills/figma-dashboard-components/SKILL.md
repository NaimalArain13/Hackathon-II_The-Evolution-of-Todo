# Figma Dashboard Components Skill

## Skill Overview
**Skill Name**: figma-dashboard-components
**Category**: Design & UI Components
**Purpose**: Design comprehensive dashboard layouts, task management interfaces, profile pages, and reusable UI components for the todo application.

## When to Use This Skill
- Designing the main dashboard/homepage
- Creating task management views (list, board, calendar)
- Building profile and settings pages
- Designing navigation systems (sidebar, top nav)
- Creating data visualization components
- Designing admin panels or analytics views
- Building reusable component libraries

## Core Components

### 1. Dashboard Layout

#### Sidebar Navigation
```
Sidebar (240px fixed width):
├── Brand Section (64px height)
│   ├── Logo (32x32px)
│   └── App Name (H4)
├── Navigation Menu
│   ├── Dashboard (icon + label)
│   ├── Tasks (icon + label)
│   ├── Projects (icon + label, with badge)
│   ├── Calendar (icon + label)
│   └── Settings (icon + label)
├── Spacer (flex-grow)
└── User Profile Card (80px height)
    ├── Avatar (40x40px)
    ├── Name (small text)
    └── Dropdown arrow

States:
- Default: Item with background on hover
- Active: Item with primary background + icon color
- Collapsed: Show only icons (64px width)
- Mobile: Slide-out drawer
```

#### Top Navigation Bar
```
Top Bar (64px height):
├── Left Section
│   ├── Menu Toggle (mobile only)
│   └── Page Title (H2)
├── Center Section
│   └── Search Bar (optional)
└── Right Section
    ├── Notifications (icon + badge)
    ├── User Avatar
    └── Settings Icon

Background: White with subtle bottom border
Shadow: 0 1px 3px rgba(0,0,0,0.1)
```

#### Main Content Area
```
Content Area (flex-grow):
├── Page Header (80px height)
│   ├── Title + Subtitle
│   └── Primary Action (+ New Task button)
├── Stats/Metrics Cards (if applicable)
│   └── Grid of 3-4 stat cards
├── Filters/Tabs (optional)
│   └── Status tabs, sort dropdown
└── Content Section
    └── Task list/grid/board
```

### 2. Task Components

#### Task Card (List View)
```
Task Card (min-height: 120px):
├── Header Row
│   ├── Checkbox (left, 20x20px)
│   ├── Priority Badge (colored dot + label)
│   └── Status Badge (right, pill shape)
├── Task Title (H4, max 2 lines)
├── Task Description (Body, max 3 lines, truncated)
├── Metadata Row
│   ├── Created Date (icon + text)
│   └── Due Date (icon + text, if exists)
└── Actions Row
    ├── Edit Icon Button
    ├── Delete Icon Button
    └── More Options (...)

Styling:
- Background: White (dark: neutral-800)
- Border: 1px solid neutral-200
- Border Radius: 12px
- Padding: 20px
- Hover: Lift effect + shadow increase
- Completed: Strikethrough title, 60% opacity
```

#### Task Card (Board View / Kanban)
```
Task Card (Board):
├── Priority Indicator (4px colored left border)
├── Task Title (H5, max 2 lines)
├── Task Description (truncated to 1 line)
├── Tags/Labels (optional)
│   └── Small pills for categories
├── Metadata
│   ├── Due Date (if set)
│   └── Assignee Avatar (if applicable)
└── Quick Actions
    └── Edit/Delete icons on hover

Styling:
- Width: 100% of column
- Min-height: 100px
- Compact padding: 16px
- Draggable: cursor grab
```

#### Task Detail Modal
```
Modal (600px width, max-height: 80vh):
├── Header
│   ├── Task Title (editable, H3)
│   ├── Status Badge
│   └── Close Button (X)
├── Priority Selector
│   └── Radio buttons (Low, Medium, High)
├── Description Editor
│   └── Rich text or textarea
├── Metadata Section
│   ├── Created: {date}
│   ├── Updated: {date}
│   └── Status: Dropdown selector
├── Due Date Picker (optional)
│   └── Calendar input
├── Tags/Categories (optional)
│   └── Multi-select dropdown
└── Footer
    ├── Delete Button (left, destructive)
    └── Save Button (right, primary)
```

### 3. Task Management Views

#### List View
```
Task List:
├── Filters Bar
│   ├── Status Tabs (All, Pending, In Progress, Completed)
│   ├── Priority Filter (dropdown)
│   └── Sort By (dropdown: Date, Priority, Title)
├── Search Bar
│   └── Search icon + input
└── Task Cards
    └── Vertical stack with 16px gap

Empty State:
- Icon (task list illustration)
- Message: "No tasks yet"
- CTA: "+ Create your first task" button
```

#### Board View (Kanban)
```
Board Layout:
├── Column Headers (3 columns)
│   ├── Pending (with count badge)
│   ├── In Progress (with count badge)
│   └── Completed (with count badge)
└── Columns (flex, equal width)
    └── Scrollable task card lists

Drag & Drop:
- Cards draggable between columns
- Drop zones highlight on drag
- Auto-scroll when near edges
- Visual feedback: lift + shadow
```

#### Calendar View (Future Feature)
```
Calendar Layout:
├── Month/Week Selector
├── Date Grid
│   └── Each day cell:
│       ├── Date number
│       └── Task indicators (colored dots)
└── Selected Date Details
    └── Full task list for day

Task indicators:
- Red dot: High priority
- Yellow dot: Medium priority
- Green dot: Low priority
- Multiple dots: Multiple tasks
```

### 4. Profile Components

#### Profile Header Card
```
Profile Card (full width):
├── Cover Image (200px height)
│   └── Gradient or pattern
├── Avatar (120x120px)
│   └── Positioned -60px from cover bottom
├── User Info
│   ├── Name (H2)
│   ├── Email (body text)
│   └── Member Since (small text)
└── Actions
    ├── Edit Profile Button
    └── Settings Icon

Styling:
- Card with rounded corners
- Shadow for elevation
- Responsive: stack on mobile
```

#### Profile Info Section
```
Info Grid (2 columns):
├── Personal Information
│   ├── Label: "Name"
│   ├── Value: {user.name}
│   └── Edit icon
├── Email
│   ├── Label: "Email"
│   ├── Value: {user.email}
│   └── Verified badge
├── Password
│   ├── Label: "Password"
│   ├── Value: "••••••••"
│   └── Change button
└── Account Created
    ├── Label: "Member Since"
    └── Value: {formatted date}

Edit Mode:
- Fields become editable inputs
- Show Save/Cancel buttons
- Validate on blur
```

#### Statistics Cards
```
Stats Grid (3-4 cards):
├── Total Tasks
│   ├── Icon (list icon)
│   ├── Number (large, H1)
│   ├── Label: "Total Tasks"
│   └── Trend indicator (+5 this week)
├── Completed Tasks
│   ├── Icon (checkmark)
│   ├── Number + Percentage
│   └── Progress bar
├── In Progress
│   └── Similar layout
└── Pending Tasks
    └── Similar layout

Styling:
- Background gradient
- Icon with colored background
- Hover effect: subtle lift
```

### 5. Navigation Components

#### Breadcrumbs
```
Breadcrumbs:
Home / Dashboard / Tasks / {Task Title}

Styling:
- Small text (14px)
- Separator: "/" or ">" icon
- Active page: bold or primary color
- Links: hover underline
```

#### Pagination
```
Pagination:
← Previous | 1 [2] 3 4 5 ... 10 | Next →

Components:
- Previous/Next buttons (disabled if not available)
- Page numbers (max 5 visible)
- Current page highlighted
- Ellipsis for skipped pages
- Jump to page input (optional)
```

#### Tabs
```
Tabs:
[All Tasks] | Pending | In Progress | Completed

Styling:
- Horizontal bar
- Active tab: underline or background
- Smooth transition between tabs
- Badge with count on each tab
```

### 6. Feedback Components

#### Toast Notifications
```
Toast (min-width: 300px, max-width: 500px):
├── Icon (left)
│   ├── Success: Checkmark (green)
│   ├── Error: X (red)
│   ├── Warning: ! (yellow)
│   └── Info: i (blue)
├── Content
│   ├── Title (optional, bold)
│   └── Message (body text)
├── Close Button (X, right)
└── Progress Bar (bottom, auto-dismiss indicator)

Position: Top-right or bottom-right
Animation: Slide in from right
Duration: 3-5 seconds
Stack: Multiple toasts stack vertically
```

#### Empty States
```
Empty State:
├── Illustration (200x200px)
│   └── Friendly, on-brand graphic
├── Headline (H3)
│   └── "No tasks yet" or context-specific
├── Description (body)
│   └── Helpful explanation
└── Call to Action
    └── Primary button ("Create Task")

Styling:
- Centered in container
- Generous spacing
- Subtle background or border
```

#### Loading States
```
Skeleton Screen:
├── Animated placeholders
│   ├── Header bar (shimmer effect)
│   ├── Stats cards (3 boxes)
│   └── Task cards (5 rows)
└── Animation: Left-to-right shimmer

Spinner:
- Use for button loading states
- 24px diameter
- Primary color
- Smooth rotation
```

### 7. Modal Components

#### Confirmation Dialog
```
Confirmation Modal (400px width):
├── Icon (warning or question icon, centered)
├── Title (H4, centered)
│   └── "Delete Task?"
├── Message (body, centered)
│   └── "This action cannot be undone."
└── Actions (centered)
    ├── Cancel Button (secondary)
    └── Confirm Button (primary/destructive)

Styling:
- Compact padding
- Centered on screen
- Dark overlay background (50% opacity)
- Danger actions: red button
```

#### Settings Modal
```
Settings Modal (700px width):
├── Sidebar (200px)
│   ├── General
│   ├── Account
│   ├── Notifications
│   └── Appearance
└── Content Area (500px)
    └── Settings forms for selected section

Sections:
- General: Language, timezone
- Account: Password change, delete account
- Notifications: Email preferences, push settings
- Appearance: Theme (light/dark), color scheme
```

### 8. Form Components

#### Input Fields
```
Text Input:
├── Label (bold, above input)
├── Input Field (44px height)
│   ├── Placeholder text
│   └── Icon (optional, left or right)
├── Helper Text (small, below input)
└── Error Message (red, below input)

States:
- Default: gray border
- Focus: primary border, shadow
- Error: red border + error message
- Success: green border + checkmark
- Disabled: gray background, not interactive
```

#### Dropdown Selects
```
Select:
├── Label
├── Select Button (shows current selection)
│   ├── Selected text
│   └── Dropdown arrow
└── Dropdown Menu (on click)
    ├── Search input (if many options)
    └── Option list
        ├── Option (hover highlight)
        └── Checkmark on selected

Custom styling (not native select):
- Matches design system
- Smooth animations
- Keyboard accessible
```

#### Date Picker
```
Date Picker:
├── Input (shows selected date)
└── Calendar Popover
    ├── Month/Year selector
    ├── Date grid (7x6)
    │   ├── Today highlighted
    │   └── Selected date with primary background
    └── Quick actions
        ├── Today
        ├── Tomorrow
        └── Next Week

Styling:
- Popover below input
- Hover states on dates
- Disabled dates (grayed out)
```

## Dashboard Layouts

### Dashboard Homepage
```
Layout:
├── Sidebar (left, fixed)
├── Main Content (center, scrollable)
│   ├── Welcome Section
│   │   ├── "Welcome back, {name}!"
│   │   └── Current date/time
│   ├── Quick Stats (4 cards)
│   │   ├── Total Tasks
│   │   ├── Completed (with %)
│   │   ├── In Progress
│   │   └── Due Today
│   ├── Recent Tasks (5 cards)
│   │   └── "View All" link
│   └── Activity Feed (optional)
│       └── Recent actions timeline
└── Right Panel (optional, 300px)
    ├── Calendar widget
    └── Upcoming tasks
```

### Tasks Page
```
Layout:
├── Sidebar (left, fixed)
└── Main Content (center, scrollable)
    ├── Page Header
    │   ├── Title: "Tasks"
    │   └── "+ New Task" button
    ├── Filters & Search
    │   ├── Status tabs
    │   ├── Priority filter
    │   ├── Search bar
    │   └── Sort dropdown
    ├── View Switcher
    │   └── List | Board | Calendar
    └── Task Content
        └── Chosen view (list/board/calendar)
```

## Responsive Design

### Desktop (1440px+)
- Full sidebar visible
- 3-4 column task grid
- All features visible

### Tablet (768px - 1439px)
- Sidebar collapses to icons only
- 2 column task grid
- Some features in overflow menus

### Mobile (< 768px)
- Hamburger menu for navigation
- Single column layout
- Bottom navigation bar
- Modals become full-screen
- Swipe gestures for actions

## Design System Integration

All components should use:
- **Colors**: From defined color palette
- **Spacing**: 4px/8px baseline grid
- **Typography**: Defined text styles
- **Shadows**: Consistent elevation levels
- **Border Radius**: 8px standard, 12px for cards
- **Icons**: Lucide Icons or Heroicons (24px standard size)

## Accessibility

- **Keyboard Navigation**: Tab order, focus indicators
- **ARIA Labels**: Screen reader support
- **Color Contrast**: WCAG AA compliance (4.5:1)
- **Touch Targets**: 44x44px minimum
- **Focus States**: Visible outlines on interactive elements
- **Error Announcements**: Screen reader alerts

## Component Checklist

- [ ] All states designed (default, hover, active, disabled)
- [ ] Responsive layouts for all breakpoints
- [ ] Error states and empty states included
- [ ] Loading states shown
- [ ] Keyboard navigation considered
- [ ] Color contrast verified
- [ ] Component naming consistent
- [ ] Reusable components are instances, not duplicates
- [ ] Documentation added to component descriptions

---

**Backend API**: `https://naimalcreativityai-sdd-todo-app.hf.space/`
**Design Inspiration**: [Figma Community Todo Design](https://www.figma.com/design/94mDWGXUYL9S0Qdmz1E3Vv/)
**Version**: 1.0.0

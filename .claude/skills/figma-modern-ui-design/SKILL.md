# Figma Modern UI Design Skill

## Skill Overview
**Skill Name**: figma-modern-ui-design
**Category**: Design & UI/UX
**Purpose**: Create modern, responsive web application interfaces using Figma with best practices for layout, typography, color systems, and component design.

## When to Use This Skill
- Designing new pages or screens for the web application
- Creating component libraries and design systems
- Establishing visual design language and branding
- Designing responsive layouts for multiple viewports
- Creating reusable UI components (buttons, inputs, cards, etc.)
- Setting up typography scales and color palettes
- Designing with accessibility in mind

## Core Capabilities

### 1. Layout Design
- **Grid Systems**: 12-column responsive grids with consistent gutters
- **Spacing Systems**: 4px/8px baseline grid for vertical rhythm
- **Auto-Layout**: Flexible containers that adapt to content
- **Responsive Breakpoints**: Desktop (1440px), Tablet (768px), Mobile (375px)
- **Container Widths**: Max-width constraints for optimal readability

### 2. Typography System
- **Type Scale**: Modular scale for hierarchy (12px to 48px)
- **Font Families**:
  - Primary: Inter, SF Pro, or System UI for body text
  - Headings: Poppins, Montserrat, or custom brand fonts
- **Line Heights**: 1.5 for body, 1.2 for headings
- **Font Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Text Styles**: Reusable text styles for consistency

### 3. Color System
- **Primary Colors**: Brand colors for main actions and highlights
- **Secondary Colors**: Supporting colors for variety
- **Neutral Palette**: Grays for text, borders, backgrounds (50-900 shades)
- **Semantic Colors**:
  - Success: Green (#10B981)
  - Warning: Yellow (#F59E0B)
  - Error: Red (#EF4444)
  - Info: Blue (#3B82F6)
- **Dark Mode**: Inverted color palette for dark theme support

### 4. Component Design
- **Buttons**: Primary, secondary, tertiary, ghost, icon-only variants
- **Input Fields**: Text inputs, textareas, selects, checkboxes, radio buttons
- **Cards**: Content containers with consistent padding and elevation
- **Navigation**: Top nav, sidebar, breadcrumbs, tabs, pagination
- **Modals**: Dialog boxes, drawers, popovers, tooltips
- **Feedback**: Alerts, toasts, notifications, progress indicators

## Design Patterns

### Button System
```
Primary Button:
- Background: Primary color
- Text: White
- Padding: 12px 24px
- Border Radius: 8px
- Font: 500 weight, 14px
- States: Default, Hover (+brightness), Active (-brightness), Disabled (50% opacity)

Secondary Button:
- Background: Transparent
- Border: 1px solid primary
- Text: Primary color
- Same padding and radius as primary

Icon Button:
- Square: 40x40px
- Icon: 20x20px centered
- Border radius: 8px
```

### Input Field System
```
Text Input:
- Height: 44px (mobile-friendly)
- Padding: 12px 16px
- Border: 1px solid neutral-300
- Border Radius: 8px
- Focus State: 2px primary color border
- Error State: Red border + error message below
- Success State: Green border + checkmark icon
```

### Card Component
```
Card:
- Background: White (dark: neutral-800)
- Padding: 24px
- Border Radius: 12px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Hover: Lift effect with increased shadow
```

## Best Practices

### Visual Hierarchy
1. **Size**: Larger elements attract more attention
2. **Color**: Vibrant colors draw focus
3. **Position**: Top-left gets noticed first (F-pattern reading)
4. **Spacing**: Whitespace creates breathing room and groups related items
5. **Typography**: Bold weights and larger sizes create emphasis

### Consistency Rules
- Use design tokens for all colors, spacing, and typography
- Create master components for reusable elements
- Use variants for component states (hover, active, disabled)
- Apply consistent naming conventions: Component/Variant/State
- Document component usage in descriptions

### Accessibility Guidelines
- **Contrast Ratios**: 4.5:1 for normal text, 3:1 for large text
- **Touch Targets**: Minimum 44x44px for interactive elements
- **Focus Indicators**: Visible focus states for keyboard navigation
- **Text Sizing**: Minimum 16px for body text (mobile)
- **Color Independence**: Don't rely solely on color to convey information

## Workflow

### Step 1: Setup Design File
1. Create new Figma file: "Todo App Design System"
2. Create pages: "🎨 Design System", "📱 Mobile", "💻 Desktop", "🔧 Components"
3. Set up grid layout: 12 columns, 24px gutter
4. Create color styles for entire palette
5. Create text styles for typography scale

### Step 2: Design Tokens
```
Colors:
- primary/50-900 (9 shades)
- neutral/50-900 (9 shades)
- success, warning, error, info
- background, foreground, border

Spacing:
- 4, 8, 12, 16, 24, 32, 48, 64, 96px

Typography:
- Display: 48px/1.2/700
- H1: 36px/1.2/700
- H2: 30px/1.2/600
- H3: 24px/1.2/600
- Body: 16px/1.5/400
- Small: 14px/1.5/400
- Tiny: 12px/1.5/400
```

### Step 3: Build Components
1. Create button variants (primary, secondary, tertiary)
2. Design input field states (default, focus, error, disabled)
3. Build card components with consistent elevation
4. Design navigation patterns (sidebar, top nav)
5. Create modal and dialog components
6. Design feedback components (toast, alert)

### Step 4: Page Layouts
1. Design authentication pages (login, register)
2. Create dashboard layout with navigation
3. Design task management views (list, board, calendar)
4. Build profile page with editable sections
5. Design settings and preferences pages

## Examples

### Example 1: Dashboard Layout
```
Dashboard Page:
├── Sidebar Navigation (240px fixed width)
│   ├── Logo + App Name
│   ├── Navigation Links
│   │   ├── Dashboard (active state)
│   │   ├── Tasks
│   │   ├── Projects
│   │   └── Settings
│   └── User Profile Card
├── Main Content Area (flex-grow)
│   ├── Page Header
│   │   ├── Title: "Dashboard"
│   │   └── Action Button: "+ New Task"
│   ├── Stats Cards Row
│   │   ├── Total Tasks Card
│   │   ├── Completed Card
│   │   └── In Progress Card
│   └── Task List/Grid
│       └── Task Cards (with CRUD actions)
```

### Example 2: Task Card Component
```
Task Card:
├── Header Row
│   ├── Priority Badge (left)
│   └── Status Badge (right)
├── Task Title (H3)
├── Task Description (truncated to 2 lines)
├── Metadata Row
│   ├── Created Date
│   └── Due Date
└── Action Buttons Row
    ├── Edit Button
    ├── Complete/Uncomplete Toggle
    └── Delete Button (destructive style)
```

## Figma MCP Server Integration

### Creating Frames
```javascript
// Pseudo-code for MCP server commands
createFrame({
  name: "Dashboard Desktop",
  width: 1440,
  height: 900,
  backgroundColor: "#F9FAFB",
  layout: "auto-layout",
  direction: "horizontal"
});
```

### Applying Styles
```javascript
// Apply color styles
applyColorStyle({
  element: "background",
  style: "primary/500"
});

// Apply text styles
applyTextStyle({
  element: "heading",
  style: "H1"
});
```

## Design Checklist
- [ ] Grid system is set up correctly
- [ ] Color palette is complete and organized
- [ ] Typography scale is defined with text styles
- [ ] Components are created with variants
- [ ] Layouts are responsive across breakpoints
- [ ] Accessibility guidelines are followed
- [ ] Naming conventions are consistent
- [ ] Design is organized in clear page structure
- [ ] All interactive elements have hover/active states
- [ ] Components are documented with usage notes

## Tools & Resources
- **Figma Plugins**: Auto Layout, Color Palettes, Iconify
- **Design Inspiration**: Dribbble, Behance, Figma Community
- **Accessibility**: Stark (contrast checker), A11y (annotations)
- **Icons**: Lucide Icons, Heroicons, Feather Icons
- **Typography**: Google Fonts, Adobe Fonts

## Integration with Frontend
Designs created with this skill should map directly to:
- **Tailwind CSS**: Use Tailwind's spacing/color scale
- **shadcn/ui**: Match component patterns from shadcn
- **Next.js**: Design pages matching App Router structure
- **TypeScript**: Component props should align with type definitions

---

**Backend API**: `https://naimalcreativityai-sdd-todo-app.hf.space/`
**Design System**: Based on modern web design principles
**Target Framework**: Next.js 16+ with Tailwind CSS
**Version**: 1.0.0

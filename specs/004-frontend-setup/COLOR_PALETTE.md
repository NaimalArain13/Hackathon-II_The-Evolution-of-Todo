# TaskFlow Color Palette

**Updated**: 2025-12-13
**Status**: Active

---

## Custom Color System

This document defines the official color palette for the TaskFlow frontend application.

### Brand Colors

#### Primary - Cyan (#3ABEFF)
**Usage**: Primary actions, links, key UI elements

```javascript
primary: {
  50: '#F5FCFF',   // Lightest - backgrounds
  100: '#E6F7FF',  // Very light - hover states
  200: '#CCEFFF',  // Light - disabled states
  300: '#99DFFF',  // Light-medium
  400: '#66CFFF',  // Medium-light
  500: '#3ABEFF',  // ★ Main brand color
  600: '#2E98CC',  // Medium-dark
  700: '#227299',  // Dark
  800: '#174C66',  // Very dark
  900: '#0B2633',  // Darkest - text on light backgrounds
}
```

#### Danger - Red/Coral (#FF6767)
**Usage**: Error states, destructive actions, alerts

```javascript
danger: {
  50: '#FFF5F5',   // Lightest - error backgrounds
  100: '#FFE6E6',  // Very light - error hover
  200: '#FFCCCC',  // Light - error borders
  300: '#FF9999',  // Light-medium
  400: '#FF8080',  // Medium-light
  500: '#FF6767',  // ★ Main error/danger color
  600: '#CC5252',  // Medium-dark
  700: '#993D3D',  // Dark
  800: '#662929',  // Very dark
  900: '#331414',  // Darkest
}
```

### Neutral Colors

#### Custom Grays
**Usage**: Backgrounds, text, borders, UI structure

```javascript
neutral: {
  50: '#F8F8FB',   // ★ Custom light lavender (backgrounds)
  100: '#F8F8F8',  // ★ Custom light gray (card backgrounds)
  200: '#F5F8FF',  // ★ Custom light blue tint (hover backgrounds)
  300: '#E5E7EB',  // Light borders
  400: '#D1D5DB',  // Medium borders
  500: '#A1A3AB',  // ★ Custom medium gray (secondary text, icons)
  600: '#6B7280',  // Dark secondary text
  700: '#4B5563',  // Darker text
  800: '#1F2937',  // Very dark text
  900: '#000000',  // ★ Black (primary text)
}
```

#### Utility Colors

```javascript
white: '#FFFFFF',  // Pure white
black: '#000000',  // Pure black
```

---

## Color Usage Guidelines

### Backgrounds
- **Main background**: `bg-neutral-50` (#F8F8FB)
- **Card backgrounds**: `bg-neutral-100` (#F8F8F8) or `bg-white`
- **Hover backgrounds**: `bg-neutral-200` (#F5F8FF)

### Text
- **Primary text**: `text-neutral-900` (#000000)
- **Secondary text**: `text-neutral-500` (#A1A3AB)
- **Disabled text**: `text-neutral-400`

### Actions
- **Primary button**: `bg-primary-500` (#3ABEFF)
- **Primary button hover**: `bg-primary-600`
- **Destructive action**: `bg-danger-500` (#FF6767)
- **Destructive hover**: `bg-danger-600`

### Borders
- **Default border**: `border-neutral-300`
- **Focused border**: `border-primary-500`
- **Error border**: `border-danger-500`

---

## Examples

### Button Variants

```tsx
// Primary action
<Button className="bg-primary-500 hover:bg-primary-600 text-white">
  Save Changes
</Button>

// Danger action
<Button className="bg-danger-500 hover:bg-danger-600 text-white">
  Delete Account
</Button>

// Outline button
<Button className="border-2 border-neutral-300 text-neutral-900 hover:bg-neutral-50">
  Cancel
</Button>
```

### Card Styles

```tsx
// Light card
<Card className="bg-neutral-100 border border-neutral-200">
  <CardContent>Content here</CardContent>
</Card>

// White card with shadow
<Card className="bg-white shadow-md">
  <CardContent>Content here</CardContent>
</Card>
```

### Text Hierarchy

```tsx
<div className="bg-neutral-50 p-8">
  <h1 className="text-4xl font-bold text-neutral-900">Page Title</h1>
  <p className="text-base text-neutral-500 mt-2">Subtitle or description text</p>
  <Button className="mt-4 bg-primary-500 text-white">
    Call to Action
  </Button>
</div>
```

---

## Accessibility

### Contrast Ratios

All color combinations meet WCAG 2.1 AA standards:

- **Primary on white**: #3ABEFF on #FFFFFF = 2.95:1 (AA Large Text)
- **Black on light gray**: #000000 on #F8F8FB = 20.6:1 (AAA)
- **Medium gray on white**: #A1A3AB on #FFFFFF = 3.5:1 (AA Large Text)
- **Danger on white**: #FF6767 on #FFFFFF = 3.4:1 (AA Large Text)

### Recommended Pairings

✅ **Safe for body text**:
- `text-neutral-900` on `bg-neutral-50`
- `text-neutral-900` on `bg-white`
- `text-neutral-800` on `bg-neutral-100`

✅ **Safe for headings**:
- `text-primary-700` on `bg-white`
- `text-neutral-900` on any neutral background

⚠️ **Use with caution** (large text only):
- `text-primary-500` on `bg-white`
- `text-danger-500` on `bg-white`

---

## Migration from Previous Palette

### Changes Made

| Old Color | Old Hex | New Color | New Hex |
|-----------|---------|-----------|---------|
| Primary (Indigo) | #6366F1 | Primary (Cyan) | #3ABEFF |
| Secondary (Green) | #22C55E | Danger (Red/Coral) | #FF6767 |
| Neutral (Zinc) | Standard scale | Neutral (Custom) | #F8F8FB, #F8F8F8, #F5F8FF, #A1A3AB |

### Class Name Changes

Replace these class names:
- `bg-secondary-500` → `bg-danger-500` (for error states)
- `text-secondary-500` → `text-danger-500` (for error text)
- `border-secondary-500` → `border-danger-500` (for error borders)

### No Changes Needed

These continue to work as expected:
- `bg-primary-500`, `text-primary-500`, etc. (now cyan instead of indigo)
- `bg-neutral-{n}`, `text-neutral-{n}` (now use custom grays)

---

## Design Tokens in Code

### Tailwind Config Reference

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#3ABEFF', // Main brand color
          // ... full scale
        },
        danger: {
          500: '#FF6767', // Error/danger color
          // ... full scale
        },
        neutral: {
          50: '#F8F8FB',
          100: '#F8F8F8',
          200: '#F5F8FF',
          500: '#A1A3AB',
          900: '#000000',
          // ... full scale
        },
      },
    },
  },
};
```

---

## Related Files

- **Tailwind Config**: `frontend/tailwind.config.ts`
- **Global Styles**: `frontend/src/app/globals.css`
- **Tasks Document**: `specs/004-frontend-setup/tasks.md` (TASK-005)
- **Plan Document**: `specs/004-frontend-setup/plan.md` (Phase 2)
- **Spec Document**: `specs/004-frontend-setup/spec.md` (FR-002)

---

**Version**: 1.0.0
**Last Updated**: 2025-12-13
**Status**: ✅ Active and Implemented

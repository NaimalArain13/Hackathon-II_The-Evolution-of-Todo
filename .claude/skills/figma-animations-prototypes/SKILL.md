# Figma Animations & Prototypes Skill

## Skill Overview
**Skill Name**: figma-animations-prototypes
**Category**: Design & Interaction
**Purpose**: Create interactive prototypes with smooth animations, transitions, and micro-interactions that demonstrate realistic user flows and bring static designs to life.

## When to Use This Skill
- Building interactive prototypes for user testing
- Demonstrating user flows and navigation patterns
- Designing micro-interactions and animations
- Creating loading states and skeleton screens
- Prototyping complex interactions (drag-and-drop, swipe gestures)
- Showcasing state transitions and feedback animations
- Preparing designs for stakeholder presentations

## Core Capabilities

### 1. Transition Animations
- **Page Transitions**: Smooth navigation between screens
- **Modal Animations**: Slide-up, fade-in, scale entrance/exit
- **Navigation Transitions**: Sidebar expand/collapse, menu toggles
- **Tab Switching**: Smooth content swapping with fade/slide effects
- **Scroll Animations**: Parallax, fade-in on scroll, sticky elements

### 2. Micro-interactions
- **Button States**: Hover, active, loading, success animations
- **Input Interactions**: Focus highlights, validation feedback
- **Toggle Animations**: Checkbox checks, switch slides, radio selects
- **Dropdown Menus**: Smooth open/close with easing
- **Tooltip Appearances**: Fade-in with slight delay
- **Badge Animations**: Count updates, pulse effects for notifications

### 3. State Transitions
- **Task Status Changes**: Pending → In Progress → Completed
- **Loading States**: Skeleton screens, progress indicators, spinners
- **Success/Error States**: Checkmark animations, error shake effects
- **Empty States**: Illustrations with subtle animations
- **Data Updates**: Smooth transitions when content changes

### 4. Gesture-Based Interactions
- **Swipe Actions**: Swipe to delete, swipe to archive
- **Drag and Drop**: Reorder tasks, move between columns
- **Pull to Refresh**: Animated refresh indicator
- **Long Press**: Context menu appearance
- **Pinch to Zoom**: Image/content scaling

## Animation Principles

### Timing & Easing
```
Quick Interactions (100-200ms):
- Button hover states
- Input focus states
- Tooltip appearances
- Small UI element changes

Standard Transitions (200-400ms):
- Page transitions
- Modal open/close
- Dropdown menus
- Tab switching

Slow Animations (400-600ms):
- Complex state changes
- Data visualization updates
- Decorative animations
- Page load sequences
```

### Easing Functions
- **Ease-out**: Fast start, slow end (UI entering viewport)
- **Ease-in**: Slow start, fast end (UI exiting viewport)
- **Ease-in-out**: Smooth both ends (general transitions)
- **Spring**: Bouncy, natural feel (playful interactions)
- **Linear**: Constant speed (progress indicators, loading)

### Animation Best Practices
1. **Purpose**: Every animation should serve a purpose (feedback, guidance, delight)
2. **Performance**: Keep animations under 400ms for perceived responsiveness
3. **Consistency**: Use same timing/easing for similar interactions
4. **Subtlety**: Don't overanimate; less is often more
5. **Accessibility**: Respect prefers-reduced-motion settings

## Prototype Types

### 1. Click-Through Prototype
Basic navigation prototype for user flow demonstration:
- Click buttons to navigate between screens
- Show modal overlays on button clicks
- Demonstrate form submission flows
- Navigate through multi-step processes

### 2. Interactive Prototype
Advanced prototype with realistic interactions:
- Hover states on interactive elements
- Input field focus and typing states
- Drag and drop functionality
- Swipe gestures on mobile screens
- Animated feedback for user actions

### 3. Presentation Prototype
Polished prototype for stakeholder demos:
- Auto-play walkthrough of key features
- Timed transitions for storytelling
- Animated data visualizations
- Smooth page-to-page flow
- Professional loading sequences

## Key User Flows to Prototype

### 1. Authentication Flow
```
Flow: User Registration
├── Landing Page
│   └── Click "Sign Up" → Navigate to Register Page (slide-in)
├── Register Page
│   ├── Input Focus → Highlight border (200ms ease-out)
│   ├── Type in fields → Show validation checkmarks
│   ├── Click "Create Account" → Loading state (spinner)
│   └── Success → Navigate to Dashboard (fade transition)
```

### 2. Task Creation Flow
```
Flow: Create New Task
├── Dashboard
│   └── Click "+ New Task" → Modal slides up (300ms ease-out)
├── Create Task Modal
│   ├── Focus title input → Highlight + cursor
│   ├── Type task details → Character counter updates
│   ├── Select priority → Radio button animation
│   ├── Click "Save" → Loading state on button
│   └── Success → Modal slides down + toast appears (200ms)
├── Dashboard (Updated)
│   └── New task card appears with fade-in (300ms)
```

### 3. Task Completion Flow
```
Flow: Mark Task as Complete
├── Task Card
│   ├── Hover → Lift effect + shadow increase (150ms)
│   ├── Click checkbox → Checkmark animation (200ms)
│   ├── Task state changes → Strikethrough text (300ms ease-in-out)
│   └── Card moves to "Completed" section (400ms ease-out)
```

### 4. Task Deletion Flow
```
Flow: Delete Task
├── Task Card
│   └── Click delete icon → Confirmation modal appears (200ms)
├── Confirmation Modal
│   ├── Click "Cancel" → Modal fades out (200ms)
│   └── Click "Delete" → Loading state
├── Success
│   ├── Modal closes (200ms)
│   ├── Task card slides out (300ms)
│   └── Success toast appears (fade-in 200ms, auto-dismiss 3s)
```

## Animation Specifications

### Button Animations
```
Primary Button:
- Hover: Background lightens 10%, scale 1.02 (150ms ease-out)
- Active: Background darkens 10%, scale 0.98 (100ms ease-in)
- Loading: Spinner rotates, text fades to 50% opacity
- Success: Checkmark appears, background turns green (300ms)

Ghost Button:
- Hover: Background appears at 10% opacity (150ms)
- Active: Background at 20% opacity (100ms)
```

### Modal Animations
```
Modal Enter:
- Background overlay: Fade in (200ms ease-out)
- Modal container: Slide up from bottom + fade in (300ms ease-out)
- Scale: Start at 0.95, end at 1.0

Modal Exit:
- Modal container: Fade out + slide down slightly (200ms ease-in)
- Background overlay: Fade out (200ms ease-in)
```

### Loading States
```
Skeleton Screen:
- Shimmer effect: Linear gradient moves left to right (1500ms loop)
- Background: Neutral-200 base, lighter sweep

Spinner:
- Rotation: 360° continuous (800ms linear loop)
- Size: 24px default, 16px small, 32px large
- Color: Primary color with 70% opacity

Progress Bar:
- Fill: Width 0% to 100% (duration varies)
- Animation: Smooth ease-out
- Color: Primary gradient
```

### Toast Notifications
```
Toast Enter:
- Position: Slide in from right (300ms ease-out)
- Opacity: Fade in simultaneously (300ms)

Toast Auto-dismiss:
- Duration: 3000ms visible
- Exit: Slide out to right + fade (200ms ease-in)

Toast Progress Bar:
- Width: 100% to 0% over 3000ms (linear)
- Color: Matches toast type (success/error/info)
```

## Prototype Interactions

### Interactive Hotspots
```javascript
// Pseudo-configuration for Figma prototyping

Button Click:
- Trigger: On Click
- Action: Navigate to
- Destination: Target Frame
- Animation: Slide from Right
- Easing: Ease Out
- Duration: 300ms

Hover State:
- Trigger: While Hovering
- Action: Change to
- Destination: Hover Variant
- Animation: Smart Animate
- Duration: 150ms

Drag Interaction:
- Trigger: On Drag
- Action: Change to
- Constraints: Horizontal/Vertical
- Bounce: Spring (30% bounce)
```

### Smart Animate
Smart Animate automatically animates between frames with matching layer names:
- Use for smooth property changes (position, size, color, opacity)
- Works best for simple transitions between similar layouts
- Ideal for component state changes (button states, card expansions)

### Overlay Interactions
```
Modal Overlay:
- Position: Center
- Background: Darken (50% black)
- Close on outside click: Yes
- Close on ESC key: Yes (when available)

Dropdown Overlay:
- Position: Below trigger element
- Background: Transparent
- Close on outside click: Yes
```

## Figma Prototype Settings

### Preview Settings
```
Device: Custom Size (matching design frame)
Start Frame: Landing/Dashboard (entry point)
Flows: Multiple flows for different user journeys
Hotspot Hints: On (blue hotspot indicators)
```

### Presentation Mode
```
Background: Custom color (neutral-100)
Show Prototype Settings: Hidden
Device Frame: Optional (use for mobile prototypes)
```

## Advanced Techniques

### Lottie Animations
For complex animations:
1. Export animations from After Effects as Lottie JSON
2. Import into Figma using Lottie Files plugin
3. Use for loading spinners, success checkmarks, illustrations

### Auto-Layout Animations
Leverage auto-layout for dynamic animations:
- Components resize smoothly when content changes
- Items reflow automatically when added/removed
- Use for dynamic lists, expandable sections, responsive layouts

### Scroll Animations
Create scrolling prototypes:
- Vertical scroll: Set frame as scrollable
- Sticky elements: Position fixed while scrolling
- Scroll-triggered animations: Use multiple frames at scroll positions

## Mobile-Specific Gestures

### Swipe Gestures
```
Swipe Right (to go back):
- Trigger: Drag from left edge
- Action: Navigate to previous screen
- Animation: Slide from left (400ms ease-out)

Swipe Left/Right (carousel):
- Trigger: Drag horizontally
- Action: Change to next/previous frame
- Animation: Slide (300ms ease-out)
```

### Pull to Refresh
```
1. Scroll to top of list
2. Pull down beyond top edge
3. Release → Refresh indicator appears
4. Spinner rotates while loading
5. Content updates with fade-in
6. Indicator fades out
```

## Testing & Iteration

### Prototype Testing Checklist
- [ ] All interactive elements have hover states
- [ ] Navigation flows work correctly
- [ ] Animations are smooth and performant
- [ ] Loading states are demonstrated
- [ ] Error states are shown
- [ ] Mobile gestures work (if applicable)
- [ ] Transitions are consistent across similar actions
- [ ] Timing feels natural (not too fast or slow)
- [ ] Prototype works on target devices

### Performance Optimization
- Keep frame count reasonable (avoid hundreds of frames)
- Use instances of master components (not duplicates)
- Minimize complex shadows and effects
- Use simple animations for frequently-triggered interactions
- Test on actual devices, not just Figma preview

## Integration with Frontend

### Framer Motion Mapping
Designs should translate to Framer Motion code:
```typescript
// Button hover animation
<motion.button
  whileHover={{ scale: 1.02, brightness: 1.1 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15, ease: "easeOut" }}
>
  Click me
</motion.button>

// Modal entrance
<motion.div
  initial={{ opacity: 0, y: 20, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: 10 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  Modal content
</motion.div>
```

## Deliverables
- **Prototype Link**: Shareable Figma prototype URL
- **Animation Specs**: Document with timing, easing, and implementation notes
- **User Flow Diagrams**: Visual representation of prototype paths
- **Interaction Guide**: Instructions for developers on implementing animations

---

**Backend API**: `https://naimalcreativityai-sdd-todo-app.hf.space/`
**Animation Library**: Framer Motion (for implementation)
**Target Framework**: Next.js 16+ with React
**Version**: 1.0.0

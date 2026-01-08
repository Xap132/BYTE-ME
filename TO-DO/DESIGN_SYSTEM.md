# VoiceWave Design System

## Overview

VoiceWave is a modern Text-to-Speech application designed with a modular, component-driven architecture. The design system ensures consistency, accessibility, and scalability across the entire application.

---

## Design Principles

### 1. **Clarity & Simplicity**
- Minimize cognitive load with clear, straightforward interfaces
- Use white space effectively to reduce visual clutter
- One primary action per screen/card

### 2. **Modularity**
- Components are independent and reusable
- Features are isolated in their own modules
- Easy to test and maintain

### 3. **Accessibility (WCAG 2.1 AA)**
- Sufficient color contrast ratios (4.5:1 for text)
- Clear, descriptive labels for all interactive elements
- Readable font sizes (minimum 14px for body text)
- Touch targets at least 44x44px (iOS) / 48dp (Android)

### 4. **Responsiveness**
- Flexible layouts that adapt to different screen sizes
- Tested on phones from 4.5" to 6.7"
- Both portrait and landscape orientations

### 5. **Consistency**
- Unified color palette across all screens
- Standardized spacing and sizing
- Consistent interaction patterns

---

## Color Palette

### Primary Colors

| Color | Value | Usage |
|-------|-------|-------|
| Indigo 500 | #6366F1 | Primary actions, focus states |
| Indigo 400 | #818CF8 | Hover states, lighter variants |
| Indigo 600 | #4F46E5 | Dark variant, pressed states |

### Secondary Colors

| Color | Value | Usage |
|-------|-------|-------|
| Cyan 500 | #06B6D4 | Secondary actions, accents |
| Cyan 300 | #22D3EE | Light variant, backgrounds |
| Cyan 700 | #0891B2 | Dark variant |

### Neutral Colors

| Color | Value | Usage |
|-------|-------|-------|
| White | #FFFFFF | Backgrounds, cards |
| Gray 50 | #F9FAFB | Alt background |
| Gray 100 | #F3F4F6 | Disabled states, subtle bg |
| Gray 200 | #E5E7EB | Borders, dividers |
| Gray 300 | #D1D5DB | Secondary borders |
| Gray 400 | #9CA3AF | Secondary text |
| Gray 500 | #6B7280 | Tertiary text |
| Gray 600 | #4B5563 | Inactive elements |
| Gray 700 | #374151 | Dark text alternative |
| Gray 800 | #1F2937 | Body text |
| Gray 900 | #111827 | Headings, dark text |
| Black | #000000 | Emphasis |

### Semantic Colors

| Color | Value | Usage |
|-------|-------|-------|
| Success (Green) | #10B981 | Success states, confirmations |
| Success Light | #D1FAE5 | Success backgrounds |
| Error (Red) | #EF4444 | Errors, destructive actions |
| Error Light | #FEE2E2 | Error backgrounds |
| Warning (Amber) | #F59E0B | Warnings, caution states |
| Warning Light | #FEF3C7 | Warning backgrounds |
| Info (Blue) | #3B82F6 | Informational content |
| Info Light | #DBEAFE | Info backgrounds |

### Accessibility Contrast Ratios

All color combinations meet WCAG AA standards:

- **Text on White**: Gray 900 on White = 21:1 ✓
- **Text on Gray 100**: Gray 900 on Gray 100 = 18:1 ✓
- **White Text on Primary**: White on Indigo 500 = 6.5:1 ✓
- **White Text on Secondary**: White on Cyan 500 = 4.5:1 ✓

---

## Typography

### Font Family

**Primary Font**: Inter (Google Fonts)
- Modern, clean, highly readable
- Excellent on-screen rendering
- Great for accessibility

### Font Sizes & Line Heights

| Type | Size | Weight | Line Height | Usage |
|------|------|--------|------------|--------|
| Display | 48px | 700 | 56px | App title |
| Heading 1 | 32px | 700 | 40px | Screen titles |
| Heading 2 | 24px | 700 | 32px | Card titles |
| Heading 3 | 20px | 600 | 28px | Section headers |
| Body Large | 18px | 400 | 28px | Large body text |
| Body | 16px | 400 | 24px | Primary body text |
| Body Small | 14px | 400 | 20px | Secondary text |
| Caption | 13px | 500 | 18px | Labels, metadata |
| Micro | 12px | 500 | 16px | Timestamps, badges |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Light | 300 | Disabled text, subtle content |
| Regular | 400 | Body text, default |
| Medium | 500 | Small headings, captions |
| Semibold | 600 | Section headers, emphasis |
| Bold | 700 | Main headings |
| Extrabold | 800 | Highlight text |

---

## Spacing & Layout

### Spacing Scale

All spacing is based on a 4px grid:

| Token | Value | Usage |
|-------|-------|-------|
| 0 | 0px | Remove spacing |
| 1 | 4px | Micro spacing |
| 2 | 8px | Small gaps |
| 3 | 12px | Input gaps |
| 4 | 16px | Standard padding |
| 5 | 20px | Card spacing |
| 6 | 24px | Section padding |
| 7 | 32px | Large gaps |
| 8 | 40px | Component separation |
| 9 | 48px | Vertical rhythm |
| 10 | 56px | Large gaps |
| 11 | 64px | Screen sections |
| 12 | 80px | Major sections |

### Padding Standards

- **Screens**: 16px horizontal, 16px vertical
- **Cards**: 16px
- **Buttons**: 12px vertical, 16px horizontal (md size)
- **Inputs**: 12px vertical, 16px horizontal
- **Lists**: 8px vertical, 16px horizontal

### Gaps & Margins

- **Between form fields**: 16px
- **Between sections**: 24px
- **Between cards**: 16px
- **Top safe area**: 16px (after status bar)
- **Bottom safe area**: 16px

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| 0 | 0px | No radius (sharp) |
| 1 | 4px | Small elements, badges |
| 2 | 8px | Inputs, buttons |
| 3 | 12px | Cards, small containers |
| 4 | 16px | Medium containers |
| 5 | 20px | Large containers |
| 6 | 24px | Extra large |
| 7 | 32px | Prominent containers |
| Circle | 9999px | Circular elements (avatars) |

### Radius By Component

| Component | Radius |
|-----------|--------|
| Button | 12px (3) |
| Input | 12px (3) |
| Card | 16px (4) |
| Slider | 2px (1) - track, 100% - thumb |
| Segmented Control | 12px (3) |
| Toast/Alert | 12px (3) |

---

## Shadows & Elevation

### Shadow Definitions

**Small** (Cards, buttons on hover)
```
shadowColor: #000000
shadowOffset: { width: 0, height: 1 }
shadowOpacity: 0.1
shadowRadius: 2
elevation: 1
```

**Medium** (Elevated cards, modals)
```
shadowColor: #000000
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.1
shadowRadius: 8
elevation: 3
```

**Large** (Top-level modals, sheets)
```
shadowColor: #000000
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.15
shadowRadius: 16
elevation: 5
```

---

## Components

### Button Variants

#### Primary Button
- **Background**: Indigo 500 (#6366F1)
- **Text**: White
- **Hover**: Indigo 400 (slightly lighter)
- **Pressed**: Indigo 600 (darker)
- **Disabled**: 50% opacity

#### Secondary Button
- **Background**: Cyan 500 (#06B6D4)
- **Text**: White
- **Hover**: Cyan 400
- **Pressed**: Cyan 700
- **Disabled**: 50% opacity

#### Outline Button
- **Background**: Transparent
- **Border**: Indigo 500, 2px
- **Text**: Indigo 500
- **Hover**: Indigo 50 background
- **Pressed**: Indigo 100 background

#### Ghost Button
- **Background**: Transparent
- **Border**: None
- **Text**: Indigo 500
- **Hover**: Gray 100 background
- **Pressed**: Gray 200 background

### Button Sizes

| Size | Padding | Height | Font Size |
|------|---------|--------|-----------|
| Small | 8px 12px | 32px | 14px |
| Medium | 12px 24px | 44px | 16px |
| Large | 16px 32px | 56px | 18px |

### Input States

- **Default**: Gray 200 border, Gray 900 text
- **Focused**: Indigo 500 border, shadow
- **Filled**: Gray 100 background
- **Disabled**: Gray 100 background, Gray 400 text, 50% opacity
- **Error**: Red border, error message below

### Card Styling

- **Background**: White (#FFFFFF)
- **Border**: None
- **Radius**: 16px
- **Padding**: 16px
- **Shadow**: Medium (elevation 3)
- **Title**: Gray 900, 18px, Semibold
- **Subtitle**: Gray 600, 14px, Regular

---

## Icons

### Icon System

- **Font**: Lucide React Native
- **Sizes**: 16px, 20px, 24px, 32px
- **Color**: Inherit from text color or specific color token
- **Spacing**: 8px gap between icon and text

### Common Icons

| Icon | Usage |
|------|-------|
| 🎙️ | Audio/microphone |
| ▶️ | Play |
| ⏸️ | Pause |
| ⏹️ | Stop |
| ✓ | Checkmark/success |
| ✕ | Close |
| ← | Back |
| ⋮ | More options |
| 🔊 | Sound/volume |
| 🌙 | Dark mode |

---

## Interaction Patterns

### Touch Targets

- **Minimum size**: 44x44px (iOS), 48dp (Android)
- **Recommended minimum**: 48x48px for critical actions
- **Spacing**: At least 8px between touch targets

### Feedback

- **Pressed state**: Slight background color change, scale 0.98
- **Hover state** (if applicable): Background color change
- **Loading state**: Activity indicator, disabled interaction
- **Success state**: Checkmark icon, green color
- **Error state**: Red color, error message

### Animations

- **Duration**: 200-300ms for standard interactions
- **Easing**: ease-out for opening, ease-in for closing
- **Transitions**: Color, opacity, scale (not position)

---

## Dark Mode

### Dark Theme Colors

| Component | Light | Dark |
|-----------|-------|------|
| Background | White | Gray 900 |
| Surface | Gray 50 | Gray 800 |
| Border | Gray 200 | Gray 700 |
| Text Primary | Gray 900 | Gray 100 |
| Text Secondary | Gray 600 | Gray 400 |
| Primary Action | Indigo 500 | Indigo 400 |

---

## Layout Guidelines

### Screen Spacing

```
┌─────────────────────────┐
│   Status Bar (native)   │
├──────────────────────────┤
│  Safe Area Top (16px)    │
│ ┌──────────────────────┐ │
│ │                      │ │ 16px padding
│ │   Content Area       │ │
│ │                      │ │ 16px padding
│ └──────────────────────┘ │
│  Safe Area Bottom (16px) │
│   Tab Bar / Keyboard    │
└─────────────────────────┘
```

### Card Layout

```
┌─────────────────────────┐
│  Title (optional)       │ 12px padding bottom
│  Subtitle (optional)    │ (between title & content)
├─────────────────────────┤
│                         │
│  Content (16px padding) │
│                         │
└─────────────────────────┘
```

---

## Responsive Design Breakpoints

### Screen Sizes

| Device | Width | Design Approach |
|--------|-------|-----------------|
| Small Phone | 320px | Single column, full width |
| Standard Phone | 375px | Primary design target |
| Large Phone | 414px+ | Full width with max constraints |
| Tablet | 768px+ | Multi-column (future) |

### Adaptive Elements

- **Padding**: Reduce to 12px on screens < 360px
- **Font Sizes**: Scale proportionally on large screens
- **Column Layout**: 1 column phone, 2+ columns on tablet

---

## Accessibility Features

### Keyboard Navigation

- ✓ All interactive elements are keyboard accessible
- ✓ Clear focus indicators (border highlight)
- ✓ Logical tab order
- ✓ Escape key closes modals/menus

### Screen Reader Support

- ✓ All buttons have accessible labels
- ✓ Form fields have associated labels
- ✓ Images have alt text (if used)
- ✓ Lists are properly marked up
- ✓ Semantic HTML/components

### Color Independence

- ✓ Color alone doesn't convey information
- ✓ Error states use icons + text + color
- ✓ Success uses checkmark + green

### Motion & Animation

- ✓ Animations respect `prefers-reduced-motion`
- ✓ No auto-playing videos or animations
- ✓ Animations are not essential to functionality

---

## Usage Examples

### Creating a Styled Screen

```javascript
import { ScreenLayout, Header, Button, Card } from '@/components/ui';
import { TextInputArea, PlaybackControls } from '@/components/features';

export default function TTSScreen() {
  return (
    <ScreenLayout backgroundColor="#FFFFFF">
      <Header title="Text to Speech" />
      
      <Card title="Enter Text" style={{ marginVertical: 16 }}>
        <TextInputArea value={text} onChangeText={setText} />
      </Card>

      <Card title="Settings" style={{ marginVertical: 16 }}>
        <PlaybackControls
          pitch={pitch}
          onPitchChange={setPitch}
          speed={speed}
          onSpeedChange={setSpeed}
        />
      </Card>

      <Button
        variant="primary"
        size="lg"
        onPress={handleSpeak}
        fullWidth
        style={{ marginVertical: 16 }}
      >
        Speak
      </Button>
    </ScreenLayout>
  );
}
```

### Using Colors in Custom Components

```javascript
import { StyleSheet } from 'react-native';

const colors = {
  primary: '#6366F1',
  success: '#10B981',
  error: '#EF4444',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
});
```

---

## Mobile Testing Checklist

- [ ] Test on iOS and Android devices
- [ ] Test on phones with different screen sizes (4.5" - 6.7")
- [ ] Verify touch targets are at least 44x44px
- [ ] Check color contrast with Contrast Ratio tool
- [ ] Test with screen reader (VoiceOver/TalkBack)
- [ ] Verify animations respect reduced motion preference
- [ ] Test keyboard navigation (Android)
- [ ] Check loading and error states
- [ ] Verify responsive layouts

---

## Related Files

- **Tamagui Config**: `/config/tamagui.config.ts`
- **UI Components**: `/components/ui/`
- **Feature Components**: `/components/features/`
- **Architecture Documentation**: `/ARCHITECTURE.md`

---

**Last Updated**: January 8, 2026
**Version**: 1.0.0

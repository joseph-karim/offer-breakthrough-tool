# Tooltip Component Usage Guide

This guide explains how to use the new tooltip components in the application.

## Available Components

### 1. FloatingTooltip

A tooltip component for desktop use that automatically positions itself based on available space.

```tsx
import { FloatingTooltip } from '../../ui/FloatingTooltip';

<FloatingTooltip
  content="This is tooltip content"
  placement="top" // 'top', 'bottom', 'left', 'right'
  maxWidth={300}
>
  <button>Hover me</button>
</FloatingTooltip>
```

### 2. MobileFloatingTooltip

A modal-style tooltip for mobile devices that appears when clicked.

```tsx
import { MobileFloatingTooltip } from '../../ui/FloatingTooltip';

<MobileFloatingTooltip
  content="This is tooltip content"
  maxWidth={300}
>
  <button>Tap me</button>
</MobileFloatingTooltip>
```

### 3. ResponsiveFloatingTooltip

A responsive tooltip that switches between FloatingTooltip and MobileFloatingTooltip based on screen size.

```tsx
import { ResponsiveFloatingTooltip } from '../../ui/FloatingTooltip';

<ResponsiveFloatingTooltip
  content="This is tooltip content"
  placement="top" // 'top', 'bottom', 'left', 'right'
  maxWidth={300}
>
  <button>Hover/Tap me</button>
</ResponsiveFloatingTooltip>
```

## Props

### FloatingTooltip Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| content | React.ReactNode | - | Content to display in the tooltip |
| children | React.ReactNode | - | Element that triggers the tooltip |
| placement | 'top' \| 'bottom' \| 'left' \| 'right' | 'top' | Preferred placement of the tooltip |
| maxWidth | number | 350 | Maximum width of the tooltip in pixels |
| delay | number | 200 | Delay before showing tooltip (ms) |
| className | string | '' | Additional class for the trigger element |
| arrowClassName | string | '' | Additional class for the arrow element |
| contentClassName | string | '' | Additional class for the tooltip content |

### MobileFloatingTooltip Props

Same as FloatingTooltip but without the `placement` prop.

### ResponsiveFloatingTooltip Props

Same as FloatingTooltip with an additional prop:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| mobileBreakpoint | number | 768 | Screen width below which the mobile version is used |

## Examples

### Basic Usage with Help Icon (Properly Aligned)

```tsx
import { HelpCircle } from 'lucide-react';
import { FloatingTooltip } from '../../ui/FloatingTooltip';

<div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
  <label
    htmlFor="field-id"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      margin: 0
    }}
  >
    Field Label:
  </label>
  <FloatingTooltip
    content="This is helpful information about the field"
    placement="right"
  >
    <div style={{ cursor: 'help', display: 'flex', marginTop: '3px' }}>
      <HelpCircle size={16} style={{ color: '#6b7280' }} />
    </div>
  </FloatingTooltip>
</div>
```

### Alignment Tips

To ensure proper alignment of the question mark icon with text:

1. Use `alignItems: 'flex-start'` on the container div
2. Use `display: 'inline-flex'` and `alignItems: 'center'` on the label
3. Add a small `marginTop` to the question mark container (usually 2-3px)
4. Remove any default margins from the label with `margin: 0`

### Responsive Tooltip for Both Desktop and Mobile

```tsx
import { HelpCircle } from 'lucide-react';
import { ResponsiveFloatingTooltip } from '../../ui/FloatingTooltip';

<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <label htmlFor="field-id">Field Label:</label>
  <ResponsiveFloatingTooltip
    content="This is helpful information that works on both desktop and mobile"
    placement="right"
    maxWidth={300}
  >
    <div style={{ cursor: 'help' }}>
      <HelpCircle size={16} style={{ color: '#6b7280' }} />
    </div>
  </ResponsiveFloatingTooltip>
</div>
```

### Tooltip on Any Element

```tsx
import { FloatingTooltip } from '../../ui/FloatingTooltip';

<FloatingTooltip content="Click to submit the form">
  <button type="submit">Submit</button>
</FloatingTooltip>
```

## Styling

The tooltips use Tailwind CSS classes for styling. You can customize the appearance by passing additional classes:

```tsx
<FloatingTooltip
  content="Custom styled tooltip"
  contentClassName="bg-blue-800 text-white font-medium"
  arrowClassName="fill-blue-800"
>
  <button>Hover for custom tooltip</button>
</FloatingTooltip>
```

## Accessibility

The tooltips are built with accessibility in mind:
- They can be triggered by keyboard focus
- They use appropriate ARIA attributes
- They have proper keyboard navigation support

## Migrating from Old Tooltips

To migrate from the old tooltip implementation:

1. Import the appropriate tooltip component from `'../../ui/FloatingTooltip'`
2. Replace the old tooltip implementation with the new component
3. Move the tooltip content to the `content` prop
4. Wrap your trigger element (like the HelpCircle icon) in the tooltip component

Before:
```tsx
<div
  onMouseEnter={() => setIsTooltipVisible(true)}
  onMouseLeave={() => setIsTooltipVisible(false)}
  style={{ position: 'relative', cursor: 'help' }}
>
  <HelpCircle size={16} />
  {isTooltipVisible && (
    <div style={{ /* tooltip styles */ }}>
      Tooltip content
    </div>
  )}
</div>
```

After:
```tsx
<FloatingTooltip content="Tooltip content" placement="right">
  <div style={{ cursor: 'help' }}>
    <HelpCircle size={16} />
  </div>
</FloatingTooltip>
```

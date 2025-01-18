# Badge Component

The Badge component is used to highlight and display short status descriptors. It supports various styles, sizes, and can include icons or additional elements.

## Import

```tsx
import { Badge } from "@/components/ui/badge"
```

## API Reference

### Props
- `variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"` - Visual style variant
- `size?: "sm" | "default" | "lg"` - Size variant
- `className?: string` - Additional CSS classes
- All HTML div props are supported

## Styling

### Base Styles
```css
.badge {
  display: inline-flex;
  align-items: center;
  border-radius: var(--badge-radius);
  padding: var(--badge-padding-y) var(--badge-padding-x);
  font-size: var(--badge-font-size);
  font-weight: var(--badge-font-weight);
  transition: var(--badge-transition);
}
```

## States

### Variants
```tsx
// Default
<Badge>Default</Badge>

// Secondary
<Badge variant="secondary">Secondary</Badge>

// Destructive
<Badge variant="destructive">Destructive</Badge>

// Outline
<Badge variant="outline">Outline</Badge>

// Success
<Badge variant="success">Success</Badge>

// Warning
<Badge variant="warning">Warning</Badge>
```

## Examples

### Basic Badge
```tsx
<Badge>New Feature</Badge>
```

### With Icon
```tsx
<Badge className="badge-with-icon">
  <CheckIcon className="badge-icon" />
  Verified
</Badge>
```

### With Status Dot
```tsx
<Badge className="badge-with-dot">
  <span className="badge-dot" />
  Online
</Badge>
```

### Removable Badge
```tsx
function RemovableBadge() {
  const [visible, setVisible] = React.useState(true)

  if (!visible) return null

  return (
    <Badge className="badge-removable">
      Removable
      <button 
        className="badge-remove-button"
        onClick={() => setVisible(false)}
      >
        <XIcon className="badge-remove-icon" />
      </button>
    </Badge>
  )
}
```

## Accessibility

### ARIA Support
```tsx
<Badge role="status">New</Badge>

<Badge role="status" aria-label="3 unread messages">
  3
</Badge>
```

### Keyboard Navigation
When badges are interactive (e.g., removable):
- `Tab`: Focus the badge's interactive elements
- `Enter/Space`: Trigger the focused action
- `Escape`: Dismiss removable badge

## Design Tokens
```css
:root {
  /* Badge dimensions */
  --badge-radius: var(--radius-full);
  --badge-padding-x: 0.625rem;
  --badge-padding-y: 0.125rem;
  
  /* Badge sizes */
  --badge-padding-x-sm: 0.375rem;
  --badge-padding-y-sm: 0.0625rem;
  --badge-padding-x-lg: 0.75rem;
  --badge-padding-y-lg: 0.25rem;
  
  /* Badge typography */
  --badge-font-size: var(--font-size-xs);
  --badge-font-size-sm: 0.6875rem;
  --badge-font-size-lg: var(--font-size-sm);
  --badge-font-weight: var(--font-weight-semibold);
}
```

## Troubleshooting

### Common Issues

1. **Badge wrapping**
```tsx
// Solution: Use whitespace-nowrap
<Badge className="whitespace-nowrap">
  Long text content
</Badge>
```

2. **Icon alignment**
```tsx
// Solution: Use proper icon classes
<Badge>
  <Icon className="badge-icon shrink-0" />
  Text
</Badge>
```

3. **Custom colors**
```tsx
// Solution: Use style prop for custom colors
<Badge style={{ 
  backgroundColor: 'var(--custom-color)',
  color: 'var(--custom-text-color)' 
}}>
  Custom
</Badge>
```

## Best Practices

1. **Content**
   - Keep text concise
   - Use clear labels
   - Maintain consistent terminology

2. **Visual Design**
   - Use appropriate variants
   - Maintain color contrast
   - Consider size hierarchy

3. **Interaction**
   - Make interactive elements obvious
   - Provide feedback for actions
   - Handle touch targets properly

4. **Accessibility**
   - Include proper ARIA roles
   - Maintain color contrast
   - Support keyboard interaction

## Variants

### Size Variants
```tsx
<div className="flex gap-2 items-center">
  <Badge size="sm">Small</Badge>
  <Badge size="default">Default</Badge>
  <Badge size="lg">Large</Badge>
</div>
```

### Status Indicators
```tsx
<div className="space-x-2">
  <Badge variant="success" className="badge-with-dot">
    <span className="badge-dot" />
    Active
  </Badge>
  <Badge variant="warning" className="badge-with-dot">
    <span className="badge-dot" />
    Pending
  </Badge>
  <Badge variant="destructive" className="badge-with-dot">
    <span className="badge-dot" />
    Offline
  </Badge>
</div>
```

### With Counter
```tsx
<Badge variant="secondary">
  Messages
  <span className="ml-1 bg-primary text-primary-foreground rounded-full px-1">
    4
  </span>
</Badge>
```

### Interactive Group
```tsx
<div className="badge-group">
  {tags.map((tag) => (
    <Badge 
      key={tag}
      variant="outline"
      className="badge-removable"
    >
      {tag}
      <button
        onClick={() => removeTag(tag)}
        className="badge-remove-button"
      >
        <XIcon className="badge-remove-icon" />
      </button>
    </Badge>
  ))}
</div>
```

# Separator Component

The Separator component provides a visual divider between content. Built on Radix UI's Separator primitive, it supports horizontal and vertical orientations, various styles, and maintains proper accessibility.

## Import

```tsx
import { Separator } from "@/components/ui/separator"
```

## API Reference

### Props
- `orientation?: "horizontal" | "vertical"` - Direction of the separator
- `variant?: "default" | "muted" | "accent"` - Visual style variant
- `decorative?: boolean` - Whether the separator is purely visual
- `className?: string` - Additional CSS classes
- All HTML div props are supported

## Styling

### Base Styles
```css
.separator {
  flex-shrink: 0;
  background-color: var(--separator-color);
  height: var(--separator-thickness);
  width: 100%;
  transition: var(--separator-transition);
}
```

## Examples

### Basic Separator
```tsx
<div className="space-y-4">
  <h4>Section 1</h4>
  <Separator />
  <h4>Section 2</h4>
</div>
```

### With Different Variants
```tsx
<div className="space-y-4">
  <Separator variant="default" />
  <Separator variant="muted" />
  <Separator variant="accent" />
</div>
```

### With Text
```tsx
<div className="separator-with-text">
  <Separator />
  <span className="separator-text">OR</span>
  <Separator />
</div>
```

## Accessibility

### ARIA Support
```tsx
<Separator
  decorative={false}
  role="separator"
  aria-orientation="horizontal"
/>
```

### Non-decorative Usage
```tsx
<div role="group">
  <h2>Group 1</h2>
  <Separator decorative={false} />
  <h2>Group 2</h2>
</div>
```

## Design Tokens
```css
:root {
  /* Separator dimensions */
  --separator-thickness: 1px;
  
  /* Separator colors */
  --separator-color: var(--color-border);
  --separator-color-muted: var(--color-border-light);
  --separator-color-accent: var(--color-primary);
  
  /* Separator spacing */
  --separator-spacing: var(--space-4);
}
```

## Troubleshooting

### Common Issues

1. **Vertical height not working**
```tsx
// Solution: Set explicit height
<Separator 
  orientation="vertical" 
  className="h-6"
/>
```

2. **Alignment issues**
```tsx
// Solution: Use proper flex container
<div className="flex items-center">
  <span>Left</span>
  <Separator orientation="vertical" className="mx-2 h-4" />
  <span>Right</span>
</div>
```

3. **Spacing inconsistencies**
```tsx
// Solution: Use consistent spacing
<div className="space-y-[var(--separator-spacing)]">
  <div>Content</div>
  <Separator />
  <div>Content</div>
</div>
```

## Best Practices

1. **Usage**
   - Use for content grouping
   - Maintain consistent spacing
   - Consider visual hierarchy

2. **Accessibility**
   - Use decorative when appropriate
   - Include ARIA attributes
   - Consider color contrast

3. **Layout**
   - Align properly
   - Use consistent spacing
   - Consider responsive design

4. **Performance**
   - Use semantic HTML
   - Avoid unnecessary nesting
   - Keep styles minimal

## Variants

### Styled Separators
```tsx
// Dashed separator
<Separator className="separator-dashed" />

// Dotted separator
<Separator className="separator-dotted" />

// Gradient separator
<Separator className="separator-gradient" />
```

### With Custom Spacing
```tsx
<div className="space-y-2">
  <div>Content</div>
  <Separator className="separator-sm" />
  <div>Content</div>
  <Separator className="separator-lg" />
  <div>Content</div>
</div>
```

### With Animation
```tsx
<Separator className="separator-animate" />
```

### List Separator
```tsx
<div className="space-y-2">
  {items.map((item, index) => (
    <React.Fragment key={item.id}>
      {index > 0 && <Separator variant="muted" />}
      <div>{item.content}</div>
    </React.Fragment>
  ))}
</div>
```

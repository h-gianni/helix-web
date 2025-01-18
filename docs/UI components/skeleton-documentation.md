# Skeleton Component

The Skeleton component provides a placeholder preview of content before the data gets loaded, reducing load-time frustration. It supports various sizes and animations to match your content's layout.

## Import

```tsx
import { Skeleton } from "@/components/ui/skeleton"
```

## API Reference

### Props
- `variant?: "default" | "shimmer"` - Visual style variant
- `size?: "xs" | "sm" | "md" | "lg" | "xl"` - Size variant
- `className?: string` - Additional CSS classes
- All HTML div props are supported

## Styling

### Base Styles
```css
.skeleton {
  animation: pulse var(--skeleton-animation-duration) infinite;
  background-color: var(--skeleton-background);
  border-radius: var(--skeleton-radius);
}

.skeleton-shimmer {
  position: relative;
  overflow: hidden;
}
```

## Examples

### Basic Skeleton
```tsx
<Skeleton className="w-[200px] h-[20px]" />
```

### With Different Sizes
```tsx
<div className="space-y-2">
  <Skeleton size="sm" className="w-[100px]" />
  <Skeleton size="md" className="w-[200px]" />
  <Skeleton size="lg" className="w-[300px]" />
</div>
```

### Card Loading State
```tsx
<div className="skeleton-card">
  <Skeleton className="skeleton-avatar w-12 h-12" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
</div>
```

## Design Tokens
```css
:root {
  /* Skeleton dimensions */
  --skeleton-radius: var(--radius-md);
  --skeleton-size-xs: 0.75rem;
  --skeleton-size-sm: 1rem;
  --skeleton-size-md: 1.25rem;
  --skeleton-size-lg: 1.5rem;
  --skeleton-size-xl: 2rem;
  
  /* Skeleton colors */
  --skeleton-background: var(--color-surface-hover);
  --skeleton-shimmer: color-mix(in srgb, var(--color-surface) 80%, transparent);
  
  /* Skeleton animation */
  --skeleton-animation-duration: 2s;
}
```

## Troubleshooting

### Common Issues

1. **Animation not working**
```tsx
// Solution: Ensure animation classes are applied
<Skeleton className="animate-pulse" />
```

2. **Width not setting**
```tsx
// Solution: Add explicit width
<Skeleton className="w-full" />
```

3. **Border radius issues**
```tsx
// Solution: Use skeleton variant classes
<Skeleton className="skeleton-avatar" />
```

## Best Practices

1. **Content Matching**
   - Match real content dimensions
   - Use appropriate spacing
   - Maintain visual hierarchy

2. **Animation Usage**
   - Keep animations subtle
   - Use consistent timing
   - Consider reduced motion

3. **Performance**
   - Minimize number of elements
   - Use efficient animations
   - Clean up when content loads

4. **Accessibility**
   - Include aria-busy state
   - Consider loading messages
   - Maintain layout stability

## Variants

### Shimmer Effect
```tsx
<Skeleton 
  variant="shimmer" 
  className="w-[200px] h-[20px]" 
/>
```

### Text Block
```tsx
<div className="space-y-2">
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-[200px]" />
  <Skeleton className="h-4 w-[180px]" />
</div>
```

### Table Loading
```tsx
<div className="skeleton-table">
  {Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="skeleton-table-row">
      <Skeleton className="h-8" />
      <Skeleton className="h-8" />
      <Skeleton className="h-8" />
    </div>
  ))}
</div>
```

### Profile Card
```tsx
<div className="skeleton-card">
  <div className="flex items-center gap-4">
    <Skeleton className="skeleton-avatar h-12 w-12" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[150px]" />
      <Skeleton className="h-4 w-[100px]" />
    </div>
  </div>
  <Skeleton className="h-32 w-full" />
</div>
```

### List Loading
```tsx
<div className="space-y-4">
  {Array.from({ length: 3 }).map((_, i) => (
    <div key={i} className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
  ))}
</div>
```

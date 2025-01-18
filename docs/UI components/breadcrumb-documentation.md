# Breadcrumb Component

The Breadcrumb component provides navigation that shows the user's location in a site or app hierarchy. Built with accessibility in mind, it supports custom separators, truncation, and responsive behavior.

## Import

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb"
```

## API Reference

### Props

#### Breadcrumb
- `separator?: React.ReactNode` - Custom separator element
- `className?: string` - Additional CSS classes
- All HTML nav props are supported

#### BreadcrumbLink
- `asChild?: boolean` - Merge props onto child element
- `href: string` - Link destination
- All HTML anchor props are supported

#### BreadcrumbItem/BreadcrumbPage
- `className?: string` - Additional CSS classes
- All HTML li/span props are supported

## Styling

### Base Styles
```css
.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: var(--breadcrumb-item-gap);
  font-size: var(--breadcrumb-font-size);
  color: var(--breadcrumb-text-color);
}

.breadcrumb-link {
  color: var(--breadcrumb-link-color);
  transition: var(--breadcrumb-transition);
}
```

## Examples

### Basic Breadcrumb
```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Settings</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### With Icons
```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">
        <HomeIcon className="h-4 w-4 mr-2" />
        Home
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/docs">
        <FileIcon className="h-4 w-4 mr-2" />
        Documentation
      </BreadcrumbLink>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### With Truncation
```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbEllipsis />
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Accessibility

### Keyboard Navigation
- `Tab`: Move through interactive elements
- `Enter/Space`: Activate link
- `Esc`: Clear focus

### ARIA Support
```tsx
<Breadcrumb aria-label="Breadcrumb navigation">
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink 
        href="/"
        aria-label="Navigate to home page"
      >
        Home
      </BreadcrumbLink>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Design Tokens
```css
:root {
  /* Breadcrumb typography */
  --breadcrumb-font-size: var(--font-size-sm);
  --breadcrumb-text-color: var(--color-text-secondary);
  
  /* Breadcrumb spacing */
  --breadcrumb-item-gap: 0.625rem;
  --breadcrumb-separator-gap: 0.375rem;
  
  /* Breadcrumb colors */
  --breadcrumb-link-color: var(--color-text-secondary);
  --breadcrumb-link-hover-color: var(--color-text-primary);
  --breadcrumb-separator-color: var(--color-text-tertiary);
}
```

## Troubleshooting

### Common Issues

1. **Separator alignment**
```tsx
// Solution: Use flex alignment
<BreadcrumbSeparator className="self-center" />
```

2. **Responsive issues**
```tsx
// Solution: Use responsive classes
<Breadcrumb className="hidden sm:flex">
  {/* Content */}
</Breadcrumb>
```

3. **Icon alignment**
```tsx
// Solution: Use flex utilities
<BreadcrumbLink className="inline-flex items-center">
  <Icon className="mr-2" />
  Text
</BreadcrumbLink>
```

## Best Practices

1. **Structure**
   - Keep hierarchy shallow
   - Use clear labels
   - Show current location

2. **Navigation**
   - Make links obvious
   - Support keyboard navigation
   - Handle responsive states

3. **Accessibility**
   - Include ARIA labels
   - Maintain focus states
   - Provide context

4. **Performance**
   - Minimize DOM elements
   - Handle truncation
   - Consider mobile views

## Variants

### Custom Separator
```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator>
      <SlashIcon className="h-4 w-4" />
    </BreadcrumbSeparator>
    <BreadcrumbItem>
      <BreadcrumbPage>Current</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### With Background
```tsx
<Breadcrumb className="breadcrumb-surface">
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### With Border
```tsx
<Breadcrumb className="breadcrumb-bordered">
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

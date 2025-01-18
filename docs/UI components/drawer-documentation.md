# Drawer Component

The Drawer component provides a panel that slides in from the bottom of the screen. Built on Vaul's Drawer primitive, it's ideal for mobile-first interfaces and supports nested scrolling, touch interactions, and custom animations.

## Import

```tsx
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
```

## API Reference

### Props

#### Drawer
- `shouldScaleBackground?: boolean` - Scale the background when drawer is open
- `onOpenChange?: (open: boolean) => void` - Handler called when open state changes
- All Vaul DrawerPrimitive.Root props are supported

#### DrawerContent
- `className?: string` - Additional CSS classes
- `children: React.ReactNode` - Drawer content
- All Vaul DrawerPrimitive.Content props are supported

## Styling

### Base Styles
```css
.drawer-content {
  position: fixed;
  inset-x: 0;
  bottom: 0;
  z-index: var(--z-drawer);
  border-radius: var(--drawer-radius) var(--drawer-radius) 0 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.drawer-overlay {
  position: fixed;
  inset: 0;
  background: var(--drawer-overlay);
  backdrop-filter: blur(var(--drawer-overlay-blur));
}
```

## Examples

### Basic Drawer
```tsx
<Drawer>
  <DrawerTrigger>Open</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Title</DrawerTitle>
      <DrawerDescription>Description</DrawerDescription>
    </DrawerHeader>
    <div className="p-4">Content</div>
    <DrawerFooter>
      <Button>Action</Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

### With Form
```tsx
<Drawer>
  <DrawerTrigger asChild>
    <Button>Edit Profile</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Edit Profile</DrawerTitle>
    </DrawerHeader>
    <form className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" />
      </div>
      <DrawerFooter>
        <Button type="submit">Save Changes</Button>
      </DrawerFooter>
    </form>
  </DrawerContent>
</Drawer>
```

### With Scrolling Content
```tsx
<Drawer>
  <DrawerContent className="drawer-content-scroll">
    <DrawerHeader>
      <DrawerTitle>Long Content</DrawerTitle>
    </DrawerHeader>
    <div className="p-4">
      {/* Long scrollable content */}
    </div>
  </DrawerContent>
</Drawer>
```

## Accessibility

### Keyboard Navigation
- `Escape`: Close the drawer
- `Tab`: Move focus between interactive elements
- `Shift + Tab`: Move focus in reverse
- `Space/Enter`: Trigger focused action

### ARIA Support
```tsx
<Drawer>
  <DrawerTrigger aria-label="Open settings">
    Open
  </DrawerTrigger>
  <DrawerContent
    role="dialog"
    aria-labelledby="drawer-title"
    aria-describedby="drawer-description"
  >
    <DrawerTitle id="drawer-title">Settings</DrawerTitle>
    <DrawerDescription id="drawer-description">
      Adjust your preferences
    </DrawerDescription>
  </DrawerContent>
</Drawer>
```

## Design Tokens
```css
:root {
  /* Drawer dimensions */
  --drawer-radius: var(--radius-lg);
  --drawer-content-offset: 6rem;
  --drawer-padding: var(--space-4);
  
  /* Drawer handle */
  --drawer-handle-width: 6.25rem;
  --drawer-handle-height: 0.5rem;
  --drawer-handle-color: var(--color-surface-hover);
  
  /* Drawer overlay */
  --drawer-overlay: hsl(var(--color-neutral-900) / 0.8);
  --drawer-overlay-blur: 4px;
  
  /* Drawer effects */
  --drawer-shadow: var(--shadow-lg);
}
```

## Troubleshooting

### Common Issues

1. **Content not scrolling**
```tsx
// Solution: Add scroll class
<DrawerContent className="drawer-content-scroll">
  {/* Scrollable content */}
</DrawerContent>
```

2. **Background scaling**
```tsx
// Solution: Disable background scaling
<Drawer shouldScaleBackground={false}>
  {/* Content */}
</Drawer>
```

3. **Touch interactions**
```tsx
// Solution: Use proper height constraints
<DrawerContent className="drawer-md">
  {/* Content */}
</DrawerContent>
```

## Best Practices

1. **Content Organization**
   - Keep content focused
   - Use clear headers
   - Provide action buttons

2. **Interaction Design**
   - Support touch gestures
   - Handle background clicks
   - Manage scroll behavior

3. **Accessibility**
   - Include ARIA labels
   - Maintain focus management
   - Support keyboard navigation

4. **Performance**
   - Optimize animations
   - Handle content height
   - Manage nested scrolling

## Variants

### Size Variants
```tsx
// Small drawer
<DrawerContent className="drawer-sm">
  {/* Content */}
</DrawerContent>

// Full height drawer
<DrawerContent className="drawer-full">
  {/* Content */}
</DrawerContent>
```

### Without Handle
```tsx
<DrawerContent className="drawer-no-handle">
  <DrawerHeader>
    <DrawerTitle>Clean Look</DrawerTitle>
  </DrawerHeader>
</DrawerContent>
```

### Custom Animation
```tsx
<Drawer>
  <DrawerContent
    className="animate-in slide-in-from-bottom"
    style={{ '--animate-duration': '0.3s' } as React.CSSProperties}
  >
    {/* Content */}
  </DrawerContent>
</Drawer>
```

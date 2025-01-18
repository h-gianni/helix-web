# Avatar Component

The Avatar component displays a user's profile picture, initials, or fallback icon. Built on Radix UI's Avatar primitive, it provides a reliable way to show user images with graceful fallbacks.

## Import

```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
```

## API Reference

### Props

#### Avatar
- `size?: "sm" | "md" | "lg" | "xl"` - Size variant
- `className?: string` - Additional CSS classes
- All HTML div props are supported

#### AvatarImage
- `src: string` - Image source URL
- `alt: string` - Alt text for the image
- All HTML img props are supported

#### AvatarFallback
- `delayMs?: number` - Delay before showing fallback
- All HTML div props are supported

## Styling

### Base Styles
```css
.avatar {
  position: relative;
  display: flex;
  border-radius: var(--avatar-radius);
  overflow: hidden;
  width: var(--avatar-size-md);
  height: var(--avatar-size-md);
}

.avatar-fallback {
  background-color: var(--avatar-fallback-background);
  color: var(--avatar-fallback-color);
  font-size: var(--avatar-fallback-font-size);
}
```

## Examples

### Basic Avatar
```tsx
<Avatar>
  <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### With Different Sizes
```tsx
<div className="flex gap-4 items-center">
  <Avatar size="sm">
    <AvatarFallback>S</AvatarFallback>
  </Avatar>
  <Avatar size="md">
    <AvatarFallback>M</AvatarFallback>
  </Avatar>
  <Avatar size="lg">
    <AvatarFallback>L</AvatarFallback>
  </Avatar>
  <Avatar size="xl">
    <AvatarFallback>XL</AvatarFallback>
  </Avatar>
</div>
```

### With Status Indicator
```tsx
<div className="avatar-with-status">
  <Avatar>
    <AvatarImage src="/user.jpg" alt="User status" />
    <AvatarFallback>JD</AvatarFallback>
  </Avatar>
  <span className="avatar-status avatar-status-online" />
</div>
```

## Accessibility

### ARIA Labels
```tsx
<Avatar>
  <AvatarImage 
    src="/user.jpg" 
    alt="John Doe's profile picture" 
  />
  <AvatarFallback aria-label="John Doe">
    JD
  </AvatarFallback>
</Avatar>
```

### Image Loading
The component handles image loading states and provides a fallback when:
- The image fails to load
- The image source is not provided
- While the image is loading (after delayMs)

## Design Tokens
```css
:root {
  /* Avatar sizes */
  --avatar-size-sm: 1.75rem;
  --avatar-size-md: 2.5rem;
  --avatar-size-lg: 3.5rem;
  --avatar-size-xl: 5rem;
  
  /* Avatar appearance */
  --avatar-radius: var(--radius-full);
  --avatar-ring: 2px transparent;
  
  /* Avatar fallback */
  --avatar-fallback-background: var(--color-surface-hover);
  --avatar-fallback-color: var(--color-text-secondary);
}
```

## Troubleshooting

### Common Issues

1. **Image not loading**
```tsx
// Solution: Provide fallback
<Avatar>
  <AvatarImage src="broken-link.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

2. **Size inconsistencies**
```tsx
// Solution: Use size prop
<Avatar size="lg">
  <AvatarImage src="large-image.jpg" />
</Avatar>
```

3. **Border radius issues**
```tsx
// Solution: Use avatar-radius token
<Avatar className="rounded-[var(--avatar-radius)]">
  <AvatarImage src="image.jpg" />
</Avatar>
```

## Best Practices

1. **Image Handling**
   - Provide meaningful alt text
   - Use appropriate image sizes
   - Include fallback content

2. **Accessibility**
   - Use descriptive ARIA labels
   - Maintain color contrast
   - Consider loading states

3. **Performance**
   - Optimize image sizes
   - Use proper image formats
   - Implement lazy loading

4. **Responsiveness**
   - Use appropriate sizes
   - Handle image aspect ratios
   - Consider mobile views

## Variants

### Avatar Group
```tsx
<div className="avatar-group">
  <Avatar className="ring-2 ring-background">
    <AvatarImage src="user1.jpg" alt="User 1" />
  </Avatar>
  <Avatar className="ring-2 ring-background">
    <AvatarImage src="user2.jpg" alt="User 2" />
  </Avatar>
  <Avatar className="ring-2 ring-background">
    <AvatarFallback>+2</AvatarFallback>
  </Avatar>
</div>
```

### With Border
```tsx
<Avatar className="ring-2 ring-primary">
  <AvatarImage src="user.jpg" alt="User with border" />
  <AvatarFallback>AB</AvatarFallback>
</Avatar>
```

### Interactive Avatar
```tsx
<Avatar className="avatar-interactive">
  <AvatarImage src="user.jpg" alt="Interactive user" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### With Badge
```tsx
<div className="avatar-with-badge">
  <Avatar>
    <AvatarImage src="user.jpg" alt="User with badge" />
    <AvatarFallback>JD</AvatarFallback>
  </Avatar>
  <span className="avatar-badge">
    <Badge>New</Badge>
  </span>
</div>
```

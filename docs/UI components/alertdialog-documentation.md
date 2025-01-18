# AlertDialog Component

The AlertDialog component is a modal dialog that interrupts the user with important content and expects a response. Built on Radix UI's AlertDialog primitive, it follows WAI-ARIA guidelines for modal dialogs.

## Import

```tsx
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
```

## API Reference

### Props

#### AlertDialog
- `open?: boolean` - Controlled open state
- `onOpenChange?: (open: boolean) => void` - Open state change handler
- `defaultOpen?: boolean` - Initial open state

#### AlertDialogContent
- `className?: string` - Additional CSS classes
- `forceMount?: true` - Force mounting when needed
- All HTML div props are supported

#### AlertDialogTitle/Description
- `className?: string` - Additional CSS classes
- All HTML heading/paragraph props are supported

## Styling

### Base Styles
```css
.alert-dialog-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: var(--alert-dialog-width);
  background-color: var(--alert-dialog-surface);
  border-radius: var(--radius-lg);
  padding: var(--alert-dialog-padding);
}

.alert-dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: var(--alert-dialog-overlay);
  backdrop-filter: blur(var(--overlay-blur));
}
```

## Examples

### Basic AlertDialog
```tsx
<AlertDialog>
  <AlertDialogTrigger>Open</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### With Custom Actions
```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Account</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Account</AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete your account and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction className="bg-destructive text-destructive-foreground">
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Animations

### Opening Animation
```css
@keyframes alert-dialog-content-in {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.alert-dialog-content-enter {
  animation: alert-dialog-content-in var(--alert-dialog-enter-duration) var(--ease-out);
}
```

## Accessibility

### Keyboard Navigation
- `Escape`: Close the dialog
- `Tab`: Move focus between interactive elements
- `Space/Enter`: Trigger focused action
- `Return/Enter`: Confirm default action

### ARIA Support
```tsx
<AlertDialog>
  <AlertDialogTrigger aria-label="Open dialog">
    Open
  </AlertDialogTrigger>
  <AlertDialogContent role="alertdialog" aria-labelledby="title" aria-describedby="desc">
    <AlertDialogTitle id="title">Confirm Action</AlertDialogTitle>
    <AlertDialogDescription id="desc">
      Important information here.
    </AlertDialogDescription>
  </AlertDialogContent>
</AlertDialog>
```

## Design Tokens
```css
:root {
  /* AlertDialog dimensions */
  --alert-dialog-width: 32rem;
  --alert-dialog-padding: var(--space-6);
  
  /* AlertDialog colors */
  --alert-dialog-overlay: hsl(var(--color-neutral-900) / 0.8);
  --alert-dialog-surface: var(--color-surface);
  --alert-dialog-border: var(--color-border);
  
  /* AlertDialog effects */
  --overlay-blur: 4px;
  
  /* AlertDialog typography */
  --alert-dialog-title-size: var(--font-size-lg);
  --alert-dialog-description-size: var(--font-size-sm);
}
```

## Troubleshooting

### Common Issues

1. **Dialog not closing on action**
```tsx
// Solution: Add onOpenChange handler
<AlertDialog onOpenChange={setOpen}>
  <AlertDialogAction onClick={() => {
    // Handle action
    setOpen(false)
  }}>
    Confirm
  </AlertDialogAction>
</AlertDialog>
```

2. **Focus management issues**
```tsx
// Solution: Use asChild prop for custom triggers
<AlertDialogTrigger asChild>
  <Button>Custom Trigger</Button>
</AlertDialogTrigger>
```

3. **Content overflow**
```tsx
// Solution: Use max-height and scrolling
<AlertDialogContent className="max-h-[85vh] overflow-y-auto">
  {/* Long content */}
</AlertDialogContent>
```

## Best Practices

1. **Content Guidelines**
   - Keep titles clear and concise
   - Provide descriptive action buttons
   - Use destructive styling for dangerous actions

2. **Interaction Design**
   - Always provide a way to dismiss
   - Position actions consistently
   - Use appropriate action hierarchy

3. **Accessibility**
   - Maintain focus management
   - Provide keyboard navigation
   - Include proper ARIA attributes

4. **Responsive Design**
   - Adjust sizing for mobile
   - Ensure content readability
   - Handle long content gracefully

## Variants

### Destructive Action
```tsx
<AlertDialog>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete File</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to delete this file?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### With Form
```tsx
<AlertDialog>
  <AlertDialogContent>
    <form onSubmit={(e) => {
      e.preventDefault()
      // Handle form submission
    }}>
      <AlertDialogHeader>
        <AlertDialogTitle>Create New</AlertDialogTitle>
        <AlertDialogDescription>
          Fill in the information below.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="py-4">
        {/* Form fields */}
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
        <AlertDialogAction type="submit">Create</AlertDialogAction>
      </AlertDialogFooter>
    </form>
  </AlertDialogContent>
</AlertDialog>
```

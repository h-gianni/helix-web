# Dialog Component

The Dialog component provides a modal interface for displaying content that requires user attention or interaction. It supports various configurations while maintaining accessibility and proper focus management.

## Import

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
```

## API Reference

### Components

#### Dialog
Root component that manages dialog state.
```tsx
<Dialog>
  <DialogTrigger />
  <DialogContent>...</DialogContent>
</Dialog>
```

#### Props
- `open?: boolean` - Controlled open state
- `onOpenChange?: (open: boolean) => void` - Open state change handler
- `modal?: boolean` - Whether dialog should trap focus (default: true)

#### DialogContent
Container for dialog content. Handles positioning and animations.

Props:
- `className?: string` - Override styles
- `children: React.ReactNode` - Dialog content
- All HTML div props supported

#### DialogHeader, DialogFooter, DialogTitle, DialogDescription
Semantic layout components for dialog structure.

## Styling

### Base Styles
```css
.dialog-content {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--dialog-shadow);
  width: 100%;
  max-width: var(--dialog-width-md);
  padding: var(--dialog-content-padding);
  z-index: var(--z-modal);
}

.dialog-overlay {
  background-color: var(--dialog-overlay-background);
  backdrop-filter: blur(4px);
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
}
```

### Sizes
```tsx
// Small
<DialogContent className="dialog-size-sm">...</DialogContent>

// Medium (Default)
<DialogContent className="dialog-size-md">...</DialogContent>

// Large
<DialogContent className="dialog-size-lg">...</DialogContent>
```

## Animations

### Default Animation
```css
.dialog-content {
  animation: dialog-in var(--dialog-enter-duration) var(--ease-out);
}

@keyframes dialog-in {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
```

### Overlay Animation
```css
.dialog-overlay {
  animation: overlay-in var(--dialog-enter-duration) var(--ease-out);
}

@keyframes overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## Examples

### Basic Dialog
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      {/* Dialog content */}
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => {}}>
        Cancel
      </Button>
      <Button onClick={() => {}}>Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Confirmation Dialog
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="destructive">Delete Account</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. Your account will be permanently deleted.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete Account</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Form Dialog
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Edit Settings</Button>
  </DialogTrigger>
  <DialogContent>
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Edit Settings</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

## Accessibility

### Focus Management
- Focus is automatically trapped within the dialog when open
- Focus returns to trigger element when closed
- `Escape` key closes the dialog
- Initial focus can be customized with `autoFocus` prop

### ARIA Attributes
```tsx
<Dialog>
  <DialogContent
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
  >
    <DialogTitle id="dialog-title">
      Accessible Title
    </DialogTitle>
    <DialogDescription id="dialog-description">
      Accessible description
    </DialogDescription>
  </DialogContent>
</Dialog>
```

## Integration

### With Forms
```tsx
function DialogWithForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: ""
    }
  });

  return (
    <Dialog>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Form fields */}
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

### Controlled Dialog
```tsx
function ControlledDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        {/* Content */}
      </DialogContent>
    </Dialog>
  );
}
```

## Design Tokens
```css
:root {
  /* Dialog-specific tokens */
  --dialog-width-sm: 24rem;
  --dialog-width-md: 32rem;
  --dialog-width-lg: 48rem;
  
  --dialog-overlay-background: hsl(var(--color-neutral-900) / 0.8);
  --dialog-content-padding: var(--space-6);
  --dialog-content-gap: var(--space-4);
  
  --dialog-shadow: var(--shadow-lg);
  --dialog-z-index: var(--z-modal);
  
  --dialog-enter-duration: var(--duration-normal);
  --dialog-exit-duration: var(--duration-fast);
}
```

## Troubleshooting

### Common Issues

1. **Dialog not centered**
   ```css
   /* Solution: Ensure proper transform */
   .dialog-content {
     position: fixed;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
   }
   ```

2. **Scroll lock issues**
   ```tsx
   // Solution: Use proper scroll lock handling
   <Dialog onOpenChange={(open) => {
     if (open) {
       document.body.style.overflow = 'hidden';
     } else {
       document.body.style.overflow = 'unset';
     }
   }}>
   ```

3. **Focus management problems**
   ```tsx
   // Solution: Customize initial focus
   <DialogContent onOpenAutoFocus={(event) => {
     event.preventDefault();
     document.getElementById('custom-element')?.focus();
   }}>
   ```

## Best Practices

1. **Content Structure**
   - Use semantic hierarchy with DialogHeader, DialogTitle, etc.
   - Keep content concise and focused
   - Provide clear actions in DialogFooter

2. **Accessibility**
   - Always include proper ARIA labels
   - Ensure keyboard navigation works
   - Test with screen readers

3. **Performance**
   - Portal dialog to document.body
   - Lazy load dialog content when possible
   - Clean up side effects on dialog close

4. **Responsive Design**
   - Adjust width for different screen sizes
   - Ensure proper padding on mobile
   - Handle overflow content appropriately

Would you like me to continue with the documentation for the remaining components (Checkbox, DropdownMenu)?
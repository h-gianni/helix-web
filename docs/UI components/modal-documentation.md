# Modal Component

The Modal component provides a dialog window that overlays the main content. Built on top of the Dialog component, it supports various sizes, customizable headers, and content layouts.

## Import

```tsx
import { Modal } from "@/components/ui/modal"
```

## API Reference

### Props
- `isOpen: boolean` - Controls the visibility of the modal
- `onClose: () => void` - Handler called when the modal should close
- `title: string` - Modal title text
- `size?: "sm" | "md" | "lg" | "xl"` - Controls the width of the modal
- `hideClose?: boolean` - Hides the close button when true
- `className?: string` - Additional CSS classes
- `children: React.ReactNode` - Modal content

## Styling

### Base Styles
```css
.modal-wrapper {
  position: relative;
  width: 100%;
  max-width: var(--modal-width-md);
  background-color: var(--modal-content-background);
  border: 1px solid var(--modal-border);
  box-shadow: var(--modal-shadow);
}

.modal-header {
  padding: var(--modal-padding-y) var(--modal-padding-x);
  border-bottom: 1px solid var(--modal-border);
}
```

## States

### Basic States
```tsx
// Default
<Modal
  isOpen={true}
  onClose={handleClose}
  title="Default Modal"
>
  Content here
</Modal>

// Without close button
<Modal
  isOpen={true}
  onClose={handleClose}
  title="No Close"
  hideClose
>
  Content here
</Modal>
```

## Examples

### Basic Modal
```tsx
function BasicExample() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Example Modal"
      >
        <p>This is the modal content.</p>
      </Modal>
    </>
  )
}
```

### With Footer Actions
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Save Changes"
>
  <div className="space-y-4">
    <p>Are you sure you want to save these changes?</p>
    
    <div className="modal-footer">
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSave}>
        Save Changes
      </Button>
    </div>
  </div>
</Modal>
```

### With Form Content
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Profile"
>
  <form onSubmit={handleSubmit}>
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
      </div>
      
      <div className="modal-footer">
        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </div>
  </form>
</Modal>
```

## Accessibility

### Keyboard Navigation
- `Escape`: Close the modal
- `Tab`: Move focus between interactive elements
- `Shift + Tab`: Move focus in reverse
- `Enter/Space`: Trigger focused action

### ARIA Support
```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Accessible Modal"
  aria-describedby="modal-description"
>
  <p id="modal-description">
    This modal has proper ARIA attributes for accessibility.
  </p>
</Modal>
```

## Design Tokens
```css
:root {
  /* Modal dimensions */
  --modal-width-sm: 24rem;
  --modal-width-md: 28rem;
  --modal-width-lg: 32rem;
  --modal-width-xl: 36rem;
  
  /* Modal spacing */
  --modal-padding-x: var(--space-6);
  --modal-padding-y: var(--space-4);
  
  /* Modal colors */
  --modal-header-background: var(--color-surface);
  --modal-content-background: var(--color-surface);
  --modal-border: var(--color-border);
  
  /* Modal effects */
  --modal-shadow: var(--shadow-lg);
  --modal-overlay-background: hsl(var(--color-neutral-900) / 0.8);
}
```

## Troubleshooting

### Common Issues

1. **Modal not closing**
```tsx
// Solution: Ensure onClose handler updates state
const [isOpen, setIsOpen] = useState(false)

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
>
  Content
</Modal>
```

2. **Content scrolling issues**
```tsx
// Solution: Use max-height and overflow
<Modal className="max-h-[80vh]">
  <div className="overflow-y-auto">
    Long content
  </div>
</Modal>
```

3. **Focus management**
```tsx
// Solution: Use autoFocus on primary action
<Modal>
  <Button autoFocus onClick={handlePrimaryAction}>
    Primary Action
  </Button>
</Modal>
```

## Best Practices

1. **Content Organization**
   - Keep content concise
   - Use clear action labels
   - Maintain consistent layout

2. **Interaction Design**
   - Provide clear close actions
   - Handle background clicks
   - Manage keyboard focus

3. **Accessibility**
   - Use semantic HTML
   - Include ARIA labels
   - Support keyboard navigation

4. **Responsive Design**
   - Use appropriate sizes
   - Handle mobile views
   - Manage content overflow

## Variants

### Size Variants
```tsx
// Small
<Modal size="sm" title="Small Modal">
  Compact content
</Modal>

// Large
<Modal size="lg" title="Large Modal">
  More spacious content
</Modal>
```

### With Custom Header
```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title={
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5" />
      <span>Custom Header</span>
    </div>
  }
>
  Content here
</Modal>
```

### Confirmation Dialog
```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Confirm Deletion"
  size="sm"
>
  <div className="space-y-4">
    <p className="text-center">
      Are you sure you want to delete this item?
      This action cannot be undone.
    </p>
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  </div>
</Modal>
```

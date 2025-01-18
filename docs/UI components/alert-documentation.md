# Alert Component

The Alert component is used to display important messages to the user. It supports various states and styles while maintaining accessibility and can include titles, descriptions, and icons.

## Import

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
```

## API Reference

### Props

#### Alert
- `variant?: "default" | "destructive" | "success" | "warning" | "info"` - Visual style variant
- `className?: string` - Additional CSS classes
- All HTML div props are supported

#### AlertTitle
- `className?: string` - Additional CSS classes
- All HTML h5 props are supported

#### AlertDescription
- `className?: string` - Additional CSS classes
- All HTML div props are supported

## Styling

### Base Styles
```css
.alert {
  position: relative;
  width: 100%;
  border-radius: var(--radius-lg);
  padding: var(--alert-padding);
  background-color: var(--alert-surface);
  border: var(--alert-border-width) solid var(--alert-border);
  transition: var(--alert-transition);
}
```

## States

### Alert Variants
```tsx
// Default
<Alert>
  <AlertTitle>Default Alert</AlertTitle>
  <AlertDescription>This is a default alert.</AlertDescription>
</Alert>

// Destructive
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>

// Success
<Alert variant="success">
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>Operation completed successfully.</AlertDescription>
</Alert>
```

## Examples

### Basic Alert
```tsx
<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the cli.
  </AlertDescription>
</Alert>
```

### With Icon
```tsx
<Alert>
  <InfoIcon className="alert-icon" />
  <AlertTitle>Note</AlertTitle>
  <AlertDescription>
    This is an informational message.
  </AlertDescription>
</Alert>
```

### With Custom Content
```tsx
<Alert>
  <AlertTitle>Update Available</AlertTitle>
  <AlertDescription>
    <p>A new version is available. Would you like to update?</p>
    <div className="mt-4 flex gap-2">
      <Button size="sm">Update</Button>
      <Button size="sm" variant="outline">Later</Button>
    </div>
  </AlertDescription>
</Alert>
```

## Animations

### Alert Animation
```css
.alert {
  transition: all var(--duration-fast) var(--ease-out);
}

@keyframes alert-in {
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Accessibility

### ARIA Roles
```tsx
<Alert role="alert">
  <AlertTitle>Important Notice</AlertTitle>
  <AlertDescription>This message is important.</AlertDescription>
</Alert>
```

### Keyboard User Considerations
- Alerts should be announced by screen readers without requiring user interaction
- Interactive elements within alerts should be keyboard accessible
- Focus management should be considered for dynamic alerts

## Integration

### With Icons
```tsx
import { Info, AlertTriangle, CheckCircle } from "lucide-react"

function IconAlert() {
  return (
    <Alert>
      <Info className="alert-icon" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is an informational message.
      </AlertDescription>
    </Alert>
  )
}
```

### With Dynamic Content
```tsx
function DynamicAlert({ message, type = "default" }) {
  return (
    <Alert variant={type}>
      <AlertTitle>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
```

## Design Tokens
```css
:root {
  /* Alert dimensions and spacing */
  --alert-padding: var(--space-4);
  --alert-icon-spacing: 1.75rem;
  --alert-border-width: 1px;
  
  /* Alert colors */
  --alert-surface: var(--color-surface);
  --alert-border: var(--color-border);
  --alert-text: var(--color-text-primary);
  
  /* Alert variants */
  --alert-destructive-surface: hsl(var(--color-destructive-hsl) / 0.1);
  --alert-success-surface: hsl(var(--color-success-hsl) / 0.1);
  --alert-warning-surface: hsl(var(--color-warning-hsl) / 0.1);
  --alert-info-surface: hsl(var(--color-info-hsl) / 0.1);
}
```

## Troubleshooting

### Common Issues

1. **Icons not aligned properly**
```tsx
// Solution: Use alert-icon class
<Alert>
  <Icon className="alert-icon" />
  <AlertTitle>Title</AlertTitle>
</Alert>
```

2. **Content spacing issues**
```tsx
// Solution: Use proper spacing tokens
<Alert>
  <AlertTitle className="mb-[var(--space-2)]">Title</AlertTitle>
  <AlertDescription>Description</AlertDescription>
</Alert>
```

3. **Custom styling conflicts**
```tsx
// Solution: Use composition pattern
<Alert className="custom-alert">
  <AlertTitle className="custom-title">Title</AlertTitle>
</Alert>
```

## Best Practices

1. **Content Guidelines**
   - Keep messages clear and concise
   - Use appropriate variants for context
   - Include actionable information

2. **Accessibility**
   - Use semantic HTML
   - Include proper ARIA roles
   - Ensure color contrast

3. **Interaction Design**
   - Consider placement carefully
   - Don't overuse alerts
   - Provide clear next steps

4. **Responsive Design**
   - Ensure alerts work on all screens
   - Maintain readability
   - Consider mobile interactions

## Variants

### Status Variants
```tsx
// Success Alert
<Alert variant="success">
  <CheckCircle className="alert-icon" />
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>Your changes have been saved.</AlertDescription>
</Alert>

// Warning Alert
<Alert variant="warning">
  <AlertTriangle className="alert-icon" />
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>Your storage is almost full.</AlertDescription>
</Alert>
```

### With Actions
```tsx
<Alert>
  <AlertTitle>Pending Changes</AlertTitle>
  <AlertDescription>
    You have unsaved changes.
  </AlertDescription>
  <div className="mt-4 flex space-x-4">
    <Button>Save</Button>
    <Button variant="outline">Discard</Button>
  </div>
</Alert>
```

### Dismissible Alert
```tsx
function DismissibleAlert() {
  const [show, setShow] = useState(true)
  
  if (!show) return null
  
  return (
    <Alert className="flex justify-between items-start">
      <div>
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>This is a dismissible alert.</AlertDescription>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShow(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  )
}
```

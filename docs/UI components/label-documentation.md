# Label Component

The Label component provides a text label that can be associated with form controls. Built on Radix UI's Label primitive, it includes support for required fields, error states, and various sizes.

## Import

```tsx
import { Label } from "@/components/ui/label"
```

## API Reference

### Props
- `size?: "sm" | "default" | "lg"` - Label size variant
- `required?: boolean` - Shows required field indicator
- `invalid?: boolean` - Shows error state
- `className?: string` - Additional CSS classes
- All HTML label props are supported

## Styling

### Base Styles
```css
.label {
  color: var(--label-text);
  font-size: var(--label-font-size-default);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-none);
  transition: var(--label-transition);
}

.label[data-required]:after {
  content: "*";
  color: var(--label-text-error);
  margin-left: var(--label-required-spacing);
}
```

## States

### Basic States
```tsx
// Default
<Label>Username</Label>

// Required
<Label required>Password</Label>

// Invalid
<Label invalid>Email</Label>

// Disabled
<Label className="peer-disabled:opacity-70">Account</Label>
```

## Examples

### Basic Label
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>
```

### With Required Field
```tsx
<div className="space-y-2">
  <Label htmlFor="password" required>
    Password
  </Label>
  <Input id="password" type="password" />
</div>
```

### With Helper Text
```tsx
<div className="space-y-1">
  <Label htmlFor="username">Username</Label>
  <Input id="username" />
  <span className="label-helper-text">
    Must be at least 4 characters
  </span>
</div>
```

## Accessibility

### HTML Association
```tsx
<div>
  <Label htmlFor="name">Name</Label>
  <Input id="name" />
</div>
```

### ARIA Support
```tsx
<Label
  htmlFor="email"
  required
  aria-label="Email address"
>
  Email
</Label>
```

### Required Fields
```tsx
<Label htmlFor="password" required>
  Password
  <span className="sr-only">(required)</span>
</Label>
```

## Integration

### With Form Libraries
```tsx
import { useForm } from "react-hook-form"

function FormExample() {
  const { register, formState: { errors } } = useForm()

  return (
    <div className="space-y-2">
      <Label 
        htmlFor="email"
        invalid={!!errors.email}
        required
      >
        Email
      </Label>
      <Input
        id="email"
        {...register("email", { required: true })}
      />
      {errors.email && (
        <span className="label-error-text">
          This field is required
        </span>
      )}
    </div>
  )
}
```

## Design Tokens
```css
:root {
  /* Label typography */
  --label-font-size-sm: var(--font-size-xs);
  --label-font-size-default: var(--font-size-sm);
  --label-font-size-lg: var(--font-size-base);
  
  /* Label colors */
  --label-text: var(--color-text-primary);
  --label-text-disabled: var(--color-text-disabled);
  --label-text-error: var(--color-destructive);
  
  /* Label spacing */
  --label-gap: var(--space-2);
  --label-required-spacing: var(--space-1);
}
```

## Troubleshooting

### Common Issues

1. **Label not associated with input**
```tsx
// Solution: Use htmlFor and id attributes
<Label htmlFor="field-id">Label</Label>
<Input id="field-id" />
```

2. **Required indicator not showing**
```tsx
// Solution: Add required prop
<Label required>Required Field</Label>
```

3. **Error state not visible**
```tsx
// Solution: Add invalid prop
<Label invalid>Invalid Field</Label>
```

## Best Practices

1. **Accessibility**
   - Always associate labels with form controls
   - Use proper HTML structure
   - Include aria labels when needed

2. **Required Fields**
   - Clearly indicate required fields
   - Use consistent indicators
   - Provide visual feedback

3. **Error States**
   - Show clear error indicators
   - Provide helpful error messages
   - Maintain color contrast

4. **Layout**
   - Use consistent spacing
   - Align labels properly
   - Group related fields

## Variants

### Size Variants
```tsx
<div className="space-y-4">
  <Label size="sm">Small Label</Label>
  <Label size="default">Default Label</Label>
  <Label size="lg">Large Label</Label>
</div>
```

### With Error Message
```tsx
<div className="space-y-1">
  <Label htmlFor="email" invalid>
    Email
  </Label>
  <Input id="email" />
  <span className="label-error-text">
    Please enter a valid email address
  </span>
</div>
```

### With Description
```tsx
<div className="space-y-1">
  <Label htmlFor="bio">Bio</Label>
  <Textarea id="bio" />
  <span className="label-helper-text">
    Write a short description about yourself
  </span>
</div>
```

# Input Component

The Input component provides a text input control that allows users to enter and edit text. It supports various sizes, states, and styles while maintaining accessibility and form integration capabilities.

## Import

```tsx
import { Input } from "@/components/ui/input"
```

## API Reference

### Props
- `inputSize?: 'sm' | 'md' | 'lg'` - Size variants for the input
- `error?: boolean` - Error state
- `disabled?: boolean` - Disabled state
- `className?: string` - Additional CSS classes
- All HTML input props are supported except `size` (use `inputSize` instead)

## Styling

### Base Styles
```css
.input {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  transition: all var(--duration-fast) var(--ease-out);
  border-radius: var(--radius-base);
  width: 100%;
}

.input:focus {
  outline: none;
  ring: 2px solid var(--color-primary);
  ring-offset: 2px;
}
```

## States

### Basic States
```tsx
// Default
<Input placeholder="Default input" />

// Disabled
<Input disabled placeholder="Disabled input" />

// With error
<Input error placeholder="Error input" />

// Read-only
<Input readOnly value="Read-only input" />
```

## Examples

### Basic Input
```tsx
<div className="flex flex-col space-y-2">
  <label htmlFor="email" className="text-sm font-medium">
    Email
  </label>
  <Input
    id="email"
    type="email"
    placeholder="Enter your email"
  />
</div>
```

### Input Sizes
```tsx
<div className="space-y-4">
  <Input inputSize="sm" placeholder="Small input" />
  <Input inputSize="md" placeholder="Medium input" />
  <Input inputSize="lg" placeholder="Large input" />
</div>
```

### With Icon
```tsx
<div className="relative">
  <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
  <Input 
    className="pl-8" 
    placeholder="Search..." 
  />
</div>
```

### With Helper Text
```tsx
<div className="space-y-2">
  <label htmlFor="username">Username</label>
  <Input
    id="username"
    placeholder="Enter username"
  />
  <p className="text-sm text-foreground-muted">
    Must be at least 4 characters long.
  </p>
</div>
```

## Animations

### Focus Animation
```css
.input {
  transition: all var(--duration-fast) var(--ease-out);
}

.input:focus {
  animation: input-focus var(--duration-fast) var(--ease-out);
}

@keyframes input-focus {
  from {
    box-shadow: 0 0 0 0 var(--color-primary);
  }
  to {
    box-shadow: 0 0 0 4px var(--color-primary-alpha);
  }
}
```

## Accessibility

### Keyboard Navigation
- `Tab`: Move focus to input
- `Shift + Tab`: Move focus in reverse
- `Enter`: Submit form (when within a form)

### ARIA Support
```tsx
<div role="group" aria-labelledby="input-group">
  <label id="input-group">Personal Information</label>
  <Input
    aria-label="Full name"
    aria-describedby="name-description"
    aria-required="true"
  />
  <span id="name-description">
    Enter your full legal name as it appears on your ID.
  </span>
</div>
```

## Integration

### With Forms
```tsx
import { useForm } from "react-hook-form"

function InputForm() {
  const form = useForm({
    defaultValues: {
      email: "",
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Input
            {...field}
            error={!!fieldState.error}
            placeholder="Enter email"
          />
        )}
      />
    </form>
  )
}
```

### With Validation
```tsx
<div className="space-y-2">
  <Input
    error={!!errors.email}
    {...register("email", {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address"
      }
    })}
  />
  {errors.email && (
    <p className="text-destructive text-sm">
      {errors.email.message}
    </p>
  )}
</div>
```

## Design Tokens
```css
:root {
  /* Input heights */
  --input-height-sm: 2rem;
  --input-height-md: 2.5rem;
  --input-height-lg: 3rem;

  /* Input colors */
  --input-background: var(--color-surface);
  --input-border: var(--color-border);
  --input-text: var(--color-text-primary);
  --input-placeholder: var(--color-text-tertiary);
  
  /* Input states */
  --input-hover-border: var(--color-border-hover);
  --input-focus-ring: var(--color-primary);
  --input-disabled-bg: var(--color-surface-hover);
  --input-error-border: var(--color-destructive);
}
```

## Troubleshooting

### Common Issues

1. **Input not full width**
```tsx
// Solution: Add width utility class
<Input className="w-full" />
```

2. **Icon alignment issues**
```tsx
// Solution: Use relative positioning
<div className="relative">
  <Input className="pl-10" />
  <Icon className="absolute left-3 top-1/2 -translate-y-1/2" />
</div>
```

3. **Form integration errors**
```tsx
// Solution: Use controlled component pattern
const [value, setValue] = useState("")

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

## Best Practices

1. **Label Usage**
   - Always provide labels for inputs
   - Use semantic HTML for labels
   - Ensure proper label alignment

2. **Error Handling**
   - Display clear error messages
   - Use visual indicators for errors
   - Provide validation feedback

3. **Accessibility**
   - Include proper ARIA attributes
   - Support keyboard navigation
   - Provide clear focus states

4. **Responsive Design**
   - Use appropriate input sizes
   - Consider mobile input types
   - Handle different viewport sizes

## Variants

### With Character Count
```tsx
<div className="relative">
  <Input maxLength={100} />
  <span className="absolute right-2 bottom-2 text-sm text-foreground-muted">
    0/100
  </span>
</div>
```

### Password Input
```tsx
function PasswordInput() {
  const [show, setShow] = useState(false)
  
  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        placeholder="Enter password"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        {show ? <EyeIcon /> : <EyeOffIcon />}
      </button>
    </div>
  )
}
```

### Loading State
```tsx
<div className="relative">
  <Input disabled className="pr-10" />
  <Spinner className="absolute right-3 top-1/2 -translate-y-1/2" />
</div>
```

Would you like me to expand on any section or add more examples?
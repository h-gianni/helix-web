# RadioGroup Component

The RadioGroup component allows users to select a single option from a list of mutually exclusive options. Built on Radix UI's RadioGroup primitive, it provides full keyboard navigation and ARIA support.

## Import

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
```

## API Reference

### Props

#### RadioGroup
- `error?: boolean` - Error state
- `defaultValue?: string` - Default selected value
- `value?: string` - Controlled value
- `onValueChange?: (value: string) => void` - Value change handler
- `disabled?: boolean` - Disabled state

#### RadioGroupItem
- `value: string` - Item value
- `disabled?: boolean` - Disabled state
- `required?: boolean` - Required state
- All HTML input props are supported

## Styling

### Base Styles
```css
.radio-group-item {
  aspect-square;
  height: var(--radio-size);
  width: var(--radio-size);
  border-radius: 9999px;
  border: 1px solid var(--radio-border);
  transition: var(--radio-transition);
}

.radio-group-item[data-state="checked"] {
  border-color: var(--radio-checked);
  color: var(--radio-checked);
}
```

## States

### Basic States
```tsx
// Default
<RadioGroup defaultValue="option1">
  <RadioGroupItem value="option1" />
</RadioGroup>

// Disabled
<RadioGroup disabled>
  <RadioGroupItem value="option1" />
</RadioGroup>

// Error
<RadioGroup error>
  <RadioGroupItem value="option1" />
</RadioGroup>
```

## Examples

### Basic RadioGroup
```tsx
<RadioGroup defaultValue="light">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="light" id="light" />
    <label htmlFor="light">Light</label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="dark" id="dark" />
    <label htmlFor="dark">Dark</label>
  </div>
</RadioGroup>
```

### With Descriptions
```tsx
<RadioGroup defaultValue="comfortable">
  <div className="space-y-1">
    <div className="flex items-center">
      <RadioGroupItem value="comfortable" id="comfortable" />
      <label htmlFor="comfortable" className="ml-2 font-medium">
        Comfortable
      </label>
    </div>
    <p className="radio-description">
      Default spacing for optimal readability
    </p>
  </div>
</RadioGroup>
```

### Horizontal Layout
```tsx
<RadioGroup className="radio-group-horizontal">
  <div className="radio-label">
    <RadioGroupItem value="xs" id="xs" />
    <label htmlFor="xs">Extra Small</label>
  </div>
  <div className="radio-label">
    <RadioGroupItem value="sm" id="sm" />
    <label htmlFor="sm">Small</label>
  </div>
</RadioGroup>
```

## Accessibility

### Keyboard Navigation
- `Tab`: Move focus to the radio group
- `Space`: Select focused radio item
- `ArrowDown/ArrowRight`: Move focus to next radio item
- `ArrowUp/ArrowLeft`: Move focus to previous radio item

### ARIA Support
```tsx
<RadioGroup aria-label="View density">
  <div role="group" aria-labelledby="density-label">
    <span id="density-label">Select view density:</span>
    <RadioGroupItem
      value="compact"
      aria-label="Compact view"
    />
  </div>
</RadioGroup>
```

## Integration

### With Forms
```tsx
import { useForm, Controller } from "react-hook-form"

function RadioForm() {
  const form = useForm({
    defaultValues: {
      type: "",
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="type"
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            error={!!form.formState.errors.type}
          >
            <RadioGroupItem value="personal" />
            <RadioGroupItem value="business" />
          </RadioGroup>
        )}
      />
    </form>
  )
}
```

## Design Tokens
```css
:root {
  /* Radio dimensions */
  --radio-size: 1rem;
  --radio-indicator-size: 0.625rem;
  
  /* Radio colors */
  --radio-border: var(--color-border);
  --radio-border-hover: var(--color-border-hover);
  --radio-background: var(--color-surface);
  --radio-checked: var(--color-primary);
  
  /* Radio group */
  --radio-group-gap: var(--space-2);
  
  /* Radio transitions */
  --radio-transition: all var(--duration-fast) var(--ease-out);
}
```

## Troubleshooting

### Common Issues

1. **Radio not updating**
```tsx
// Solution: Use controlled component pattern
const [value, setValue] = useState("")

<RadioGroup
  value={value}
  onValueChange={setValue}
>
  <RadioGroupItem value="option" />
</RadioGroup>
```

2. **Styling issues with labels**
```tsx
// Solution: Use proper wrapper classes
<div className="radio-label">
  <RadioGroupItem value="option" />
  <label>Option</label>
</div>
```

3. **Focus management**
```tsx
// Solution: Use proper HTML structure
<RadioGroup>
  <RadioGroupItem id="option" value="option" />
  <label htmlFor="option">Option</label>
</RadioGroup>
```

## Best Practices

1. **Label Usage**
   - Always provide labels for options
   - Use descriptive text
   - Consider adding descriptions

2. **Grouping**
   - Group related options
   - Use clear section headers
   - Maintain consistent spacing

3. **Accessibility**
   - Use proper ARIA labels
   - Support keyboard navigation
   - Maintain focus management

4. **Layout**
   - Use consistent spacing
   - Align items properly
   - Consider mobile interactions

## Variants

### Size Variants
```tsx
// Small
<RadioGroupItem className="radio-sm" value="small" />

// Large
<RadioGroupItem className="radio-lg" value="large" />
```

### With Cards
```tsx
<RadioGroup defaultValue="card1">
  <div className="grid gap-4">
    <label className="radio-card">
      <RadioGroupItem value="card1" className="sr-only" />
      <div className="p-4 rounded-lg border-2 data-[state=checked]:border-primary">
        <h3>Option 1</h3>
        <p>Description for option 1</p>
      </div>
    </label>
  </div>
</RadioGroup>
```

### With Icons
```tsx
<RadioGroup>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="sun" />
    <label className="flex items-center">
      <Sun className="w-4 h-4 mr-2" />
      Light Mode
    </label>
  </div>
</RadioGroup>
```

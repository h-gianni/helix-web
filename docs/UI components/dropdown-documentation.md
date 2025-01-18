# Dropdown Menu Component

The Dropdown Menu component provides a menu of actions or options that appear when triggered. It supports nested menus, keyboard navigation, and various item types while maintaining accessibility.

## Import

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu"
```

## API Reference

### Components

#### DropdownMenu
Root component that manages dropdown state.
```tsx
<DropdownMenu>
  <DropdownMenuTrigger />
  <DropdownMenuContent>...</DropdownMenuContent>
</DropdownMenu>
```

#### Props
- `open?: boolean` - Controlled open state
- `onOpenChange?: (open: boolean) => void` - Open state change handler
- `modal?: boolean` - Whether dropdown should trap focus

## Styling

### Base Styles
```css
.dropdown-content {
  min-width: var(--dropdown-min-width);
  padding: var(--dropdown-padding);
  background-color: var(--color-surface);
  border: var(--dropdown-border-width) solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  z-index: var(--dropdown-z-index);
}

.dropdown-item {
  padding: var(--space-1.5) var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  border-radius: var(--radius-sm);
  transition: var(--dropdown-transition);
}
```

## Item Types

### Basic Item
```tsx
<DropdownMenuItem>
  Profile Settings
</DropdownMenuItem>
```

### Checkbox Item
```tsx
<DropdownMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
  Show Toolbar
</DropdownMenuCheckboxItem>
```

### Radio Items
```tsx
<DropdownMenuRadioGroup value={value} onValueChange={setValue}>
  <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
  <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
</DropdownMenuRadioGroup>
```

## Examples

### Basic Dropdown
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### With Icons and Shortcuts
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>File</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>
      <FileIcon className="mr-2 h-4 w-4" />
      New File
      <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <FolderIcon className="mr-2 h-4 w-4" />
      New Folder
      <DropdownMenuShortcut>⌘⇧N</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Nested Dropdown
```tsx
<DropdownMenu>
  <DropdownMenuTrigger>Options</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem>Sub Item 1</DropdownMenuItem>
        <DropdownMenuItem>Sub Item 2</DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  </DropdownMenuContent>
</DropdownMenu>
```

## Animations

### Menu Animation
```css
.dropdown-content {
  animation: dropdown-in var(--duration-normal) var(--ease-out);
}

@keyframes dropdown-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

## Accessibility

### Keyboard Navigation
- `Space/Enter`: Open dropdown, select item
- `Arrow Up/Down`: Navigate items
- `Arrow Right`: Open submenu
- `Arrow Left`: Close submenu
- `Escape`: Close dropdown
- `Tab`: Move focus (when modal={false})

### ARIA Support
```tsx
<DropdownMenu>
  <DropdownMenuTrigger aria-label="Options menu">
    Options
  </DropdownMenuTrigger>
  <DropdownMenuContent aria-label="Dropdown menu">
    <DropdownMenuItem role="menuitem">
      Option 1
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Integration

### With Forms
```tsx
<DropdownMenu>
  <DropdownMenuTrigger>Select Option</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
      <DropdownMenuRadioItem value="1">Option 1</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="2">Option 2</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  </DropdownMenuContent>
</DropdownMenu>
```

### Controlled Dropdown
```tsx
function ControlledDropdown() {
  const [open, setOpen] = useState(false)
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>Controlled</DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* Content */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Design Tokens
```css
:root {
  /* Dropdown-specific tokens */
  --dropdown-min-width: 8rem;
  --dropdown-padding: var(--space-1);
  --dropdown-item-height: var(--space-8);
  --dropdown-border-width: 1px;
  
  --dropdown-enter-duration: var(--duration-normal);
  --dropdown-exit-duration: var(--duration-fast);
  
  --dropdown-item-icon-size: 1rem;
  --dropdown-item-indicator-size: 0.875rem;
  
  --dropdown-z-index: var(--z-dropdown);
}
```

## Troubleshooting

### Common Issues

1. **Positioning Issues**
```tsx
// Solution: Adjust alignment and offset
<DropdownMenuContent 
  align="end"
  sideOffset={5}
>
```

2. **Submenu Not Opening**
```tsx
// Solution: Ensure proper nesting
<DropdownMenuSub>
  <DropdownMenuSubTrigger>
    Submenu
  </DropdownMenuSubTrigger>
  <DropdownMenuPortal> {/* Important for nested menus */}
    <DropdownMenuSubContent>
      {/* Content */}
    </DropdownMenuSubContent>
  </DropdownMenuPortal>
</DropdownMenuSub>
```

3. **Focus Management**
```tsx
// Solution: Custom focus handling
<DropdownMenuContent onCloseAutoFocus={(event) => {
  event.preventDefault()
  customElement.focus()
}}>
```

## Best Practices

1. **Menu Structure**
   - Group related items
   - Use separators to create sections
   - Keep menu items concise
   - Include icons for visual hierarchy

2. **Interaction Design**
   - Provide clear hover states
   - Include keyboard shortcuts where applicable
   - Ensure adequate click targets
   - Show active/selected states

3. **Performance**
   - Lazy load complex menu content
   - Use portals for nested menus
   - Clean up event listeners

4. **Responsive Design**
   - Ensure proper spacing on touch devices
   - Handle overflow appropriately
   - Consider alternative patterns for mobile

5. **Accessibility**
   - Maintain keyboard navigation
   - Provide ARIA labels
   - Support screen readers
   - Handle focus management

Would you like me to complete the documentation for the remaining Checkbox component?
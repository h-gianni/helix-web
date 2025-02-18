# Card Component

The Card component is a flexible container that groups related content and actions. It supports various styles, sizes, and interactive states while maintaining consistent spacing and visual hierarchy.

## Import

```tsx
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
```

## Anatomy

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
  <CardFooter>
    Footer
  </CardFooter>
</Card>
```

## API Reference

### Card

The root container component.

#### Props
- `className`: Override or extend the styles applied to the component
- All HTML div props are supported

### CardHeader, CardContent, CardFooter

Sub-components for organizing content within the card.

#### Props
- `className`: Override or extend the styles applied to the component
- All HTML div props are supported

## Styling

### Base Styles
```css
/* Default card styles */
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}
```

### Sizes

```tsx
// Extra Small
<Card className="card-size-xsmall">...</Card>

// Small
<Card className="card-size-small">...</Card>

// Regular (Default)
<Card className="card-size-regular">...</Card>

// Large
<Card className="card-size-large">...</Card>

// Extra Large
<Card className="card-size-xlarge">...</Card>
```

### Variants

#### Background Variants
```tsx
// Default (Solid)
<Card>...</Card>

// Transparent
<Card className="card-bg-transparent">...</Card>

// Frosted Glass
<Card className="card-bg-icy">...</Card>
```

#### Shadow Variants
```tsx
// No Shadow
<Card className="card-shadow-none">...</Card>

// Small Shadow (Default)
<Card className="card-shadow-small">...</Card>

// Regular Shadow
<Card className="card-shadow-regular">...</Card>

// Large Shadow
<Card className="card-shadow-large">...</Card>
```

### Interactive States

#### Hoverable Card
```tsx
<Card className="card-hoverable">...</Card>
```

#### Clickable Card
```tsx
<Card className="card-interactive">...</Card>
```

## Animation & Transitions

Cards support smooth transitions for hover and interactive states:

```css
.card-hoverable {
  transition: transform var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}

.card-hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
```

## Examples

### Basic Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Welcome back</CardTitle>
    <CardDescription>Deploy your new project in one-click.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Your projects will appear here once created.</p>
  </CardContent>
  <CardFooter>
    <Button>Create project</Button>
  </CardFooter>
</Card>
```

### Interactive Media Card
```tsx
<Card className="card-hoverable">
  <img 
    src="/project-thumbnail.jpg" 
    alt="Project thumbnail"
    className="w-full h-48 object-cover rounded-t-lg"
  />
  <CardHeader>
    <CardTitle>Project Name</CardTitle>
    <CardDescription>Last updated 2 days ago</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Project description and details go here.</p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Edit</Button>
    <Button>View</Button>
  </CardFooter>
</Card>
```

### Compact Status Card
```tsx
<Card className="card-size-small flex items-center justify-between">
  <div className="flex items-center gap-3">
    <div className="h-2 w-2 rounded-full bg-green-500" />
    <p className="font-medium">System Status</p>
  </div>
  <p className="text-sm text-foreground-muted">Operational</p>
</Card>
```

### Dashboard Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Statistics</CardTitle>
    <CardDescription>Your activity this month</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-8">
      <div className="flex items-center">
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium">Total Revenue</p>
          <div className="flex items-center">
            <span className="text-2xl font-bold">$45,231.89</span>
            <span className="text-green-500 ml-2">+20.1%</span>
          </div>
        </div>
        <ChartIcon className="h-4 w-4 text-foreground-muted" />
      </div>
      {/* Add more statistics */}
    </div>
  </CardContent>
</Card>
```

## Accessibility

- Use semantic HTML within cards (`<h2>`, `<p>`, etc.)
- Ensure proper color contrast between text and background
- Make interactive cards keyboard accessible
- Use appropriate ARIA labels when needed

## Best Practices

1. **Content Structure**
   - Use CardHeader for titles and descriptions
   - Keep content organized and scannable
   - Maintain consistent padding and spacing

2. **Visual Hierarchy**
   - Use typography scale for different text elements
   - Maintain proper spacing between sections
   - Use dividers sparingly

3. **Interactivity**
   - Make entire card clickable when appropriate
   - Provide clear hover/focus states
   - Include proper loading states

4. **Responsive Design**
   - Consider mobile viewports
   - Adjust padding for different screen sizes
   - Handle overflow content appropriately

## Integration

### With Forms
```tsx
<Card>
  <CardHeader>
    <CardTitle>Create Account</CardTitle>
    <CardDescription>Enter your information below.</CardDescription>
  </CardHeader>
  <form>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" />
      </div>
      {/* Add more form fields */}
    </CardContent>
    <CardFooter>
      <Button type="submit">Create account</Button>
    </CardFooter>
  </form>
</Card>
```

### With Data Display
```tsx
<Card>
  <CardHeader>
    <CardTitle>Recent Transactions</CardTitle>
    <CardDescription>Your last 5 transactions</CardDescription>
  </CardHeader>
  <CardContent>
    <Table>
      {/* Table content */}
    </Table>
  </CardContent>
  <CardFooter>
    <Button variant="outline">View all</Button>
  </CardFooter>
</Card>
```

## Troubleshooting

### Common Issues

1. **Card not expanding to content**
   - Ensure proper flex layout
   - Check for overflow handling
   - Verify height settings

2. **Shadow not visible**
   - Check z-index stacking
   - Verify background color opacity
   - Ensure proper shadow token usage

3. **Hover effects not working**
   - Verify hover class application
   - Check transition properties
   - Ensure proper event bubbling

## Design Tokens

```css
:root {
  /* Card-specific tokens */
  --card-radius: var(--radius-lg);
  --card-padding: var(--space-6);
  --card-gap: var(--space-4);
  --card-shadow: var(--shadow-sm);
  --card-hover-shadow: var(--shadow-md);
  --card-border-color: var(--color-border);
  --card-background: var(--color-surface);
}
```

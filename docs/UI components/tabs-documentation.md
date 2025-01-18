# Tabs Component

The Tabs component helps organize related content into separate views, allowing users to navigate between them. Built on Radix UI's Tabs primitive, it provides full keyboard navigation and ARIA support.

## Import

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
```

## API Reference

### Props

#### Tabs
- `defaultValue: string` - The initial active tab
- `value?: string` - Controlled active tab value
- `onValueChange?: (value: string) => void` - Value change handler

#### TabsTrigger
- `value: string` - Unique identifier for the tab
- `disabled?: boolean` - Disabled state
- All HTML button props are supported

#### TabsContent
- `value: string` - Matches corresponding trigger value
- All HTML div props are supported

## Styling

### Base Styles
```css
.tabs-list {
  display: inline-flex;
  height: var(--tabs-height);
  background: var(--tabs-list-background);
  border-radius: var(--radius-md);
  padding: var(--tabs-list-padding);
}

.tabs-trigger {
  padding: var(--tabs-trigger-padding-y) var(--tabs-trigger-padding-x);
  transition: var(--tabs-transition);
}
```

## Examples

### Basic Tabs
```tsx
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    Account settings here
  </TabsContent>
  <TabsContent value="password">
    Password settings here
  </TabsContent>
</Tabs>
```

### With Icons
```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">
      <HomeIcon className="mr-2 h-4 w-4" />
      Overview
    </TabsTrigger>
    <TabsTrigger value="analytics">
      <ChartIcon className="mr-2 h-4 w-4" />
      Analytics
    </TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="analytics">Analytics content</TabsContent>
</Tabs>
```

### Controlled Tabs
```tsx
function ControlledTabs() {
  const [tab, setTab] = React.useState("tab1")

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
    </Tabs>
  )
}
```

## Accessibility

### Keyboard Navigation
- `Tab`: Move focus to the tab list
- `Arrow Left/Right`: Move between tabs
- `Space/Enter`: Activate focused tab
- `Home/End`: Move to first/last tab

### ARIA Support
```tsx
<Tabs aria-label="Settings tabs">
  <TabsList aria-label="Settings options">
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="advanced">Advanced</TabsTrigger>
  </TabsList>
  <TabsContent 
    value="general"
    role="tabpanel"
    aria-labelledby="general-tab"
  >
    General settings content
  </TabsContent>
</Tabs>
```

## Design Tokens
```css
:root {
  /* Tabs dimensions */
  --tabs-height: 2.5rem;
  --tabs-trigger-padding-x: 0.75rem;
  --tabs-trigger-padding-y: 0.375rem;
  
  /* Tabs spacing */
  --tabs-list-padding: 0.25rem;
  --tabs-content-gap: 0.5rem;
  
  /* Tabs colors */
  --tabs-list-background: var(--color-surface-hover);
  --tabs-trigger-active-background: var(--color-surface);
  --tabs-trigger-hover-background: var(--color-surface-hover);
}
```

## Troubleshooting

### Common Issues

1. **Tabs not switching**
```tsx
// Solution: Ensure values match
<TabsTrigger value="tab1" /> // Trigger value
<TabsContent value="tab1" /> // Content value must match
```

2. **Content not showing**
```tsx
// Solution: Check defaultValue
<Tabs defaultValue="tab1"> // Must match one of the tab values
```

3. **Styling issues**
```tsx
// Solution: Use proper class ordering
<TabsTrigger className="custom-class">
  Custom styles
</TabsTrigger>
```

## Best Practices

1. **Content Organization**
   - Group related content
   - Use clear labels
   - Keep content consistent

2. **Interaction Design**
   - Use meaningful labels
   - Provide visual feedback
   - Maintain tab order

3. **Accessibility**
   - Support keyboard navigation
   - Include ARIA labels
   - Maintain focus management

4. **Performance**
   - Lazy load content
   - Handle animations smoothly
   - Manage content updates

## Variants

### Size Variants
```tsx
// Small tabs
<Tabs className="tabs-sm">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
  </TabsList>
</Tabs>

// Large tabs
<Tabs className="tabs-lg">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
  </TabsList>
</Tabs>
```

### Vertical Layout
```tsx
<Tabs className="tabs-vertical">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <div className="flex-1">
    <TabsContent value="tab1">Content 1</TabsContent>
    <TabsContent value="tab2">Content 2</TabsContent>
  </div>
</Tabs>
```

### With Badges
```tsx
<Tabs defaultValue="messages">
  <TabsList>
    <TabsTrigger value="messages">
      Messages
      <Badge className="ml-2">3</Badge>
    </TabsTrigger>
    <TabsTrigger value="notifications">
      Notifications
      <Badge className="ml-2">12</Badge>
    </TabsTrigger>
  </TabsList>
</Tabs>
```

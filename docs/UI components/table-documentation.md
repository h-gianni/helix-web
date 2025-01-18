# Table Component

The Table component provides a way to organize and display data in rows and columns. Built with semantic HTML table elements, it supports various features like sorting, selection, and different visual styles.

## Import

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
```

## API Reference

### Props

#### Table
- `className?: string` - Additional CSS classes
- All HTML table props are supported

#### TableRow
- `selected?: boolean` - Selected state
- All HTML tr props are supported

#### TableCell/TableHead
- `className?: string` - Additional CSS classes
- All HTML td/th props are supported

## Styling

### Base Styles
```css
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--table-font-size);
  background-color: var(--table-body-background);
}

.table-row {
  border-bottom: 1px solid var(--table-border);
  transition: var(--table-transition);
}
```

## Examples

### Basic Table
```tsx
<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell>$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### With Custom Styling
```tsx
<Table>
  <TableHeader>
    <TableRow className="bg-muted">
      <TableHead className="font-bold">Name</TableHead>
      <TableHead className="text-right">Value</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="hover:bg-muted">
      <TableCell className="font-medium">Row 1</TableCell>
      <TableCell className="text-right">$100</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### With Selection
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[50px]">
        <Checkbox />
      </TableHead>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>
        <Checkbox />
      </TableCell>
      <TableCell>Row 1</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Accessibility

### Keyboard Navigation
- `Tab`: Move focus between interactive elements
- `Space`: Toggle selection (when using checkboxes)
- Arrow keys: Navigate between cells (when using role="grid")

### ARIA Support
```tsx
<Table aria-label="Users table">
  <TableHeader>
    <TableRow>
      <TableHead scope="col">Name</TableHead>
      <TableHead scope="col">Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell role="rowheader">John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Design Tokens
```css
:root {
  /* Table dimensions */
  --table-header-height: 3rem;
  --table-cell-padding: var(--space-4);
  --table-cell-padding-x: var(--space-4);
  
  /* Table colors */
  --table-border: var(--color-border);
  --table-header-background: var(--color-surface);
  --table-body-background: var(--color-surface);
  
  /* Table row states */
  --table-row-hover: var(--color-surface-hover);
  --table-row-selected: var(--color-surface-hover);
  --table-row-striped: var(--color-surface-hover);
}
```

## Troubleshooting

### Common Issues

1. **Table overflow**
```tsx
// Solution: Wrap in container
<div className="w-full overflow-auto">
  <Table>...</Table>
</div>
```

2. **Column alignment**
```tsx
// Solution: Use text alignment classes
<TableCell className="text-right">
  Right aligned content
</TableCell>
```

3. **Row spacing**
```tsx
// Solution: Use padding utility
<TableCell className="py-6">
  More vertical space
</TableCell>
```

## Best Practices

1. **Data Organization**
   - Use clear column headers
   - Align content appropriately
   - Sort data meaningfully

2. **Visual Hierarchy**
   - Use consistent spacing
   - Maintain proper alignment
   - Consider mobile views

3. **Accessibility**
   - Include proper ARIA labels
   - Use semantic markup
   - Support keyboard navigation

4. **Performance**
   - Handle large datasets
   - Implement virtualization
   - Use pagination when needed

## Variants

### Striped Rows
```tsx
<Table className="table-striped">
  <TableBody>
    <TableRow>
      <TableCell>Row 1</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Row 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Bordered Style
```tsx
<Table className="table-bordered">
  <TableHeader>
    <TableRow>
      <TableHead>Header</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Cell</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Compact Size
```tsx
<Table className="table-compact">
  <TableHeader>
    <TableRow>
      <TableHead>Compact Header</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Compact Cell</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### With Footer Summary
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Item</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Item 1</TableCell>
      <TableCell>$100</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell>Total</TableCell>
      <TableCell>$100</TableCell>
    </TableRow>
  </TableFooter>
</Table>
```

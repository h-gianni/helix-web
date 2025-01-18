# View Switcher Documentation

## Overview
The View Switcher is a component that allows users to toggle between different view types (table and grid layouts) for displaying team member performance data. It implements a consistent view switching mechanism across the application.

## Component Structure

### ViewSwitcher Component
Located in `_performersByCategory.tsx`, the ViewSwitcher is a reusable component that provides a user interface for switching between view types.

```typescript
export const ViewSwitcher = ({ 
  viewType, 
  onViewChange 
}: { 
  viewType: 'table' | 'grid';
  onViewChange: (value: 'table' | 'grid') => void;
}) => (
  <Select 
    value={viewType} 
    onValueChange={onViewChange}
  >
    <SelectTrigger className="w-32">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="table">
        <div className="flex items-center gap-2">
          <TableIcon className="size-4" />
          <span>Table View</span>
        </div>
      </SelectItem>
      <SelectItem value="grid">
        <div className="flex items-center gap-2">
          <LayoutGrid className="size-4" />
          <span>Card View</span>
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
);
```

## Implementation Flow

### 1. State Management
The view type state is managed at the page level:
```typescript
const [viewType, setViewType] = useState<'table' | 'grid'>('table');
```

### 2. Component Hierarchy
The view switching functionality flows through the following components:
- Page Component (e.g., TeamDetailsPage)
  - ViewSwitcher (handles user interaction)
  - TeamPerformanceSummary (receives viewType)
    - TeamPerformanceView (renders different layouts)

### 3. Props Interface
Components involved in view switching implement these props:
```typescript
interface ViewSwitcherProps {
  viewType: 'table' | 'grid';
  onViewChange: (value: 'table' | 'grid') => void;
}

interface TeamPerformanceViewProps {
  // ... other props
  viewType: 'table' | 'grid';
}
```

## Usage

### 1. Basic Implementation
```typescript
import { ViewSwitcher } from "@/app/dashboard/_component/_performersByCategory";

function YourComponent() {
  const [viewType, setViewType] = useState<'table' | 'grid'>('table');

  return (
    <div>
      <ViewSwitcher 
        viewType={viewType} 
        onViewChange={setViewType}
      />
      {/* Your view components */}
    </div>
  );
}
```

### 2. View Rendering
The TeamPerformanceView component renders different layouts based on the viewType:
```typescript
{viewType === 'table' ? (
  <Table>
    {/* Table layout */}
  </Table>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Card layout */}
  </div>
)}
```

## Styling

### Table View
- Uses standard table layout with rows and columns
- Responsive design with horizontal scrolling on small screens
- Consistent cell padding and alignment

### Grid View
- Responsive grid layout using CSS Grid
- Breakpoints:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns
- Gap spacing of 1rem (gap-4)

## Best Practices

1. **State Management**
   - Keep view type state at the highest necessary level
   - Pass view type down through props
   - Use consistent state naming (viewType, setViewType)

2. **Component Usage**
   - Import ViewSwitcher from the central location
   - Place switcher in a logical location in the UI (usually header area)
   - Ensure all child components handle both view types appropriately

3. **Responsiveness**
   - Ensure both views are fully responsive
   - Test view switching on all screen sizes
   - Maintain consistent spacing and alignment

4. **Performance**
   - Avoid unnecessary re-renders by using proper React hooks
   - Optimize grid view for large datasets
   - Implement virtualization for large tables if needed

## Example Integration

```typescript
function TeamDetailsPage() {
  const [viewType, setViewType] = useState<'table' | 'grid'>('table');

  return (
    <div>
      <div className="header">
        <h1>Team Details</h1>
        <div className="actions">
          <ViewSwitcher 
            viewType={viewType} 
            onViewChange={setViewType}
          />
          {/* Other actions */}
        </div>
      </div>
      
      <TeamPerformanceSummary
        members={members}
        viewType={viewType}
        // ... other props
      />
    </div>
  );
}
```
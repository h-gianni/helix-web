import type { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup, ToggleGroupItem } from './index';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  LayoutGrid,
  LayoutList,
  Calendar,
  CalendarDays,
  CalendarRange,
  Smartphone,
  Tablet,
  Monitor,
} from 'lucide-react';

const meta = {
  title: 'Core/ToggleGroup',
  component: ToggleGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A set of two-state buttons that can be toggled together.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: 'The visual style of the toggle group',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'The size of the toggle group',
    },
    type: {
      control: 'radio',
      options: ['single', 'multiple'],
      description: 'Whether the group allows single or multiple selection',
    },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

// Text Alignment Example
export const TextAlignment: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="left">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="justify" aria-label="Justify">
        <AlignJustify className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

// Text Formatting Example
export const TextFormatting: Story = {
  render: () => (
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

// View Options
export const ViewOptions: Story = {
  render: () => (
    <div className="space-y-4">
      <ToggleGroup type="single" defaultValue="grid" size="sm" variant="outline">
        <ToggleGroupItem value="grid">
          <LayoutGrid className="mr-2 size-4" />
          Grid
        </ToggleGroupItem>
        <ToggleGroupItem value="list">
          <LayoutList className="mr-2 size-4" />
          List
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};

// Calendar Views
export const CalendarViews: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="month" variant="outline">
      <ToggleGroupItem value="day">
        <Calendar className="mr-2 size-4" />
        Day
      </ToggleGroupItem>
      <ToggleGroupItem value="week">
        <CalendarDays className="mr-2 size-4" />
        Week
      </ToggleGroupItem>
      <ToggleGroupItem value="month">
        <CalendarRange className="mr-2 size-4" />
        Month
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

// Sizes Example
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <ToggleGroup type="single" size="sm" defaultValue="small">
        <ToggleGroupItem value="small">Small</ToggleGroupItem>
        <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
        <ToggleGroupItem value="large">Large</ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup type="single" size="default" defaultValue="small">
        <ToggleGroupItem value="small">Small</ToggleGroupItem>
        <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
        <ToggleGroupItem value="large">Large</ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup type="single" size="lg" defaultValue="small">
        <ToggleGroupItem value="small">Small</ToggleGroupItem>
        <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
        <ToggleGroupItem value="large">Large</ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};

// Device Selection
export const DeviceSelection: Story = {
  render: () => (
    <ToggleGroup 
      type="multiple" 
      variant="outline"
      defaultValue={["desktop"]}
      className="space-x-1"
    >
      <ToggleGroupItem value="mobile" aria-label="Toggle mobile view">
        <Smartphone className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="tablet" aria-label="Toggle tablet view">
        <Tablet className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="desktop" aria-label="Toggle desktop view">
        <Monitor className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

// Variants Example
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">Default Variant</h3>
        <ToggleGroup type="single" defaultValue="center">
          <ToggleGroupItem value="left">Left</ToggleGroupItem>
          <ToggleGroupItem value="center">Center</ToggleGroupItem>
          <ToggleGroupItem value="right">Right</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Outline Variant</h3>
        <ToggleGroup type="single" defaultValue="center" variant="outline">
          <ToggleGroupItem value="left">Left</ToggleGroupItem>
          <ToggleGroupItem value="center">Center</ToggleGroupItem>
          <ToggleGroupItem value="right">Right</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  ),
};
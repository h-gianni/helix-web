import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './index';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'shimmer'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof Skeleton>;

// Basic skeleton
export const Default: Story = {
  args: {
    className: 'w-[100px]',
  },
};

// Variants
export const Shimmer: Story = {
  args: {
    className: 'w-[100px]',
    variant: 'shimmer',
  },
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Skeleton size="xs" className="w-[100px]" />
      <Skeleton size="sm" className="w-[150px]" />
      <Skeleton size="md" className="w-[200px]" />
      <Skeleton size="lg" className="w-[250px]" />
      <Skeleton size="xl" className="w-[300px]" />
    </div>
  ),
};

// Card loading state
export const CardLoading: Story = {
  render: () => (
    <div className="w-[300px] space-y-5 rounded-lg border p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  ),
};

// Profile loading state
export const ProfileLoading: Story = {
  render: () => (
    <div className="w-[300px] space-y-4 rounded-lg border p-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
    </div>
  ),
};

// Table loading state
export const TableLoading: Story = {
  render: () => (
    <div className="w-[600px] space-y-4">
      <div className="flex items-center space-x-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-[100px]" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          {Array.from({ length: 3 }).map((_, j) => (
            <Skeleton key={j} className="h-4 w-[100px]" />
          ))}
        </div>
      ))}
    </div>
  ),
};

// Feed loading state
export const FeedLoading: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          </div>
          <Skeleton className="h-[200px] w-full rounded-md" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      ))}
    </div>
  ),
};

// Gallery loading state
export const GalleryLoading: Story = {
  render: () => (
    <div className="grid w-[400px] grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton
          key={i}
          className="aspect-square rounded-md"
          variant="shimmer"
        />
      ))}
    </div>
  ),
};
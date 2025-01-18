import type { Meta, StoryObj } from '@storybook/react';
import StarRating from './index';

const meta = {
  title: 'Components/StarRating',
  component: StarRating,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 5, step: 0.5 },
      description: 'Current rating value',
      table: {
        defaultValue: { summary: '0' }
      }
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: 'Size of the stars',
      table: {
        defaultValue: { summary: 'base' }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the rating is interactive or display-only',
      table: {
        defaultValue: { summary: 'false' }
      }
    },
    count: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Number of stars to display',
      table: {
        defaultValue: { summary: '5' }
      }
    },
    showValue: {
      control: 'boolean',
      description: 'Whether to show the numeric value',
      table: {
        defaultValue: { summary: 'true' }
      }
    },
    ratingsCount: {
      control: { type: 'number', min: 0 },
      description: 'Number of ratings submitted',
      table: {
        defaultValue: { summary: 'undefined' }
      }
    },
    showRatingsCount: {
      control: 'boolean',
      description: 'Whether to show the number of ratings',
      table: {
        defaultValue: { summary: 'true' }
      }
    }
  },
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof StarRating>;

// Basic example with controls
export const Default: Story = {
  args: {
    value: 3.5,
    size: 'base',
    disabled: false,
    count: 5,
    showValue: true,
    ratingsCount: 12,
    showRatingsCount: true,
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="w-20 text-sm text-muted-foreground">Small:</span>
        <StarRating value={4} size="sm" disabled ratingsCount={8} />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-20 text-sm text-muted-foreground">Base:</span>
        <StarRating value={4} size="base" disabled ratingsCount={8} />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-20 text-sm text-muted-foreground">Large:</span>
        <StarRating value={4} size="lg" disabled ratingsCount={8} />
      </div>
    </div>
  ),
};

// Interactive vs Display modes
export const InteractionModes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="w-24 text-sm text-muted-foreground">Interactive:</span>
        <StarRating value={3.5} onChange={console.log} ratingsCount={15} />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-24 text-sm text-muted-foreground">Display only:</span>
        <StarRating value={3.5} disabled ratingsCount={15} />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-24 text-sm text-muted-foreground">No ratings:</span>
        <StarRating value={0} disabled ratingsCount={0} />
      </div>
    </div>
  ),
};

// Different values with half stars
export const Values: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="w-24 text-sm text-muted-foreground">5.0 stars:</span>
        <StarRating value={5.0} disabled ratingsCount={42} />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-24 text-sm text-muted-foreground">4.5 stars:</span>
        <StarRating value={4.5} disabled ratingsCount={38} />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-24 text-sm text-muted-foreground">3.7 stars:</span>
        <StarRating value={3.7} disabled ratingsCount={27} />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-24 text-sm text-muted-foreground">2.3 stars:</span>
        <StarRating value={2.3} disabled ratingsCount={15} />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-24 text-sm text-muted-foreground">1.0 stars:</span>
        <StarRating value={1.0} disabled ratingsCount={3} />
      </div>
    </div>
  ),
};

// Display variations
export const DisplayVariations: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="w-32 text-sm text-muted-foreground">Complete:</span>
        <StarRating 
          value={4.5} 
          disabled 
          ratingsCount={125} 
          showValue={true} 
          showRatingsCount={true}
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-32 text-sm text-muted-foreground">No value:</span>
        <StarRating 
          value={4.5} 
          disabled 
          ratingsCount={125} 
          showValue={false} 
          showRatingsCount={true}
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-32 text-sm text-muted-foreground">No count:</span>
        <StarRating 
          value={4.5} 
          disabled 
          ratingsCount={125} 
          showValue={true} 
          showRatingsCount={false}
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-32 text-sm text-muted-foreground">Stars only:</span>
        <StarRating 
          value={4.5} 
          disabled 
          ratingsCount={125} 
          showValue={false} 
          showRatingsCount={false}
        />
      </div>
    </div>
  ),
};

// Usage examples
export const Examples: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Product rating example */}
      <div className="max-w-sm p-4 border rounded-lg space-y-2">
        <h3 className="font-semibold">Product Rating</h3>
        <StarRating value={4.5} disabled ratingsCount={123} />
        <p className="text-sm text-muted-foreground">Based on verified purchases</p>
      </div>

      {/* Feedback form example */}
      <div className="max-w-sm p-4 border rounded-lg space-y-2">
        <h3 className="font-semibold">Leave a Review</h3>
        <StarRating 
          value={0} 
          onChange={console.log} 
          size="lg" 
          showRatingsCount={false}
        />
        <p className="text-sm text-muted-foreground">Click to rate</p>
      </div>

      {/* Compact display example */}
      <div className="max-w-sm p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <span className="font-medium">Customer Satisfaction</span>
          <StarRating 
            value={3.8} 
            size="sm" 
            disabled 
            ratingsCount={427}
            showValue={false}
          />
        </div>
      </div>

      {/* New rating example */}
      <div className="max-w-sm p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <span className="font-medium">New Product</span>
          <StarRating 
            value={0} 
            size="sm" 
            disabled 
            ratingsCount={0}
          />
        </div>
      </div>
    </div>
  ),
};
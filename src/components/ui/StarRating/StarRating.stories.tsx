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
      <div className="flex items-center gap-sm">
        <span className="w-20 text-body">Small:</span>
        <StarRating value={4} size="sm" disabled ratingsCount={8} />
      </div>
      <div className="flex items-center gap-sm">
        <span className="w-20 text-body">Base:</span>
        <StarRating value={4} size="base" disabled ratingsCount={8} />
      </div>
      <div className="flex items-center gap-sm">
        <span className="w-20 text-body">Large:</span>
        <StarRating value={4} size="lg" disabled ratingsCount={8} />
      </div>
    </div>
  ),
};

// Interactive vs Display modes
export const InteractionModes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-sm">
        <span className="w-24 text-body">Interactive:</span>
        <StarRating value={3.5} onChange={console.log} ratingsCount={15} />
      </div>
      <div className="flex items-center gap-sm">
        <span className="w-24 text-body">Display only:</span>
        <StarRating value={3.5} disabled ratingsCount={15} />
      </div>
      <div className="flex items-center gap-sm">
        <span className="w-24 text-body">No ratings:</span>
        <StarRating value={0} disabled ratingsCount={0} />
      </div>
    </div>
  ),
};

// Different values with half stars
export const Values: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-sm">
        <span className="w-24 text-body">5.0 stars:</span>
        <StarRating value={5.0} disabled ratingsCount={42} />
      </div>
      <div className="flex items-center gap-sm">
        <span className="w-24 text-body">4.5 stars:</span>
        <StarRating value={4.5} disabled ratingsCount={38} />
      </div>
      <div className="flex items-center gap-sm">
        <span className="w-24 text-body">3.7 stars:</span>
        <StarRating value={3.7} disabled ratingsCount={27} />
      </div>
      <div className="flex items-center gap-sm">
        <span className="w-24 text-body">2.3 stars:</span>
        <StarRating value={2.3} disabled ratingsCount={15} />
      </div>
      <div className="flex items-center gap-sm">
        <span className="w-24 text-body">1.0 stars:</span>
        <StarRating value={1.0} disabled ratingsCount={3} />
      </div>
    </div>
  ),
};

// Display variations
export const DisplayVariations: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-base">
        <span className="w-32 text-body">Complete:</span>
        <StarRating 
          value={4.5} 
          disabled 
          ratingsCount={125} 
          showValue={true} 
          showRatingsCount={true}
        />
      </div>
      <div className="flex items-center gap-base">
        <span className="w-32 text-body">No value:</span>
        <StarRating 
          value={4.5} 
          disabled 
          ratingsCount={125} 
          showValue={false} 
          showRatingsCount={true}
        />
      </div>
      <div className="flex items-center gap-base">
        <span className="w-32 text-body">No count:</span>
        <StarRating 
          value={4.5} 
          disabled 
          ratingsCount={125} 
          showValue={true} 
          showRatingsCount={false}
        />
      </div>
      <div className="flex items-center gap-base">
        <span className="w-32 text-body">Stars only:</span>
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
      <div className="max-w-sm p-base border rounded-lg space-y-sm">
        <h3 className="text-heading-4">Product Rating</h3>
        <StarRating value={4.5} disabled ratingsCount={123} />
        <p className="text-body">Based on verified purchases</p>
      </div>

      {/* Feedback form example */}
      <div className="max-w-sm p-base border rounded-lg space-y-sm">
        <h3 className="text-heading-4">Leave a Review</h3>
        <StarRating 
          value={0} 
          onChange={console.log} 
          size="lg" 
          showRatingsCount={false}
        />
        <p className="text-link text-primary">Click to rate</p>
      </div>

      {/* Compact display example */}
      <div className="max-w-sm p-base border rounded-lg">
        <div className="flex items-center justify-between gap-base">
          <span className="text-heading-5">Customer Satisfaction</span>
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
      <div className="max-w-sm p-base border rounded-lg">
        <div className="flex items-center justify-between gap-base">
          <span className="text-heading-5">New Product</span>
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
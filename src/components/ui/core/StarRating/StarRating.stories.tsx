import type { Meta, StoryObj } from '@storybook/react';
import StarRating from './index';

const meta = {
  title: 'Core/StarRating',
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

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-sm">
        <span className="ui-text-body w-20">Small:</span>
        <StarRating value={4} size="sm" disabled ratingsCount={8} />
      </div>
      <div className="flex items-center gap-sm">
        <span className="ui-text-body w-20">Base:</span>
        <StarRating value={4} size="base" disabled ratingsCount={8} />
      </div>
      <div className="flex items-center gap-sm">
        <span className="ui-text-body w-20">Large:</span>
        <StarRating value={4} size="lg" disabled ratingsCount={8} />
      </div>
    </div>
  ),
};

export const InteractionModes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-sm">
        <span className="ui-text-body w-24">Interactive:</span>
        <StarRating value={3.5} onChange={console.log} ratingsCount={15} />
      </div>
      <div className="flex items-center gap-sm">
        <span className="ui-text-body w-24">Display only:</span>
        <StarRating value={3.5} disabled ratingsCount={15} />
      </div>
      <div className="flex items-center gap-sm">
        <span className="ui-text-body w-24">No ratings:</span>
        <StarRating value={0} disabled ratingsCount={0} />
      </div>
    </div>
  ),
};

export const Values: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-sm">
        <span className="ui-text-body w-24">5.0 stars:</span>
        <StarRating value={5.0} disabled ratingsCount={42} />
      </div>
      <div className="flex items-center gap-sm">
        <span className="ui-text-body w-24">4.5 stars:</span>
        <StarRating value={4.5} disabled ratingsCount={38} />
      </div>
      <div className="flex items-center gap-sm">
        <span className="ui-text-body w-24">3.7 stars:</span>
        <StarRating value={3.7} disabled ratingsCount={27} />
      </div>
      <div className="flex items-center gap-sm">
        <span className="ui-text-body w-24">2.3 stars:</span>
        <StarRating value={2.3} disabled ratingsCount={15} />
      </div>
      <div className="flex items-center gap-sm">
        <span className="ui-text-body w-24">1.0 stars:</span>
        <StarRating value={1.0} disabled ratingsCount={3} />
      </div>
    </div>
  ),
};

export const DisplayVariations: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-base">
        <span className="ui-text-body w-32">Complete:</span>
        <StarRating 
          value={4.5} 
          disabled 
          ratingsCount={125} 
          showValue={true} 
          showRatingsCount={true}
        />
      </div>
      <div className="flex items-center gap-base">
        <span className="ui-text-body w-32">No value:</span>
        <StarRating 
          value={4.5} 
          disabled 
          ratingsCount={125} 
          showValue={false} 
          showRatingsCount={true}
        />
      </div>
      <div className="flex items-center gap-base">
        <span className="ui-text-body w-32">No count:</span>
        <StarRating 
          value={4.5} 
          disabled 
          ratingsCount={125} 
          showValue={true} 
          showRatingsCount={false}
        />
      </div>
      <div className="flex items-center gap-base">
        <span className="ui-text-body w-32">Stars only:</span>
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

export const Examples: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="max-w-sm p-base border rounded-lg space-y-sm">
        <h3 className="ui-text-heading-4">Product Rating</h3>
        <StarRating value={4.5} disabled ratingsCount={123} />
        <p className="ui-text-body">Based on verified purchases</p>
      </div>

      <div className="max-w-sm p-base border rounded-lg space-y-sm">
        <h3 className="ui-text-heading-4">Leave a Review</h3>
        <StarRating 
          value={0} 
          onChange={console.log} 
          size="lg" 
          showRatingsCount={false}
        />
        <p className="ui-text-link text-primary">Click to rate</p>
      </div>

      <div className="max-w-sm p-base border rounded-lg">
        <div className="flex items-center justify-between gap-base">
          <span className="ui-text-heading-5">Customer Satisfaction</span>
          <StarRating 
            value={3.8} 
            size="sm" 
            disabled 
            ratingsCount={427}
            showValue={false}
          />
        </div>
      </div>

      <div className="max-w-sm p-base border rounded-lg">
        <div className="flex items-center justify-between gap-base">
          <span className="ui-text-heading-5">New Product</span>
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
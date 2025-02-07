import type { Meta, StoryObj } from '@storybook/react';
import { MemberCard } from './index';
import { TrendingUp } from 'lucide-react';

const meta: Meta<typeof MemberCard> = {
  title: 'Composite/MemberCard',
  component: MemberCard,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  args: {
    member: {
      id: '1',
      name: 'John Doe',
      title: 'Senior Developer',
      averageRating: 4.5,
      ratingsCount: 12,
      teamId: 'team-1'
    },
    teams: [
      { id: 'team-1', name: 'Engineering' },
      { id: 'team-2', name: 'Design' }
    ],
    category: {
      label: 'Strong',
      minRating: 4,
      maxRating: 4.5,
      className: 'text-success-500',
      Icon: TrendingUp
    },
    variant: 'default'
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact'],
      description: 'Card layout variant',
      table: {
        defaultValue: { summary: 'default' }
      }
    },
    onDelete: { 
      action: 'deleted',
      description: 'Callback when delete action is triggered'
    },
    onGenerateReview: {
      action: 'generateReview',
      description: 'Callback when generate review action is triggered'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    },
    onNavigate: {
      action: 'navigated',
      description: 'Callback when navigation is triggered'
    }
  },
} satisfies Meta<typeof MemberCard>;

export default meta;
type Story = StoryObj<typeof MemberCard>;

// Default card
export const Default: Story = {
  render: (args) => (
    <div className="w-[350px]">
      <MemberCard {...args} />
    </div>
  ),
};

// Compact variant
export const Compact: Story = {
  args: {
    variant: 'compact'
  },
  render: (args) => (
    <div className="w-[350px]">
      <MemberCard {...args} />
    </div>
  ),
};

// Different performance categories
export const PerformanceCategories: Story = {
  render: (args) => (
    <div className="space-y-4">
      <div className="w-[350px]">
        <MemberCard
          {...args}
          category={{
            label: 'Top',
            minRating: 4.6,
            maxRating: 5,
            className: 'text-success-600',
            Icon: TrendingUp
          }}
          member={{
            id: '2',
            name: 'Sarah Smith',
            title: 'Senior Engineer',
            averageRating: 4.8,
            ratingsCount: 15,
            teamId: 'team-1'
          }}
        />
      </div>
      <div className="w-[350px]">
        <MemberCard
          {...args}
          category={{
            label: 'Solid',
            minRating: 3,
            maxRating: 3.9,
            className: 'text-info-600',
            Icon: TrendingUp
          }}
          member={{
            id: '3',
            name: 'Mike Johnson',
            title: 'Product Manager',
            averageRating: 3.5,
            ratingsCount: 8,
            teamId: 'team-2'
          }}
        />
      </div>
      <div className="w-[350px]">
        <MemberCard
          {...args}
          category={{
            label: 'Lower',
            minRating: 2.1,
            maxRating: 2.9,
            className: 'text-warning-600',
            Icon: TrendingUp
          }}
          member={{
            id: '4',
            name: 'Alex Brown',
            title: 'Developer',
            averageRating: 2.5,
            ratingsCount: 6,
            teamId: 'team-1'
          }}
        />
      </div>
    </div>
  ),
};

// No ratings
export const NoRatings: Story = {
  args: {
    member: {
      id: '1',
      name: 'New Member',
      title: 'Junior Developer',
      averageRating: 0,
      ratingsCount: 0,
      teamId: 'team-1'
    },
    category: {
      label: 'No Ratings',
      minRating: 0,
      maxRating: 0,
      className: 'text-muted-foreground',
      Icon: TrendingUp
    }
  },
  render: (args) => (
    <div className="w-[350px]">
      <MemberCard {...args} />
    </div>
  ),
};

// Without title
export const WithoutTitle: Story = {
  args: {
    member: {
      id: '1',
      name: 'John Doe',
      title: null,
      averageRating: 4.5,
      ratingsCount: 12,
      teamId: 'team-1'
    }
  },
  render: (args) => (
    <div className="w-[350px]">
      <MemberCard {...args} />
    </div>
  ),
};

// Grid example
export const GridExample: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-4 w-[720px]">
      <MemberCard
        {...args}
        member={{
          ...args.member,
          name: 'John Doe',
          title: 'Senior Developer'
        }}
      />
      <MemberCard
        {...args}
        member={{
          ...args.member,
          name: 'Jane Smith',
          title: 'Product Manager',
          teamId: 'team-2'
        }}
      />
      <MemberCard
        {...args}
        member={{
          ...args.member,
          name: 'Mike Johnson',
          title: 'Designer',
          teamId: 'team-2'
        }}
      />
      <MemberCard
        {...args}
        member={{
          ...args.member,
          name: 'Sarah Wilson',
          title: 'Tech Lead'
        }}
      />
    </div>
  ),
};
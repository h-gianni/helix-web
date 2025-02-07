import type { Meta, StoryObj } from '@storybook/react';
import { MembersTable } from './index';
import { TrendingUp } from 'lucide-react';

const performanceCategories = [
  {
    label: "Top",
    minRating: 4.6,
    maxRating: 5,
    className: "text-success-600",
    Icon: TrendingUp,
  },
  {
    label: "Strong",
    minRating: 4,
    maxRating: 4.5,
    className: "text-success-500",
    Icon: TrendingUp,
  },
  {
    label: "Solid",
    minRating: 3,
    maxRating: 3.9,
    className: "text-info-600",
    Icon: TrendingUp,
  },
  {
    label: "Lower",
    minRating: 2.1,
    maxRating: 2.9,
    className: "text-warning-600",
    Icon: TrendingUp,
  },
  {
    label: "Poor",
    minRating: 1,
    maxRating: 2,
    className: "text-danger-600",
    Icon: TrendingUp,
  },
];

const getPerformanceCategory = (rating: number, ratingsCount: number) => {
  if (ratingsCount === 0) {
    return {
      label: "No Ratings",
      minRating: 0,
      maxRating: 0,
      className: "text-muted-foreground",
      Icon: TrendingUp,
    };
  }

  return (
    performanceCategories.find(
      (category) => rating >= category.minRating && rating <= category.maxRating
    ) || {
      label: "Unknown",
      minRating: 0,
      maxRating: 0,
      className: "text-muted-foreground",
      Icon: TrendingUp,
    }
  );
};

const defaultMembers = [
  {
    id: '1',
    name: 'John Doe',
    title: 'Senior Developer',
    averageRating: 4.8,
    ratingsCount: 15,
    teamId: 'team-1'
  },
  {
    id: '2',
    name: 'Jane Smith',
    title: 'Product Manager',
    averageRating: 4.2,
    ratingsCount: 10,
    teamId: 'team-2'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    title: 'UX Designer',
    averageRating: 3.5,
    ratingsCount: 8,
    teamId: 'team-1'
  }
];

const defaultTeams = [
  { id: 'team-1', name: 'Engineering' },
  { id: 'team-2', name: 'Product' }
];

const meta: Meta<typeof MembersTable> = {
  title: 'Composite/MembersTable',
  component: MembersTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    members: defaultMembers,
    teams: defaultTeams,
    showAvatar: true,
    showActions: true,
    performanceCategories,
    getPerformanceCategory
  },
  argTypes: {
          showAvatar: {
      control: 'boolean',
      description: 'Show member avatars',
    },
    showActions: {
      control: 'boolean',
      description: 'Show action menu',
    },
    onDelete: { 
      action: 'deleted',
      description: 'Callback when delete action is triggered'
    },
    onGenerateReview: {
      action: 'generateReview',
      description: 'Callback when generate review action is triggered'
    },
    onNavigate: {
      action: 'navigated',
      description: 'Callback when navigation is triggered'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  },
} satisfies Meta<typeof MembersTable>;

export default meta;
type Story = StoryObj<typeof MembersTable>;

// Default table with all features
export const Default: Story = {
  render: (args) => (
    <div className="w-full">
      <MembersTable {...args} />
    </div>
  ),
};

// Without avatars
export const WithoutAvatars: Story = {
  args: {
    showAvatar: false
  },
  render: (args) => (
    <div className="w-full">
      <MembersTable {...args} />
    </div>
  ),
};

// Without actions
export const WithoutActions: Story = {
  args: {
    showActions: false
  },
  render: (args) => (
    <div className="w-full">
      <MembersTable {...args} />
    </div>
  ),
};

// With no ratings
export const WithNoRatings: Story = {
  args: {
    members: [
      {
        id: '4',
        name: 'New Member',
        title: 'Junior Developer',
        averageRating: 0,
        ratingsCount: 0,
        teamId: 'team-1'
      },
      ...defaultMembers
    ]
  },
  render: (args) => (
    <div className="w-full">
      <MembersTable {...args} />
    </div>
  ),
};

// Empty state
export const Empty: Story = {
  args: {
    members: []
  },
  render: (args) => (
    <div className="w-full">
      <MembersTable {...args} />
    </div>
  ),
};
import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './index';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { CalendarDays, Mail, MoreHorizontal, User } from 'lucide-react';

const meta = {
  title: 'Components/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    openDelay: {
      control: 'number',
      description: 'Delay in ms before showing the hover card',
    },
    closeDelay: {
      control: 'number',
      description: 'Delay in ms before hiding the hover card',
    },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof HoverCard>;

// Basic example
export const Basic: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="neutral">Hover me</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Hover Card</h4>
            <p className="text-sm text-gray-500">
              A simple hover card with basic content.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

// User Profile Card
export const UserProfile: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger className="cursor-pointer">
        <div className="flex items-center gap-2">
          <Avatar>
            <User className="h-4 w-4" />
          </Avatar>
          <span className="text-sm font-medium">olivia@example.com</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar className="h-12 w-12">
            <User className="h-6 w-6" />
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Olivia Martin</h4>
            <p className="text-sm">Product Designer</p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-gray-500">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

// With Different Alignments
export const Alignments: Story = {
  render: () => (
    <div className="flex gap-8 items-center">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="neutral">Align Start</Button>
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-64">
          <p className="text-sm">
            This card is aligned to the start of the trigger.
          </p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="neutral">Align Center</Button>
        </HoverCardTrigger>
        <HoverCardContent align="center" className="w-64">
          <p className="text-sm">
            This card is centered relative to the trigger.
          </p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="neutral">Align End</Button>
        </HoverCardTrigger>
        <HoverCardContent align="end" className="w-64">
          <p className="text-sm">
            This card is aligned to the end of the trigger.
          </p>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

// Rich Content Example
export const RichContent: Story = {
  render: () => (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Button variant="neutral" className="gap-2">
          <MoreHorizontal className="h-4 w-4" />
          View Details
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-96">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <User className="h-6 w-6" />
            </Avatar>
            <div>
              <h4 className="text-sm font-semibold">Project Overview</h4>
              <p className="text-sm text-gray-500">
                Dashboard Redesign
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 opacity-70" />
              <span className="text-sm text-gray-500">Due: Dec 23, 2023</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 opacity-70" />
              <span className="text-sm text-gray-500">8 comments</span>
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">
              Last updated 2 days ago
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

// Interactive Content
export const InteractiveContent: Story = {
  render: () => (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Button variant="neutral">Interactive Preview</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-96">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Interactive Preview</h4>
            <p className="text-sm text-gray-500">
              You can interact with content inside the hover card.
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="neutral" appearance="outline">
              View Details
            </Button>
            <Button size="sm" variant="primary">
              Get Started
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
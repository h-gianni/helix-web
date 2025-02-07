import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea, ScrollBar } from './index';
import { Badge } from '@/components/ui/core/Badge';
import { Calendar, User, MessagesSquare, Star, Settings } from 'lucide-react';

const meta = {
  title: 'Core/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A scrollable container with custom scrollbars that integrate seamlessly with your design.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof ScrollArea>;

const tags = Array.from({ length: 50 }).map((_, i, a) => `Tag ${a.length - i}`);

// Basic Example
export const Basic: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-heading-5 text-text-strongest leading-none">Tags</h4>
        {tags.map((tag) => (
          <div key={tag} className="text-body-small text-text-weakest py-2">
            {tag}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

// Chat Example
export const ChatMessages: Story = {
  render: () => (
    <ScrollArea className="h-96 w-[350px] rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-heading-4 text-text-strongest">Team Chat</h4>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`mb-8 flex gap-2`}
          >
            <div className="size-8 rounded-full bg-surface-sunken flex items-center justify-center">
              <User />
            </div>
            <div className={`flex flex-col`}>
              <div className="text-heading-5 text-text-weakest">
                {i % 2 === 0 ? 'John Doe' : 'Sarah Smith'}
              </div>
              <div className="text-body text-text">
                Message {i + 1} - This is a chat message example.
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

// Horizontal Scroll
export const HorizontalScroll: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border p-4">
      <div className="flex gap-2">
        {Array.from({ length: 50 }).map((_, i) => (
          <Badge variant="default" key={i} className="px-3 py-1">
            Item {i + 1}
          </Badge>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

// Content Cards
export const ContentCards: Story = {
  render: () => (
    <ScrollArea className="h-[500px] w-[400px] rounded-md border p-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="mb-4 rounded-lg border p-4 last:mb-0"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-heading-5 text-text-strongest">Content Card {i + 1}</h4>
            <Star className="text-text-muted" />
          </div>
          <p className="mt-2 text-body text-text-weak">
            This is a sample content card with a longer description that might
            require scrolling to view all the content in the scroll area
            component.
          </p>
          <div className="mt-4 flex gap-2">
            <Badge variant="default" className="px-2 py-0.5">
              <MessagesSquare className="mr-1 size-2" />
              12 comments
            </Badge>
            <Badge variant="default" className="px-2 py-0.5">
              <Calendar className="mr-1 size-2" />
              2 days ago
            </Badge>
          </div>
        </div>
      ))}
    </ScrollArea>
  ),
};

// Settings Panel
export const SettingsPanel: Story = {
  render: () => (
    <ScrollArea className="h-96 w-[300px] rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-base font-medium flex items-center gap-2">
          <Settings />
          Settings
        </h4>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="mb-4 last:mb-0">
            <div className="flex items-center justify-between">
              <div className="text-heading-5 text-text-strongest">Setting {i + 1}</div>
              <div className="text-xs text-text-weakest">Updated</div>
            </div>
            <p className="mt-1 text-body text-text">
              Description for setting {i + 1} with some additional context about
              what this particular setting controls.
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

// Both Scrollbars
export const BothScrollbars: Story = {
  render: () => (
    <ScrollArea className="h-72 w-72 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-heading-5 text-text-strongest">Content with Both Scrollbars</h4>
        <div className="w-[500px]">
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} className="mb-4 text-body-small text-text">
              This is paragraph {i + 1} with some sample text that extends beyond
              the viewport, triggering both vertical and horizontal scrollbars.
              The content is intentionally wide to demonstrate horizontal
              scrolling.
            </p>
          ))}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};
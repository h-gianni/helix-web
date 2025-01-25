import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './index';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Star,
  Heart,
  Bell,
  BellOff,
  Sun,
  Moon,
  Mic,
  MicOff,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A two-state button that can be either on or off.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: 'The visual style of the toggle',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'The size of the toggle',
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof Toggle>;

// Basic Example
export const Basic: Story = {
  render: () => (
    <Toggle>
      <Star className="size-4" />
    </Toggle>
  ),
};

// All Variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-xs">
      <div className="flex gap-xs">
        <Toggle variant="default">
          <Star className="size-4" />
        </Toggle>
        <Toggle variant="outline">
          <Star className="size-4" />
        </Toggle>
      </div>
      <div className="flex gap-xs">
        <Toggle variant="default">Default</Toggle>
        <Toggle variant="outline">Outline</Toggle>
      </div>
    </div>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-xs">
      <Toggle size="sm">
        <Star className="size-3" />
      </Toggle>
      <Toggle size="default">
        <Star className="size-4" />
      </Toggle>
      <Toggle size="lg">
        <Star className="size-5" />
      </Toggle>
    </div>
  ),
};

// Text Editor Example
export const TextEditor: Story = {
  render: () => (
    <div className="flex gap-xs rounded-md p-sm">
      <Toggle variant="outline" size="sm" aria-label="Toggle bold">
        <Bold className="size-4" />
      </Toggle>
      <Toggle variant="outline" size="sm" aria-label="Toggle italic">
        <Italic className="size-4" />
      </Toggle>
      <Toggle variant="outline" size="sm" aria-label="Toggle underline">
        <Underline className="size-4" />
      </Toggle>
      <div className="mx-1 w-px bg-neutral" />
      <Toggle variant="outline" size="sm" aria-label="Toggle align left">
        <AlignLeft className="size-4" />
      </Toggle>
      <Toggle variant="outline" size="sm" aria-label="Toggle align center">
        <AlignCenter className="size-4" />
      </Toggle>
      <Toggle variant="outline" size="sm" aria-label="Toggle align right">
        <AlignRight className="size-4" />
      </Toggle>
      <Toggle variant="outline" size="sm" aria-label="Toggle justify">
        <AlignJustify className="size-4" />
      </Toggle>
    </div>
  ),
};

// With State
export const WithState: Story = {
  render: function Render() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [mic, setMic] = useState(true);

    return (
      <div className="flex flex-col gap-xs">
        <div className="flex items-center gap-sm">
          <Toggle
            pressed={notifications}
            onPressedChange={setNotifications}
            variant="outline"
          >
            {notifications ? (
              <Bell className="size-4" />
            ) : (
              <BellOff className="size-4" />
            )}
          </Toggle>
          <span className="text-body-small text-text-lightest">
            Notifications: {notifications ? 'On' : 'Off'}
          </span>
        </div>

        <div className="flex items-center gap-sm">
          <Toggle
            pressed={darkMode}
            onPressedChange={setDarkMode}
            variant="outline"
          >
            {darkMode ? (
              <Moon className="size-4" />
            ) : (
              <Sun className="size-4" />
            )}
          </Toggle>
          <span className="text-body-small text-text-lightest">
            Theme: {darkMode ? 'Dark' : 'Light'}
          </span>
        </div>

        <div className="flex items-center gap-sm">
          <Toggle
            pressed={mic}
            onPressedChange={setMic}
            variant="outline"
          >
            {mic ? (
              <Mic className="size-4" />
            ) : (
              <MicOff className="size-4" />
            )}
          </Toggle>
          <span className="text-body-small text-text-lightest">
            Microphone: {mic ? 'On' : 'Off'}
          </span>
        </div>
      </div>
    );
  },
};

// Favorites Example
export const Favorites: Story = {
  render: function Render() {
    const [favorites, setFavorites] = useState<number[]>([]);

    const items = [
      { id: 1, title: "Item 1" },
      { id: 2, title: "Item 2" },
      { id: 3, title: "Item 3" },
      { id: 4, title: "Item 4" },
    ];

    const toggleFavorite = (id: number) => {
      setFavorites(prev =>
        prev.includes(id)
          ? prev.filter(itemId => itemId !== id)
          : [...prev, id]
      );
    };

    return (
      <div className="w-[300px] rounded-md border p-4 space-y-sm">
        <h3 className="text-heading-4">Favorite Items</h3>
        <div className="space-y-xs">
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-surface rounded-md border px-sm py-xs"
            >
              <span className='text-body'>{item.title}</span>
              <Toggle
                pressed={favorites.includes(item.id)}
                onPressedChange={() => toggleFavorite(item.id)}
                aria-label={`Toggle favorite for ${item.title}`}
              >
                <Heart
                  className={cn(
                    "size-4",
                    favorites.includes(item.id) && "fill-current text-danger-text"
                  )}
                />
              </Toggle>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverTrigger, PopoverContent } from './index';
import { Button } from '@/components/ui/core/Button';
import { Input } from '@/components/ui/core/Input';
import { Label } from '@/components/ui/core/Label';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/core/Dropdown-menu';
import {
  Settings,
  User,
  Calendar,
  Bell,
  Mail,
  Plus,
  HelpCircle,
} from 'lucide-react';

const meta = {
  title: 'Core/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A popup content that appears relative to a trigger. Based on Radix UI Popover primitive.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof Popover>;

export const Basic: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="neutral" volume="moderate">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-gray-500">Set the dimensions for the layer.</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const SettingsForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="neutral" volume="moderate" size="sm" leadingIcon={<Settings />}>Settings</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <Settings className="h-4 w-4" />
            <div className="space-y-1">
              <h4 className="font-medium leading-none">Appearance</h4>
              <p className="text-sm text-gray-500">Customize the appearance of the app</p>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="theme">Theme</Label>
              <Input id="theme" defaultValue="Light" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="font">Font</Label>
              <Input id="font" defaultValue="Inter" className="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const UserPreview: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="neutral" volume="moderate" size="sm" leadingIcon={<User />}>Profile</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-gray-100 p-2">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-medium">John Doe</h4>
              <p className="text-sm text-gray-500">Product Designer</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm text-gray-500">Email</span>
              </div>
              <p className="text-sm">john@example.com</p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm text-gray-500">Joined</span>
              </div>
              <p className="text-sm">Dec 2021</p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const QuickActions: Story = {
  render: () => (
    <div className="flex gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button volume="moderate" size="sm" leadingIcon={<Plus />}>Add New</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Add User
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Add Email
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Add Notification
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

export const HelpText: Story = {
  render: () => (
    <div className="flex items-center">
      <Label htmlFor="api-key">API Key</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="neutral"
            iconOnly
            size="sm"
            leadingIcon={<HelpCircle />}
            aria-label="Help"
          />
        </PopoverTrigger>
        <PopoverContent side="right" align="start" className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">API Key Information</h4>
            <p className="text-sm text-gray-500">
              Your API key is a unique identifier that authenticates your requests.
              Keep it secure and never share it publicly.
            </p>
          </div>
        </PopoverContent>
      </Popover>
      <Input id="api-key" type="password" className="w-[300px]" />
    </div>
  ),
};
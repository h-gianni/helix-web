import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './index';
import { Label } from '@/components/ui/core/Label';
import { useState } from 'react';
import { Bell, Moon, Sun, Wifi, BellOff, WifiOff } from 'lucide-react';

const meta = {
  title: 'Core/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A control that allows the user to toggle between checked and not checked.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof Switch>;

// Basic example
export const Basic: Story = {
  render: () => <Switch />,
};

// With Label
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

// States
export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="default" />
        <Label htmlFor="default">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="checked" defaultChecked />
        <Label htmlFor="checked">Checked</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="disabled" disabled />
        <Label htmlFor="disabled">Disabled</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="disabled-checked" disabled defaultChecked />
        <Label htmlFor="disabled-checked">Disabled Checked</Label>
      </div>
    </div>
  ),
};

// With Icons
export const WithIcons: Story = {
  render: function Render() {
    const [isNotifications, setIsNotifications] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isWifi, setIsWifi] = useState(true);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="notifications" className="flex items-center space-x-2">
            {isNotifications ? (
              <Bell className="h-4 w-4" />
            ) : (
              <BellOff className="h-4 w-4" />
            )}
            <span>Notifications</span>
          </Label>
          <Switch
            id="notifications"
            checked={isNotifications}
            onCheckedChange={setIsNotifications}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="dark-mode" className="flex items-center space-x-2">
            {isDarkMode ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            <span>Dark Mode</span>
          </Label>
          <Switch
            id="dark-mode"
            checked={isDarkMode}
            onCheckedChange={setIsDarkMode}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="wifi" className="flex items-center space-x-2">
            {isWifi ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
            <span>WiFi</span>
          </Label>
          <Switch
            id="wifi"
            checked={isWifi}
            onCheckedChange={setIsWifi}
          />
        </div>
      </div>
    );
  },
};

// Form Example
export const FormExample: Story = {
  render: function Render() {
    const [formData, setFormData] = useState({
      emailNotifications: true,
      pushNotifications: false,
      marketingEmails: false,
    });

    return (
      <form className="w-[400px] space-y-4 rounded-lg border p-4">
        <div className="space-y-1.5">
          <h3 className="text-lg font-medium">Notification Preferences</h3>
          <p className="text-sm text-gray-500">
            Manage how you want to be notified.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-500">
                Receive emails about your activity.
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={formData.emailNotifications}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, emailNotifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-gray-500">
                Receive push notifications on your device.
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={formData.pushNotifications}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, pushNotifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails">Marketing Emails</Label>
              <p className="text-sm text-gray-500">
                Receive emails about new products and features.
              </p>
            </div>
            <Switch
              id="marketing-emails"
              checked={formData.marketingEmails}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, marketingEmails: checked }))
              }
            />
          </div>
        </div>
      </form>
    );
  },
};
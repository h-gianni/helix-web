import type { Meta, StoryObj } from '@storybook/react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  type AlertDialogContentProps,
} from './index';
import { Button } from '@/components/ui/Button';

const meta = {
  title: 'Components/AlertDialog',
  component: AlertDialogContent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'danger', 'warning', 'neutral'],
      defaultValue: 'primary',
      description: 'The visual style of the alert dialog',
    },
    withIcon: {
      control: 'boolean',
      defaultValue: true,
      description: 'Whether to show the variant-specific icon',
    },
  },
} satisfies Meta<typeof AlertDialogContent>;

export default meta;
type Story = StoryObj<typeof AlertDialogContent>;

// Base example of an alert dialog with configurable icon and variant
export const Default: Story = {
  render: (args) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={args.variant === 'neutral' ? 'neutral' : args.variant}>Launch Alert Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent {...args}>
        <AlertDialogHeader>
          <AlertDialogTitle>Alert Dialog Title</AlertDialogTitle>
          <AlertDialogDescription>
            This is a customizable alert dialog. You can change the variant and toggle the icon
            using the controls below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant={args.variant}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  args: {
    withIcon: true,
    variant: 'primary',
  },
};

// Example showcasing different variants
export const VariantExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="primary">Launch Alert Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent variant="primary">
          <AlertDialogHeader>
            <AlertDialogTitle>New Update Available</AlertDialogTitle>
            <AlertDialogDescription>
              A new version of the application is available. Would you like to update now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Later</AlertDialogCancel>
            <AlertDialogAction variant="primary">Update Now</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="danger">Launch Alert Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent variant="danger">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="danger">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="warning">Launch Alert Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent variant="warning">
          <AlertDialogHeader>
            <AlertDialogTitle>System Resources Low</AlertDialogTitle>
            <AlertDialogDescription>
              Your system is running low on storage. Consider freeing up some space.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ignore</AlertDialogCancel>
            <AlertDialogAction variant="warning">View Details</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="neutral">Launch Alert Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent variant="neutral">
          <AlertDialogHeader>
            <AlertDialogTitle>Help Information</AlertDialogTitle>
            <AlertDialogDescription>
              This feature allows you to manage your workspace settings and preferences.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction variant="neutral">Learn More</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  ),
};

// Example without icon
export const WithoutIcon: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="primary">Launch Alert Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent withIcon={false} variant="primary">
        <AlertDialogHeader>
          <AlertDialogTitle>Simple Alert</AlertDialogTitle>
          <AlertDialogDescription>
            This is a simple alert dialog without an icon.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="primary">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
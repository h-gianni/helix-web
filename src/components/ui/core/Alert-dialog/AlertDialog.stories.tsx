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
  type AlertDialogContentProps
} from './index';
import { Button } from '@/components/ui/core/Button';

type DialogVariant = 'neutral' | 'primary' | 'warning' | 'danger';

const VARIANTS: DialogVariant[] = ['neutral', 'primary', 'warning', 'danger'];

const meta = {
  title: 'Core/AlertDialog',
  component: AlertDialogContent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
      defaultValue: 'neutral' as DialogVariant,
    },
    withIcon: {
      control: 'boolean',
      defaultValue: true,
    },
  },
} satisfies Meta<typeof AlertDialogContent>;

export default meta;
type Story = StoryObj<typeof AlertDialogContent>;

export const Default: Story = {
  render: (args) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={args.variant as DialogVariant}>Open Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent {...args}>
        <AlertDialogHeader>
          <AlertDialogTitle>Alert Dialog Title</AlertDialogTitle>
          <AlertDialogDescription>
            Configurable alert dialog with variant and icon options.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant={args.variant as DialogVariant}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  args: {
    withIcon: true,
    variant: 'neutral' as DialogVariant,
  },
};

const DIALOG_CONFIGS = [
  {
    variant: 'neutral' as DialogVariant,
    title: 'Help Information',
    description: 'Manage your workspace settings and preferences.',
    action: 'Learn More'
  },
  {
    variant: 'primary' as DialogVariant,
    title: 'New Update Available',
    description: 'A new version is available. Update now?',
    action: 'Update Now'
  },
  {
    variant: 'warning' as DialogVariant,
    title: 'System Resources Low',
    description: 'Your system is running low on storage.',
    action: 'View Details'
  },
  {
    variant: 'danger' as DialogVariant,
    title: 'Delete Project',
    description: 'This will permanently delete all project data.',
    action: 'Delete'
  }
] as const;

export const VariantExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {DIALOG_CONFIGS.map(({ variant, title, description, action }) => (
        <AlertDialog key={variant}>
          <AlertDialogTrigger asChild>
            <Button variant={variant}>Open {variant} Dialog</Button>
          </AlertDialogTrigger>
          <AlertDialogContent variant={variant}>
            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant={variant}>{action}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  ),
};
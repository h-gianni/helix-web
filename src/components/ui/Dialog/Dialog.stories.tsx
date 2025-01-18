import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogWithConfig,
  type DialogConfigProps
} from './index';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/Select';
import { useState } from 'react';

const meta = {
  title: 'Components/Dialog',
  component: DialogWithConfig,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    title: 'Dialog Title',
    size: 'base',
    hideClose: false,
    footer: 'one-action',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Dialog title text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    size: {
      control: 'select',
      options: ['base', 'lg', 'xl'],
      description: 'Controls the maximum width of the dialog',
      table: {
        type: { summary: '"base" | "lg" | "xl"' },
        defaultValue: { summary: '"base"' },
      },
    },
    hideClose: {
      control: 'boolean',
      description: 'Whether to hide the close button in the header',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    footer: {
      control: 'select',
      options: ['one-action', 'two-actions', 'three-actions'],
      description: 'Footer configuration type',
      table: {
        type: { summary: '"one-action" | "two-actions" | "three-actions"' },
        defaultValue: { summary: '"one-action"' },
      },
    },
    open: {
      table: {
        disable: true,
      },
    },
    onOpenChange: {
      table: {
        disable: true,
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
    footerConfig: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof DialogWithConfig>;

export default meta;
type Story = StoryObj<typeof DialogWithConfig>;

// Helper function to get footer config based on footer type
const getFooterConfig = (footer: DialogConfigProps['footer'], onClose: () => void) => {
  const config = {
    primaryAction: {
      label: 'Confirm',
      onClick: onClose,
    },
    secondaryAction: footer !== 'one-action' ? {
      label: 'Cancel',
      onClick: onClose,
    } : undefined,
    textAction: footer === 'three-actions' ? {
      label: 'Back',
      onClick: onClose,
    } : undefined,
  };
  return config;
};

export const Configurable: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <DialogWithConfig 
          {...args}
          open={open} 
          onOpenChange={setOpen}
          footerConfig={getFooterConfig(args.footer || 'one-action', () => setOpen(false))}
        >
          <div>
            <DialogDescription>
              This is a configurable dialog. Try changing the controls in the Storybook panel.
            </DialogDescription>
            <div className='space-y-2'>
              <p className='text-heading-4'>Current configuration:</p>
              <ul className='list-disc'>
                <li>Size: <code>{args.size}</code></li>
                <li>Hide close button: <code>{(args.hideClose ?? false).toString()}</code></li>
                <li>Footer type: <code>{args.footer}</code></li>
              </ul>
            </div>
          </div>
        </DialogWithConfig>
      </>
    );
  },
};

export const ComposableDialog: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Composable Dialog</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent size="base">
            <DialogHeader>
              <DialogTitle>Composable Dialog</DialogTitle>
              <DialogDescription>
                This dialog is built using the composable components.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>Content goes here...</p>
            </div>
            <DialogFooter>
              <Button
                variant="neutral"
                appearance="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => setOpen(false)}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  },
};

export const FooterVariants: Story = {
  render: function Render() {
    return (
      <div className='flex gap-4'>
        {(['one-action', 'two-actions', 'three-actions'] as const).map((variant) => {
          const [open, setOpen] = useState(false);
          return (
            <div key={variant}>
              <Button onClick={() => setOpen(true)}>{variant}</Button>
              <DialogWithConfig
                open={open}
                onOpenChange={setOpen}
                title={`${variant} Footer`}
                footer={variant}
                footerConfig={getFooterConfig(variant, () => setOpen(false))}
              >
                <div>
                  <p>
                    This dialog demonstrates the <code>{variant}</code> footer variant.
                  </p>
                  <DialogDescription>
                    The footer configuration and button layout changes based on the selected variant.
                  </DialogDescription>
                </div>
              </DialogWithConfig>
            </div>
          );
        })}
      </div>
    );
  },
};

export const FormExample: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    
    return (
      <>
        <Button onClick={() => setOpen(true)}>Edit Profile</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent size="base">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Name
                </label>
                <Input placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Email
                </label>
                <Input type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Department
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Technical</SelectLabel>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Business</SelectLabel>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Role
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="member">Team Member</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </form>
            <DialogFooter>
              <Button
                variant="neutral"
                appearance="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => setOpen(false)}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  },
};

export const SizeVariants: Story = {
  render: function Render() {
    return (
      <div className='flex gap-4'>
        {(['base', 'lg', 'xl'] as const).map((size) => {
          const [open, setOpen] = useState(false);
          return (
            <div key={size}>
              <Button onClick={() => setOpen(true)}>{size.toUpperCase()} Size</Button>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent size={size}>
                  <DialogHeader>
                    <DialogTitle>{size.toUpperCase()} Dialog</DialogTitle>
                    <DialogDescription>
                      Maximum width is set to {
                        size === 'base' ? '440px' :
                        size === 'lg' ? '640px' :
                        '840px'
                      }.
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <code>
                      size="{size}"
                    </code>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="primary"
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          );
        })}
      </div>
    );
  },
};

export const LongList: Story = {
  render: function Render() {
    return (
      <div className='flex gap-4'>
        {['base', 'lg', 'xl'].map((size) => {
          const [open, setOpen] = useState(false);
          return (
            <div key={size}>
              <Button onClick={() => setOpen(true)}>{size.toUpperCase()} Size</Button>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent size="lg">
                  <DialogHeader>
                    <DialogTitle>Scrollable Content</DialogTitle>
                    <DialogDescription>
                      This dialog demonstrates scrollable content with different widths.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="h-[300px] overflow-y-auto">
                    {Array.from({ length: 20 }, (_, i) => (
                      <p key={i} className="mb-4">
                        Content block {i + 1}
                      </p>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button
                      variant="primary"
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          );
        })}
      </div>
    );
  },
};
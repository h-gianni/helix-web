import type { Meta, StoryObj } from '@storybook/react';
import {
  Drawer,
  DrawerContent,

} from './index';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    position: 'right',
    size: 'base',
    header: 'base',
    withOverlay: true,
    footer: 'none',
    title: 'Drawer Title',
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      defaultValue: 'right',
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg', 'xl'],
      defaultValue: 'base',
    },
    header: {
      control: 'select',
      options: ['none', 'base', 'full'],
      defaultValue: 'base',
    },
    withOverlay: {
      control: 'boolean',
      defaultValue: true,
    },
    footer: {
      control: 'select',
      options: ['none', 'one-action', 'two-actions'],
      defaultValue: 'none',
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
        <Drawer
          {...args}
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <DrawerContent
            position={args.position}
            size={args.size}
            header={args.header}
            footer={args.footer}
            withOverlay={args.withOverlay}
            title="Example Drawer"
            description={args.header === 'full' ? "This is an example description for the drawer." : undefined}
            footerConfig={{
              primaryAction: {
                label: 'Confirm',
                onClick: () => setIsOpen(false),
              },
              secondaryAction: {
                label: 'Cancel',
                onClick: () => setIsOpen(false),
              },
            }}
          >
            <div className="text-[var(--text-base)]">
              <p>This is a configurable drawer. Try adjusting the controls below:</p>
              <ul className="mt-2 space-y-1">
                <li>Position: {args.position}</li>
                <li>Size: {args.size}</li>
                <li>Header: {args.header}</li>
                <li>Overlay: {args.withOverlay ? 'Visible' : 'Hidden'}</li>
                <li>Footer: {args.footer}</li>
              </ul>
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  },
};

export const Positions: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      {(['top', 'right', 'bottom', 'left'] as const).map((position) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
          <div key={position}>
            <Button onClick={() => setIsOpen(true)}>{position} Drawer</Button>
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerContent
                position={position}
                withOverlay={true}
                title={`${position.charAt(0).toUpperCase() + position.slice(1)} Drawer`}
                header="base"
              >
                <p className="text-[var(--text-base)]">
                  This drawer slides in from the {position}.
                </p>
              </DrawerContent>
            </Drawer>
          </div>
        );
      })}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      {(['sm', 'base', 'lg', 'xl'] as const).map((size) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
          <div key={size}>
            <Button onClick={() => setIsOpen(true)}>{size.toUpperCase()} Drawer</Button>
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerContent
                size={size}
                withOverlay={true}
                title={`${size.toUpperCase()} Drawer`}
                header="base"
              >
                <div className="space-y-4">
                  <p className="text-[var(--text-base)]">
                    This is a {size.toUpperCase()} drawer with size set to:
                  </p>
                  <code className="text-sm bg-[var(--surface-hover)] px-2 py-1 rounded">
                    {size === 'sm' && 'var(--drawer-width-sm)'}
                    {size === 'base' && 'var(--drawer-width-base)'}
                    {size === 'lg' && 'var(--drawer-width-lg)'}
                    {size === 'xl' && 'var(--drawer-width-xl)'}
                  </code>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        );
      })}
    </div>
  ),
};

export const HeaderVariants: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      {(['none', 'base', 'full'] as const).map((header) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
          <div key={header}>
            <Button onClick={() => setIsOpen(true)}>{header} header</Button>
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerContent
                header={header}
                withOverlay={true}
                title="Drawer Title"
                description="This is a description that only appears in the full header variant."
              >
                <p className="text-[var(--text-base)]">
                  This drawer uses the {header} header variant.
                </p>
              </DrawerContent>
            </Drawer>
          </div>
        );
      })}
    </div>
  ),
};

export const FooterVariants: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      {(['none', 'one-action', 'two-actions'] as const).map((footer) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
          <div key={footer}>
            <Button onClick={() => setIsOpen(true)}>{footer}</Button>
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerContent
                title={`${footer} Footer`}
                header="base"
                footer={footer}
                withOverlay={true}
                footerConfig={{
                  primaryAction: {
                    label: 'Confirm',
                    onClick: () => setIsOpen(false),
                  },
                  secondaryAction: {
                    label: 'Cancel',
                    onClick: () => setIsOpen(false),
                  },
                }}
              >
                <p className="text-[var(--text-base)]">
                  This drawer demonstrates the {footer} footer variant.
                </p>
              </DrawerContent>
            </Drawer>
          </div>
        );
      })}
    </div>
  ),
};

export const ShoppingCart: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Cart</Button>
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent
            position="right"
            size="base"
            header="full"
            title="Shopping Cart"
            description="Review your items before checkout."
            footer="two-actions"
            withOverlay={true}
            footerConfig={{
              primaryAction: {
                label: 'Checkout',
                onClick: () => setIsOpen(false),
              },
              secondaryAction: {
                label: 'Continue Shopping',
                onClick: () => setIsOpen(false),
              },
            }}
          >
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-md bg-neutral-200" />
                    <div>
                      <p className="font-medium">Product {i + 1}</p>
                      <p className="text-sm text-[var(--text-muted)]">$99.99</p>
                    </div>
                  </div>
                  <Button appearance="text" size="sm">Remove</Button>
                </div>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  },
};
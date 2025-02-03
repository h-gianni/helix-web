import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./index";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const meta = {
  title: "Components/Separator",
  component: Separator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
    },
    variant: {
      control: "select",
      options: ["default", "accent"],
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof Separator>;

// Basic horizontal separator
export const Default: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="text-copy">Content above</div>
      <Separator />
      <div className="text-copy">Content below</div>
    </div>
  ),
};

// Vertical separator
export const Vertical: Story = {
  render: () => (
    <div className="flex h-20 items-center gap-4">
      <div className="text-copy">Left</div>
      <Separator orientation="vertical" />
      <div className="text-copy">Right</div>
    </div>
  ),
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="space-y-2">
        <p className="text-copy-small">Default</p>
        <Separator variant="default" />
      </div>
      <div className="space-y-2">
        <p className="text-copy-small">Accent</p>
        <Separator variant="accent" />
      </div>
    </div>
  ),
};

// In a list context
export const InList: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="space-y-3">
        <h4 className="text-heading-4">Navigation</h4>
        <Separator />
        <ul className="list-none text-copy">
          <li>Home</li>
          <li>About</li>
          <li>Products</li>
          <li>Contact</li>
        </ul>
      </div>
    </div>
  ),
};

// In content sections
export const ContentSections: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div>
        <h3 className="text-heading-4">Section 1</h3>
        <p className="text-copy-small text-weak">Some content for section one goes here.</p>
      </div>
      <Separator />
      <div>
        <h3 className="text-heading-4">Section 2</h3>
        <p className="text-copy-small text-weak">Some content for section two goes here.</p>
      </div>
      <Separator />
      <div>
        <h3 className="text-heading-4">Section 3</h3>
        <p className="text-copy-small text-weak">
          Some content for section three goes here.
        </p>
      </div>
    </div>
  ),
};

// In a card layout
export const InCard: Story = {
  render: () => (
    <Card
      background
      border
      shadow="sm"
    >
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your profile settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="my-4" />
        <div className="flex gap-8 justify-between">
          <div className="w-full space-y-1">
            <p className="text-heading-4">John Do</p>
            <p className="text-copy-small text-link">john@example.com</p>
          </div>
          <div className="flex items-center justify-end gap-0">
            <Button appearance="text" size="sm" variant="neutral">
              Edit
            </Button>
            <Separator orientation="vertical" className="h-4 separator-sm" />
            <Button appearance="text" size="sm" variant="neutral">
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

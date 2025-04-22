import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertTitle, AlertDescription } from "./index";
import {
  AlertCircle,
  Terminal,
  Info,
  XCircle,
  CheckCircle,
} from "lucide-react";

const meta = {
  title: "Components/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive"],
      description: "The visual style of the alert",
    },
    className: {
      control: "text",
      description: "Additional CSS class names",
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

// Basic example
export const Default: Story = {
  args: {
    variant: "default",
  },
  render: (args: Story["args"]) => (
    <Alert {...args}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Default Alert</AlertTitle>
      <AlertDescription>
        This is a default alert — check it out!
      </AlertDescription>
    </Alert>
  ),
};

// Destructive variant
export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
  render: (args: Story["args"]) => (
    <Alert {...args}>
      <XCircle className="h-4 w-4" />
      <AlertTitle>Destructive Alert</AlertTitle>
      <AlertDescription>
        This is a destructive alert — handle with care!
      </AlertDescription>
    </Alert>
  ),
};

// With different icons
export const WithDifferentIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>This alert uses the Info icon.</AlertDescription>
      </Alert>

      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>System Update</AlertTitle>
        <AlertDescription>This alert uses the Terminal icon.</AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          This alert uses the XCircle icon with destructive variant.
        </AlertDescription>
      </Alert>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          This alert uses the CheckCircle icon.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

// Without title
export const WithoutTitle: Story = {
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertDescription>This is an alert without a title.</AlertDescription>
    </Alert>
  ),
};

// Without description
export const WithoutDescription: Story = {
  render: () => (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Alert Title Only</AlertTitle>
    </Alert>
  ),
};

// Without icon
export const WithoutIcon: Story = {
  render: () => (
    <Alert className="pl-4">
      {" "}
      {/* Remove the default left padding for icon */}
      <AlertTitle>Alert without icon</AlertTitle>
      <AlertDescription>
        This is an alert without an icon. Notice we added pl-4 to adjust the
        padding.
      </AlertDescription>
    </Alert>
  ),
};

// Custom styles example
export const CustomStyles: Story = {
  render: () => (
    <Alert className="border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle>Custom Styled Alert</AlertTitle>
      <AlertDescription>
        This alert uses custom color styles via className.
      </AlertDescription>
    </Alert>
  ),
};

// Multiple alerts
export const MultipleAlerts: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Update Available</AlertTitle>
        <AlertDescription>
          A new software update is available for download.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Connection Error</AlertTitle>
        <AlertDescription>
          Unable to connect to the server. Please check your internet
          connection.
        </AlertDescription>
      </Alert>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your changes have been saved successfully.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

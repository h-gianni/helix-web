import type { Meta, StoryObj } from "@storybook/react";
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
} from "./index";
import { Button } from "@/components/ui/core/Button";

type DialogVariant = "neutral" | "primary" | "warning" | "danger";

const VARIANTS: DialogVariant[] = ["neutral", "primary", "warning", "danger"];

const meta = {
  title: "Core/AlertDialog",
  component: AlertDialogContent,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof AlertDialogContent>;

export default meta;
type Story = StoryObj<typeof AlertDialogContent>;

export const Default: Story = {
  render: (args: Story["args"]) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Open Dialog</Button>
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
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

const DIALOG_CONFIGS = [
  {
    variant: "neutral" as DialogVariant,
    title: "Help Information",
    description: "Manage your workspace settings and preferences.",
    action: "Learn More",
  },
  {
    variant: "primary" as DialogVariant,
    title: "New Update Available",
    description: "A new version is available. Update now?",
    action: "Update Now",
  },
  {
    variant: "warning" as DialogVariant,
    title: "System Resources Low",
    description: "Your system is running low on storage.",
    action: "View Details",
  },
  {
    variant: "danger" as DialogVariant,
    title: "Delete Project",
    description: "This will permanently delete all project data.",
    action: "Delete",
  },
] as const;

export const VariantExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {DIALOG_CONFIGS.map(({ variant, title, description, action }) => (
        <AlertDialog key={variant}>
          <AlertDialogTrigger asChild>
            <Button>Open {variant} Dialog</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>{action}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  ),
};

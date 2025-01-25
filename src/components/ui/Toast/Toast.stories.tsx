import type { Meta, StoryObj } from "@storybook/react";
import {
  Toast,
  ToastAction,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./index";
import { useToast } from "./use-toast";
import { Toaster } from "./toaster";
import { Button } from "@/components/ui/Button";
import {
  Bell,
  AlertCircle,
  CheckCircle2,
  Info,
  Download,
  Upload,
  RefreshCcw,
  Trash2,
} from "lucide-react";

const meta = {
  title: "Components/Toast",
  component: Toast,
  decorators: [
    (Story) => (
      <>
        <div className="p-sm h-[600px]">
          <Story />
        </div>
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof Toast>;

export default meta;

export const Examples = {
  render: function Render() {
    const { toast } = useToast();

    return (
      <div className="flex flex-col items-start space-y-sm">
        <Button
          appearance="subtle"
          size="base"
          leadingIcon={<Bell className="size-4" />}
          onClick={() => {
            toast({
              title: "Default Notification",
              description: "This is a default toast message.",
            });
          }}
        >
          Default Toast
        </Button>

        <Button
          variant="danger"
          appearance="subtle"
          leadingIcon={<AlertCircle className="size-4" />}
          onClick={() => {
            toast({
              title: "Error",
              description: "Something went wrong!",
              variant: "destructive",
            });
          }}
        >
          Error Toast
        </Button>

        <Button
          variant="primary"
          appearance="subtle"
          size="base"
          leadingIcon={<CheckCircle2 className="size-4" />}
          onClick={() => {
            toast({
              title: "Success",
              description: "Operation completed successfully.",
              action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
            });
          }}
        >
          Success Toast
        </Button>

        <Button
          variant="neutral"
          appearance="subtle"
          size="base"
          leadingIcon={<Download className="size-4" />}
          onClick={() => {
            toast({
              title: "Download Complete",
              description: "File has been saved to your downloads.",
              action: <ToastAction altText="Open file">Open file</ToastAction>,
            });
          }}
        >
          Action Toast
        </Button>

        <Button
          variant="neutral"
          appearance="subtle"
          size="base"
          leadingIcon={<RefreshCcw className="size-4" />}
          onClick={() => {
            toast({
              title: "Sync Required",
              description: "Your data needs to be synchronized.",
              action: (
                <div className="flex gap-2">
                  <ToastAction altText="Sync now">Sync now</ToastAction>
                  <ToastAction altText="Remind later">Later</ToastAction>
                </div>
              ),
            });
          }}
        >
          Multiple Actions
        </Button>
      </div>
    );
  },
};
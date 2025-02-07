import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarGroup,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/composite/Sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/core/Collapsible";
import { Button } from "@/components/ui/core/Button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/core/Avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/core/Popover";
import {
  Settings,
  Home,
  Users,
  Mail,
  Plus,
  LogOut,
  ChevronRight,
  Bell,
  Star,
  CreditCard,
  FileText,
  Calendar,
  ChevronDown,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

const StoryWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="h-[600px]">
    <SidebarProvider>{children}</SidebarProvider>
  </div>
);
StoryWrapper.displayName = "StoryWrapper";

const meta: Meta<typeof Sidebar> = {
  title: "Composite/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    variant: "sidebar",
    collapsible: "offcanvas",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["sidebar", "floating", "inset"],
      description: "Controls the sidebar presentation style",
      defaultValue: "sidebar",
    },
    collapsible: {
      control: "select",
      options: ["offcanvas", "icon", "none"],
      description: "Controls how the sidebar collapses",
      defaultValue: "offcanvas",
    },
  },
  decorators: [
    (Story) => (
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const UserNav = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          volume="soft"
          className="w-full justify-start p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium">shadcn</span>
                <span className="text-xs text-muted-foreground">
                  m@example.com
                </span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1" align="start" side="right">
        <div className="space-y-0.5">
          <Button
            volume="soft"
            className="w-full justify-start gap-2 text-sm"
          >
            <Star className="h-4 w-4" />
            Upgrade to Pro
          </Button>
          <Button
            volume="soft"
            className="w-full justify-start gap-2 text-sm"
          >
            <Settings className="h-4 w-4" />
            Account
          </Button>
          <Button
            volume="soft"
            className="w-full justify-start gap-2 text-sm"
          >
            <CreditCard className="h-4 w-4" />
            Billing
          </Button>
          <Button
            volume="soft"
            className="w-full justify-start gap-2 text-sm"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </Button>

          <div className="px-2 py-1.5">
            <div className="flex items-center text-sm">
              <Sun className="mr-2 h-4 w-4" />
              <span>Theme</span>
            </div>
            <div className="ml-6 mt-1">
              <ThemeSwitcher />
            </div>
          </div>

          <Button
            volume="soft"
            className="w-full justify-start gap-2 text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const NavMenuItem = ({
  icon: Icon,
  label,
  isActive = false,
  subItems,
  action,
}: {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  subItems?: { label: string; isActive?: boolean }[];
  badge?: string | number;
  action?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  if (subItems) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              isActive={isActive}
              tooltip={label}
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(!isOpen);
              }}
            >
              <Icon />
              <span>{label}</span>
              <ChevronDown
                className={cn(
                  "ml-auto h-4 w-4 shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          {action && <SidebarMenuAction>{action}</SidebarMenuAction>}
        </SidebarMenuItem>
        <CollapsibleContent className="overflow-hidden">
          <SidebarMenuSub>
            {subItems.map((item) => (
              <SidebarMenuSubItem key={item.label}>
                <SidebarMenuSubButton isActive={item.isActive}>
                  {item.label}
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={isActive} tooltip={label}>
        <Icon />
        <span>{label}</span>
      </SidebarMenuButton>
      {action && <SidebarMenuAction>{action}</SidebarMenuAction>}
    </SidebarMenuItem>
  );
};

export const Configurator: Story = {
  render: (args) => {
    // const { isMobile } = useSidebar()
    const [selectedItem] = React.useState("dashboard");

    return (
      <>
        <Sidebar {...args}>
          <SidebarHeader>
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary">
                <span className="text-lg font-bold text-white leading-none">
                  U
                </span>
              </div>
              <span className="text-lg font-semibold">UpScore</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <div className="px-2 pb-2 text-heading-6">Main Menu</div>
              <SidebarMenu>
                <NavMenuItem
                  icon={Home}
                  label="Dashboard"
                  isActive={selectedItem === "dashboard"}
                />
                <NavMenuItem
                  icon={FileText}
                  label="Documents"
                  action={<Plus className="h-4 w-4" />}
                  subItems={[
                    {
                      label: "Contracts",
                      isActive: selectedItem === "contracts",
                    },
                    { label: "Proposals" },
                    { label: "Invoices" },
                  ]}
                />
                <NavMenuItem
                  icon={Users}
                  label="Team"
                  subItems={[{ label: "Members" }, { label: "Permissions" }]}
                />
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
              <div className="px-2 pb-2 text-heading-6">Workspace</div>
              <SidebarMenu>
                <NavMenuItem
                  icon={Calendar}
                  label="Calendar"
                  action={<Plus className="h-4 w-4" />}
                />
                <NavMenuItem
                  icon={Mail}
                  label="Messages"
                  action={<Plus className="h-4 w-4" />}
                />
                <NavMenuItem
                  icon={Settings}
                  label="Settings"
                  subItems={[
                    { label: "Account" },
                    { label: "Notifications" },
                    { label: "Security" },
                  ]}
                />
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <UserNav />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="p-6">
            <div className="mx-auto max-w-4xl space-y-4">
              <SidebarTrigger />
              <h1 className="text-heading-1">Dashboard</h1>
              <p className="text-copy">
                This is a full example of the Sidebar component with all
                available features:
              </p>
              <ul className="list-disc text-copy">
                <li>Multiple collapsible modes (icon, offcanvas, none)</li>
                <li>Nested menu items with collapsible sections</li>
                <li>Menu item actions and tooltips</li>
                <li>Header with minimize trigger</li>
                <li>Multiple menu groups with labels</li>
                <li>Footer with user navigation popover</li>
                <li>Different variant styles (sidebar, floating, inset)</li>
              </ul>
            </div>
          </div>
        </SidebarInset>
      </>
    );
  },
};

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./index";
import { Button } from "@/components/ui/Button";
import {
  User,
  Settings,
  LogOut,
  Mail,
  MessageSquare,
  PlusCircle,
  Shield,
  CreditCard,
  Keyboard,
  Bell,
  Cloud,
  GitBranch,
  Monitor,
  Moon,
  Sun,
  Languages,
  Database,
  Users,
  UserPlus,
  LifeBuoy,
  X,
  Check,
  Columns,
} from "lucide-react";

// Define the generator props type
interface GeneratorProps {
  withIcons: boolean;
  withShortcuts: boolean;
  withGroupTitle: boolean;
  withSections: boolean;
  withRadioSelection: boolean;
  withSubmenus: boolean;
  withDestructiveSection: boolean;
}

// Create a component for the generator
const DropdownMenuGenerator: React.FC<GeneratorProps> = ({
  withIcons,
  withShortcuts,
  withGroupTitle,
  withSections,
  withRadioSelection,
  withSubmenus,
  withDestructiveSection,
}) => {
  const [theme, setTheme] = React.useState("system");

  const renderDefaultItems = () => (
    <>
      <DropdownMenuItem>
        {withIcons && <User />}
        Profile
        {withShortcuts && <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>}
      </DropdownMenuItem>
      <DropdownMenuItem>
        {withIcons && <Settings />}
        Settings
        {withShortcuts && <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>}
      </DropdownMenuItem>
    </>
  );

  const renderRadioGroup = () => (
    <>
      <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
        <DropdownMenuRadioItem value="light">
          {withIcons && <Sun />}
          Light
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="dark">
          {withIcons && <Moon />}
          Dark
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="system">
          {withIcons && <Monitor />}
          System
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </>
  );

  const renderSubmenus = () => (
    <>
        <DropdownMenuSeparator />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          {withIcons && <Shield />}
          Security Options
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem>
            {withIcons && <Mail />}
            Authentication
            {withShortcuts && <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>}
          </DropdownMenuItem>
          <DropdownMenuItem>
            {withIcons && <Shield />}
            Privacy Settings
            {withShortcuts && <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </>
  );

  const renderSections = () => (
    <>
      {withGroupTitle && <DropdownMenuLabel>Account</DropdownMenuLabel>}
      <DropdownMenuGroup>{renderDefaultItems()}</DropdownMenuGroup>

      {withGroupTitle && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Preferences</DropdownMenuLabel>
        </>
      )}
      <DropdownMenuGroup>
        <DropdownMenuItem>
          {withIcons && <Bell />}
          Notifications
          {withShortcuts && <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>}
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {withSections ? (
          renderSections()
        ) : (
          <>
            {withGroupTitle && (
              <DropdownMenuLabel>Menu Items</DropdownMenuLabel>
            )}
            {renderDefaultItems()}
          </>
        )}

        {withRadioSelection && renderRadioGroup()}

        {withSubmenus && renderSubmenus()}

        {withDestructiveSection && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>
              {withIcons && <LogOut />}
              Log out
              {withShortcuts && (
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenuGenerator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    withIcons: {
      control: "boolean",
      description: "Include icons in menu items",
      defaultValue: false,
    },
    withShortcuts: {
      control: "boolean",
      description: "Include keyboard shortcuts",
      defaultValue: false,
    },
    withGroupTitle: {
      control: "boolean",
      description: "Include group titles",
      defaultValue: false,
    },
    withSections: {
      control: "boolean",
      description: "Divide content into sections",
      defaultValue: false,
    },
    withRadioSelection: {
      control: "boolean",
      description: "Include radio selection group",
      defaultValue: false,
    },
    withSubmenus: {
      control: "boolean",
      description: "Include nested submenus",
      defaultValue: false,
    },
    withDestructiveSection: {
      control: "boolean",
      description: "Show destructive actions (like logout) in danger color",
      defaultValue: false,
    },
  },
} satisfies Meta<typeof DropdownMenuGenerator>;

export default meta;
type Story = StoryObj<typeof DropdownMenuGenerator>;

// Generator story
export const Generator: Story = {
  args: {
    withIcons: true,
    withShortcuts: true,
    withGroupTitle: true,
    withSections: true,
    withRadioSelection: false,
    withSubmenus: false,
    withDestructiveSection: false,
  },
};

// Basic Example (No Icons)
export const Basic: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem>
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Settings
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          New Team
          <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

// Simple Example
export const Simple: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <User />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

// With Keyboard Shortcuts
export const WithShortcuts: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PlusCircle />
            New Project
            <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Shield />
            Security
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Keyboard />
            Shortcuts
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

// With Sections
export const WithSections: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Settings</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Preferences</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Languages />
            Language
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Database />
            Data
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem destructive>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

// With Checkboxes
export const WithCheckboxes: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    const [showStatusBar, setShowStatusBar] = React.useState(true);
    const [showActivityBar, setShowActivityBar] = React.useState(false);
    const [showPanel, setShowPanel] = React.useState(false);

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="primary">
            Display Options{" "}
            {showStatusBar || showActivityBar || showPanel ? "(3)" : ""}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Interface Options</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={showStatusBar}
            onCheckedChange={setShowStatusBar}
          >
            <Monitor />
            Status Bar
            {showStatusBar && <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showActivityBar}
            onCheckedChange={setShowActivityBar}
          >
            <Bell />
            Activity Bar
            {showActivityBar && <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showPanel}
            onCheckedChange={setShowPanel}
          >
            <Columns />
            Panel
            {showPanel && <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>}
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setShowStatusBar(true);
              setShowActivityBar(true);
              setShowPanel(true);
            }}
          >
            <Check />
            Show All
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setShowStatusBar(false);
              setShowActivityBar(false);
              setShowPanel(false);
            }}
          >
            <X />
            Hide All
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

// With Radio Selection
export const WithRadioSelection: Story = {
  render: function Render() {
    const [theme, setTheme] = React.useState("system");

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Theme</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Theme Preference</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
            <DropdownMenuRadioItem value="light">
              <Sun />
              Light
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              <Moon />
              Dark
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">
              <Monitor />
              System
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

// With Nested Submenus
export const WithSubmenus: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Manage Team</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <Users />
          Team Overview
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <UserPlus />
            Invite Members
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <Mail />
              Email Invite
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare />
              Message Invite
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <PlusCircle />
              More Options...
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <GitBranch />
            Repositories
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <Cloud />
              Public Repos
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield />
              Private Repos
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

// Complex Example
export const ComplexExample: Story = {
  render: function Render() {
    const [notifications, setNotifications] = React.useState(true);
    const [communication, setCommunication] = React.useState(false);
    const [theme, setTheme] = React.useState("system");

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Settings</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User />
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard />
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings />
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Preferences</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={notifications}
              onCheckedChange={setNotifications}
            >
              <Bell />
              Notifications
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={communication}
              onCheckedChange={setCommunication}
            >
              <MessageSquare />
              Communications
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuRadioItem value="light">
                <Sun />
                Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <Moon />
                Dark
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                <Monitor />
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LifeBuoy />
            Support
          </DropdownMenuItem>
          <DropdownMenuItem destructive>
            <LogOut />
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

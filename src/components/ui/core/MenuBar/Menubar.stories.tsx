import type { Meta, StoryObj } from '@storybook/react';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
} from './index';
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'Core/Menubar',
  component: Menubar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof Menubar>;

// Basic Example
export const Basic: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <PlusCircle />
            New Tab
            <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Plus />
            New Window
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Share
            <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Zoom In
            <MenubarShortcut>⌘+</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Zoom Out
            <MenubarShortcut>⌘-</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

// With Checkboxes and Radio Groups
export const WithSelections: Story = {
  render: function Render() {
    const [showStatusBar, setShowStatusBar] = useState(true);
    const [showActivityBar, setShowActivityBar] = useState(false);
    const [theme, setTheme] = useState("system");

    return (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Options</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem
              checked={showStatusBar}
              onCheckedChange={setShowStatusBar}
            >
              Status Bar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={showActivityBar}
              onCheckedChange={setShowActivityBar}
            >
              Activity Bar
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarLabel>Theme</MenubarLabel>
            <MenubarRadioGroup value={theme} onValueChange={setTheme}>
              <MenubarRadioItem value="light">Light</MenubarRadioItem>
              <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
              <MenubarRadioItem value="system">System</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  },
};

// With Nested Submenus
export const WithSubmenus: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>
          <User className='mr-2' />
          Account
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <User />
            Profile
            <MenubarShortcut>⇧⌘P</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>
              <UserPlus />
              Invite Users
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>
                <Mail />
                Email Invite
              </MenubarItem>
              <MenubarItem>
                <MessageSquare />
                Message Invite
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            <LogOut />
            Logout
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

// Complex Example
export const ComplexExample: Story = {
  render: function Render() {
    const [showToolbar, setShowToolbar] = useState(true);
    const [showGrid, setShowGrid] = useState(false);
    const [layout, setLayout] = useState("default");

    return (
      <Menubar className="w-[600px]">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                <PlusCircle />
                New Project
                <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarSub>
                <MenubarSubTrigger>
                  <Cloud />
                  Open Recent
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Project 1</MenubarItem>
                  <MenubarItem>Project 2</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarItem>
              <Github />
              Push to GitHub
              <MenubarShortcut>⌘G</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem
              checked={showToolbar}
              onCheckedChange={setShowToolbar}
            >
              Toolbar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={showGrid}
              onCheckedChange={setShowGrid}
            >
              Grid
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarLabel>Layout</MenubarLabel>
            <MenubarRadioGroup value={layout} onValueChange={setLayout}>
              <MenubarRadioItem value="default">Default</MenubarRadioItem>
              <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
              <MenubarRadioItem value="expanded">Expanded</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Keyboard />
              Keyboard Shortcuts
            </MenubarItem>
            <MenubarItem>
              <LifeBuoy />
              Support
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  },
};

// With Groups
export const WithGroups: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Settings</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Account</MenubarLabel>
          <MenubarGroup>
            <MenubarItem>
              <User />
              Profile
            </MenubarItem>
            <MenubarItem>
              <CreditCard />
              Billing
            </MenubarItem>
            <MenubarItem>
              <Settings />
              Settings
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarLabel>Team</MenubarLabel>
          <MenubarGroup>
            <MenubarItem>
              <Users />
              Manage Team
            </MenubarItem>
            <MenubarItem>
              <UserPlus />
              Add Member
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};
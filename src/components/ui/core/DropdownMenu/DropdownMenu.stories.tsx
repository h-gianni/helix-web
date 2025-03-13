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
import { Button } from "@/components/ui/core/Button";
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

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
 <span className="ui-icon">{children}</span>
);

interface GeneratorProps {
 withIcons: boolean;
 withShortcuts: boolean;
 withGroupTitle: boolean;
 withSections: boolean;
 withRadioSelection: boolean;
 withSubmenus: boolean;
 withDestructiveSection: boolean;
}

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
       {withIcons && <IconWrapper><User /></IconWrapper>}
       Profile
       {withShortcuts && <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>}
     </DropdownMenuItem>
     <DropdownMenuItem>
       {withIcons && <IconWrapper><Settings /></IconWrapper>}
       Settings
       {withShortcuts && <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>}
     </DropdownMenuItem>
   </>
 );

 const renderRadioGroup = () => (
   <>
     <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
       <DropdownMenuRadioItem value="light">
         {withIcons && <IconWrapper><Sun /></IconWrapper>}
         Light
       </DropdownMenuRadioItem>
       <DropdownMenuRadioItem value="dark">
         {withIcons && <IconWrapper><Moon /></IconWrapper>}
         Dark
       </DropdownMenuRadioItem>
       <DropdownMenuRadioItem value="system">
         {withIcons && <IconWrapper><Monitor /></IconWrapper>}
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
         {withIcons && <IconWrapper><Shield /></IconWrapper>}
         Security Options
       </DropdownMenuSubTrigger>
       <DropdownMenuSubContent>
         <DropdownMenuItem>
           {withIcons && <IconWrapper><Mail /></IconWrapper>}
           Authentication
           {withShortcuts && <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>}
         </DropdownMenuItem>
         <DropdownMenuItem>
           {withIcons && <IconWrapper><Shield /></IconWrapper>}
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
         {withIcons && <IconWrapper><Bell /></IconWrapper>}
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
     <DropdownMenuContent>
       {withSections ? (
         renderSections()
       ) : (
         <>
           {withGroupTitle && <DropdownMenuLabel>Menu Items</DropdownMenuLabel>}
           {renderDefaultItems()}
         </>
       )}

       {withRadioSelection && renderRadioGroup()}

       {withSubmenus && renderSubmenus()}

       {withDestructiveSection && (
         <>
           <DropdownMenuSeparator />
           <DropdownMenuItem destructive>
             {withIcons && <IconWrapper><LogOut /></IconWrapper>}
             Log out
             {withShortcuts && <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>}
           </DropdownMenuItem>
         </>
       )}
     </DropdownMenuContent>
   </DropdownMenu>
 );
};

const meta = {
 title: "Core/DropdownMenu",
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

export const Basic: Story = {
 render: () => (
   <DropdownMenu>
     <DropdownMenuTrigger asChild>
       <Button>Options</Button>
     </DropdownMenuTrigger>
     <DropdownMenuContent>
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

export const Simple: Story = {
 render: () => (
   <DropdownMenu>
     <DropdownMenuTrigger asChild>
       <Button>Menu</Button>
     </DropdownMenuTrigger>
     <DropdownMenuContent>
       <DropdownMenuItem>
         <IconWrapper><User /></IconWrapper>
         Profile
       </DropdownMenuItem>
       <DropdownMenuItem>
         <IconWrapper><Settings /></IconWrapper>
         Settings
       </DropdownMenuItem>
       <DropdownMenuSeparator />
       <DropdownMenuItem destructive>
         <IconWrapper><LogOut /></IconWrapper>
         Log out
       </DropdownMenuItem>
     </DropdownMenuContent>
   </DropdownMenu>
 ),
};

export const WithShortcuts: Story = {
 render: () => (
   <DropdownMenu>
     <DropdownMenuTrigger asChild>
       <Button>Actions</Button>
     </DropdownMenuTrigger>
     <DropdownMenuContent>
       <DropdownMenuGroup>
         <DropdownMenuItem>
           <IconWrapper><PlusCircle /></IconWrapper>
           New Project
           <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
         </DropdownMenuItem>
         <DropdownMenuItem>
           <IconWrapper><Shield /></IconWrapper>
           Security
           <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
         </DropdownMenuItem>
         <DropdownMenuItem>
           <IconWrapper><Keyboard /></IconWrapper>
           Shortcuts
           <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
         </DropdownMenuItem>
       </DropdownMenuGroup>
     </DropdownMenuContent>
   </DropdownMenu>
 ),
};

export const WithSections: Story = {
 render: () => (
   <DropdownMenu>
     <DropdownMenuTrigger asChild>
       <Button>Settings</Button>
     </DropdownMenuTrigger>
     <DropdownMenuContent>
       <DropdownMenuLabel>Preferences</DropdownMenuLabel>
       <DropdownMenuGroup>
         <DropdownMenuItem>
           <IconWrapper><Languages /></IconWrapper>
           Language
         </DropdownMenuItem>
         <DropdownMenuItem>
           <IconWrapper><Bell /></IconWrapper>
           Notifications
         </DropdownMenuItem>
         <DropdownMenuItem>
           <IconWrapper><Database /></IconWrapper>
           Data
         </DropdownMenuItem>
       </DropdownMenuGroup>
       <DropdownMenuSeparator />
       <DropdownMenuLabel>Account</DropdownMenuLabel>
       <DropdownMenuGroup>
         <DropdownMenuItem>
           <IconWrapper><CreditCard /></IconWrapper>
           Billing
         </DropdownMenuItem>
         <DropdownMenuItem destructive>
           <IconWrapper><LogOut /></IconWrapper>
           Log out
         </DropdownMenuItem>
       </DropdownMenuGroup>
     </DropdownMenuContent>
   </DropdownMenu>
 ),
};

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
       <DropdownMenuContent>
         <DropdownMenuLabel>Interface Options</DropdownMenuLabel>
         <DropdownMenuCheckboxItem
           checked={showStatusBar}
           onCheckedChange={setShowStatusBar}
         >
           <IconWrapper><Monitor /></IconWrapper>
           Status Bar
           {showStatusBar && <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>}
         </DropdownMenuCheckboxItem>
         <DropdownMenuCheckboxItem
           checked={showActivityBar}
           onCheckedChange={setShowActivityBar}
         >
           <IconWrapper><Bell /></IconWrapper>
           Activity Bar
           {showActivityBar && <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>}
         </DropdownMenuCheckboxItem>
         <DropdownMenuCheckboxItem
           checked={showPanel}
           onCheckedChange={setShowPanel}
         >
           <IconWrapper><Columns /></IconWrapper>
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
           <IconWrapper><Check /></IconWrapper>
           Show All
         </DropdownMenuItem>
         <DropdownMenuItem
           onClick={() => {
             setShowStatusBar(false);
             setShowActivityBar(false);
             setShowPanel(false);
           }}
         >
           <IconWrapper><X /></IconWrapper>
           Hide All
         </DropdownMenuItem>
       </DropdownMenuContent>
     </DropdownMenu>
   );
 },
};

export const WithRadioSelection: Story = {
 render: function Render() {
   const [theme, setTheme] = React.useState("system");

   return (
     <DropdownMenu>
       <DropdownMenuTrigger asChild>
         <Button>Theme</Button>
       </DropdownMenuTrigger>
       <DropdownMenuContent>
         <DropdownMenuLabel>Theme Preference</DropdownMenuLabel>
         <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
           <DropdownMenuRadioItem value="light">
             <IconWrapper><Sun /></IconWrapper>
             Light
           </DropdownMenuRadioItem>
           <DropdownMenuRadioItem value="dark">
             <IconWrapper><Moon /></IconWrapper>
             Dark
           </DropdownMenuRadioItem>
           <DropdownMenuRadioItem value="system">
             <IconWrapper><Monitor /></IconWrapper>
             System
           </DropdownMenuRadioItem>
         </DropdownMenuRadioGroup>
       </DropdownMenuContent>
     </DropdownMenu>
   );
 },
};

export const WithSubmenus: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Manage Team</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <IconWrapper><Users /></IconWrapper>
          Team Overview
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <IconWrapper><UserPlus /></IconWrapper>
            Invite Members
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <IconWrapper><Mail /></IconWrapper>
              Email Invite
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconWrapper><MessageSquare /></IconWrapper>
              Message Invite
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconWrapper><PlusCircle /></IconWrapper>
              More Options...
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <IconWrapper><GitBranch /></IconWrapper>
            Repositories
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <IconWrapper><Cloud /></IconWrapper>
              Public Repos
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconWrapper><Shield /></IconWrapper>
              Private Repos
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
 };

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
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <IconWrapper><User /></IconWrapper>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconWrapper><CreditCard /></IconWrapper>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconWrapper><Settings /></IconWrapper>
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
              <IconWrapper><Bell /></IconWrapper>
              Notifications
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={communication}
              onCheckedChange={setCommunication}
            >
              <IconWrapper><MessageSquare /></IconWrapper>
              Communications
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuRadioItem value="light">
                <IconWrapper><Sun /></IconWrapper>
                Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <IconWrapper><Moon /></IconWrapper>
                Dark
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                <IconWrapper><Monitor /></IconWrapper>
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <IconWrapper><LifeBuoy /></IconWrapper>
            Support
          </DropdownMenuItem>
          <DropdownMenuItem destructive>
            <IconWrapper><LogOut /></IconWrapper>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};
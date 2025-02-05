import * as React from "react"
import type { Meta, StoryObj } from '@storybook/react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from './index';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Book,
  Code,
  Coffee,
  FileCode,
  Fingerprint,
  Github,
  LayoutDashboard,
  Lightbulb,
  Lock,
  Settings,
  Users,
} from 'lucide-react';

const meta = {
  title: 'Components/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof NavigationMenu>;

// Basic example
export const Basic: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[400px]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-50 to-blue-100 p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <Coffee className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Quick Start
                    </div>
                    <p className="text-sm leading-tight text-gray-600">
                      Get up and running with our platform in minutes.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Introduction" icon={Book}>
                Learn about the core concepts and architecture.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation" icon={FileCode}>
                Step-by-step guides to setting up your system.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
              <ListItem href="/features" title="Overview" icon={Lightbulb}>
                Explore all features and capabilities.
              </ListItem>
              <ListItem href="/features/api" title="API" icon={Code}>
                API documentation and examples.
              </ListItem>
              <ListItem href="/features/security" title="Security" icon={Lock}>
                Security features and best practices.
              </ListItem>
              <ListItem href="/features/analytics" title="Analytics" icon={BarChart}>
                Insights and data analysis tools.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

// Complex Layout
export const ComplexLayout: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Platform</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-4 p-6 w-[600px] md:w-[800px] md:grid-cols-2">
              <div className="grid gap-4">
                <h3 className="font-medium text-lg">Core Features</h3>
                <div className="grid gap-2">
                  <NavigationMenuLink asChild>
                    <a className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                      <LayoutDashboard className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Dashboard</div>
                        <div className="text-sm text-gray-500">Manage your projects</div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <a className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                      <Users className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Team Management</div>
                        <div className="text-sm text-gray-500">Collaborate with your team</div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                </div>
              </div>
              <div className="grid gap-4">
                <h3 className="font-medium text-lg">Advanced Features</h3>
                <div className="grid gap-2">
                  <NavigationMenuLink asChild>
                    <a className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                      <Fingerprint className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Security Center</div>
                        <div className="text-sm text-gray-500">Manage security settings</div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <a className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                      <Settings className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Advanced Settings</div>
                        <div className="text-sm text-gray-500">Configure your workspace</div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              <ListItem href="/blog" title="Blog" icon={Book}>
                Latest updates and articles
              </ListItem>
              <ListItem href="/docs" title="Documentation" icon={FileCode}>
                Guides and references
              </ListItem>
              <ListItem href="https://github.com" title="GitHub" icon={Github}>
                View source code
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

// Simple Navigation
export const SimpleNavigation: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: React.ReactNode;
}

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
  ({ className, title, children, icon: Icon, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100",
              className
            )}
            {...props}
          >
            {Icon && <Icon className="h-4 w-4 mb-2" />}
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-gray-500">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);

ListItem.displayName = "ListItem";
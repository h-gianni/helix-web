"use client";

import React from "react";
import { useTheme } from "next-themes";
import ShowcaseLayout from "@/app/ui-system/components/ShowcaseLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/Card";
import { Button } from "@/components/ui/core/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/core/Tabs";
import { Moon, Sun, Laptop } from "lucide-react";

export default function ThemeShowcase() {
  const { theme, setTheme } = useTheme();

  return (
    <ShowcaseLayout
      title="Theme System"
      description="Dark mode support and theme switching capabilities"
    >
      <div className="space-y-8">
        {/* Introduction Section */}
        <section className="prose max-w-none">
          <p className="text-lg">
            The theme system provides support for light and dark modes, with the
            ability to respect the user&#39;s system preferences. This page
            demonstrates the various theme components and how they can be
            integrated into your application.
          </p>
        </section>

        {/* Theme Toggles Section */}
        <section className="space-y-6">
          <h2 className="heading-2">Theme Controls</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme Toggle</CardTitle>
                <CardDescription>
                  Simple toggle between light and dark modes
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6">
                <ThemeToggle />
                <div className="text-sm text-muted-foreground">
                  Current theme: <span className="font-medium">{theme}</span>
                </div>
                <p className="text-sm">
                  Import and use{" "}
                  <code className="bg-muted rounded p-1">ThemeToggle</code> for
                  a simple switch between light and dark modes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Theme Switcher</CardTitle>
                <CardDescription>
                  Dropdown with light, dark, and system options
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6">
                <ThemeSwitcher />
                <div className="text-sm text-muted-foreground">
                  Current theme: <span className="font-medium">{theme}</span>
                </div>
                <p className="text-sm">
                  Import and use{" "}
                  <code className="bg-muted rounded p-1">ThemeSwitcher</code>{" "}
                  for a dropdown with more theme options.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Manual Theme Selection */}
        <section className="space-y-6">
          <h2 className="heading-2">Manual Theme Selection</h2>

          <Card>
            <CardHeader>
              <CardTitle>Set Theme Programmatically</CardTitle>
              <CardDescription>
                Control the theme with explicit buttons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={() => setTheme("light")}
                  variant={theme === "light" ? "primary" : "outline"}
                  className="flex items-center gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Light Mode
                </Button>

                <Button
                  onClick={() => setTheme("dark")}
                  variant={theme === "dark" ? "primary" : "outline"}
                  className="flex items-center gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Dark Mode
                </Button>

                <Button
                  onClick={() => setTheme("system")}
                  variant={theme === "system" ? "primary" : "outline"}
                  className="flex items-center gap-2"
                >
                  <Laptop className="h-4 w-4" />
                  System Theme
                </Button>
              </div>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Use <code className="bg-muted rounded p-1">useTheme()</code>{" "}
                from next-themes to access and control the current theme
                programmatically.
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Theme Preview Section */}
        <section className="space-y-6">
          <h2 className="heading-2">Theme Preview</h2>

          <Tabs defaultValue="components">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="components">UI Components</TabsTrigger>
              <TabsTrigger value="colors">Color Tokens</TabsTrigger>
            </TabsList>

            <TabsContent value="components" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Sample Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Card Component</CardTitle>
                    <CardDescription>
                      Cards adapt to the current theme
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      This content will appear differently in light and dark
                      modes.
                    </p>
                  </CardContent>
                </Card>

                {/* Sample Buttons */}
                <Card>
                  <CardHeader>
                    <CardTitle>Buttons</CardTitle>
                    <CardDescription>
                      Buttons adapt to the current theme
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <Button variant="primary">Primary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </CardContent>
                </Card>

                {/* Background & Text */}
                <Card>
                  <CardHeader>
                    <CardTitle>Background & Text</CardTitle>
                    <CardDescription>
                      Colors adapt to maintain contrast
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-foreground">Default text color</p>
                      <p className="text-foreground-strong">
                        Strong text color
                      </p>
                      <p className="text-foreground-weak">Weak text color</p>
                      <p className="text-muted-foreground">Muted text color</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="colors" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Color Tokens</CardTitle>
                  <CardDescription>
                    See how color tokens adapt between themes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Color swatches */}
                    <div className="space-y-2">
                      <div className="h-12 rounded-md bg-background border"></div>
                      <p className="text-xs font-medium">Background</p>
                    </div>

                    <div className="space-y-2">
                      <div className="h-12 rounded-md bg-card border"></div>
                      <p className="text-xs font-medium">Card</p>
                    </div>

                    <div className="space-y-2">
                      <div className="h-12 rounded-md bg-primary"></div>
                      <p className="text-xs font-medium">Primary</p>
                    </div>

                    <div className="space-y-2">
                      <div className="h-12 rounded-md bg-neutral-100 dark:bg-neutral-800"></div>
                      <p className="text-xs font-medium">Neutral</p>
                    </div>

                    <div className="space-y-2">
                      <div className="h-12 rounded-md bg-accent"></div>
                      <p className="text-xs font-medium">Accent</p>
                    </div>

                    <div className="space-y-2">
                      <div className="h-12 rounded-md bg-destructive"></div>
                      <p className="text-xs font-medium">Destructive</p>
                    </div>

                    <div className="space-y-2">
                      <div className="h-12 rounded-md bg-success-500"></div>
                      <p className="text-xs font-medium">Success</p>
                    </div>

                    <div className="space-y-2">
                      <div className="h-12 rounded-md bg-warning-500"></div>
                      <p className="text-xs font-medium">Warning</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Implementation Guide */}
        <section className="space-y-6">
          <h2 className="heading-2">Implementation Guide</h2>

          <Card>
            <CardHeader>
              <CardTitle>Adding Theme Support</CardTitle>
              <CardDescription>
                Follow these steps to add theme support to your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">1. Setup ThemeProvider</h3>
                <p className="text-sm">
                  Add the ThemeProvider to your root layout component to enable
                  theme switching throughout your application.
                </p>
                <pre className="bg-muted p-3 rounded-md text-sm font-mono whitespace-pre overflow-x-auto">
                  {`<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
>
  {children}
</ThemeProvider>`}
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  2. Add Theme Switcher Component
                </h3>
                <p className="text-sm">
                  Add one of the theme switching components to your application
                  header or navbar.
                </p>
                <pre className="bg-muted p-3 rounded-md text-sm font-mono whitespace-pre overflow-x-auto">
                  {`import { ThemeSwitcher } from "@/components/ThemeSwitcher";

// In your header component
<header className="flex justify-between">
  <Logo />
  <ThemeSwitcher />
</header>`}
                </pre>
              </div>

              {/* <div className="space-y-2">
                <h3 className="text-lg font-medium">3. Access Theme in Components</h3>
                <p className="text-sm">
                  Use the useTheme hook to access or change the theme in any client component.
                </p>
                <pre className="bg-muted p-3 rounded-md text-sm font-mono whitespace-pre overflow-x-auto">
                  {`"use client";

import { useTheme } from "next-themes";

function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      Current theme: {theme}
      <button onClick={() => setTheme("dark")}>Dark</button>
    </div>
  );
}`}
                </pre>
              </div> */}
            </CardContent>
          </Card>
        </section>
      </div>
    </ShowcaseLayout>
  );
}

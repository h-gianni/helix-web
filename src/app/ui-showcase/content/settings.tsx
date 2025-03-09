"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Laptop, Calendar as CalendarIcon } from "lucide-react";

// Core UI Components
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/core/Avatar";
import { Button } from "@/components/ui/core/Button";
import { Input } from "@/components/ui/core/Input";
import { Label } from "@/components/ui/core/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/core/Select";
import { Separator } from "@/components/ui/core/Separator";
import { Slider } from "@/components/ui/core/Slider";
import { Switch } from "@/components/ui/core/Switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/core/Tabs";
import { Textarea } from "@/components/ui/core/Textarea";

const SettingsExample = () => {
  const { theme, setTheme } = useTheme();
  const [sliderValue, setSliderValue] = useState([30]);

  const priorityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const statusColors = {
    todo: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    "in-progress":
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  };

  return (
    <div className="border rounded-lg overflow-hidden mt-8">
      <div className="bg-card p-6">
        <Tabs defaultValue="account" className="w-full">
          <div className="border-b mb-6">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-0 mb-0">
              <TabsTrigger
                value="account"
                className="py-3 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Account
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="py-3 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Password
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="py-3 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="display"
                className="py-3 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Display
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="account" className="space-y-6 mt-0">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="heading-3">Profile</h3>
                  <p className="body-base">
                    Update your personal information and profile settings
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="first-name-settings">First name</Label>
                      <Input
                        id="first-name-settings"
                        placeholder="John"
                        defaultValue="John"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="last-name-settings">Last name</Label>
                      <Input
                        id="last-name-settings"
                        placeholder="Doe"
                        defaultValue="Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email-settings">Email address</Label>
                    <Input
                      id="email-settings"
                      placeholder="john.doe@example.com"
                      defaultValue="john.doe@example.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="bio-settings">Bio</Label>
                    <Textarea
                      id="bio-settings"
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div className="md:w-72 space-y-4">
                <div>
                  <h3 className="heading-3">Profile Picture</h3>
                  <p className="body-base">
                    Upload a photo for your profile
                  </p>
                </div>

                <div className="flex flex-col gap-4 items-center text-center border rounded-lg p-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl">JD</AvatarFallback>
                  </Avatar>

                  <div className="space-y-2 w-full">
                    <Button variant="outline" className="w-full">
                      Upload New Photo
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-destructive hover:text-destructive"
                    >
                      Remove Photo
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    JPG, GIF or PNG. Max size 2MB.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="heading-3">Account Preferences</h3>
                  <p className="body-base">
                    Manage your account settings and preferences
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="language-settings">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="timezone-settings">Timezone</Label>
                    <Select defaultValue="utc-8">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-12">UTC-12:00</SelectItem>
                        <SelectItem value="utc-8">UTC-08:00</SelectItem>
                        <SelectItem value="utc-5">UTC-05:00</SelectItem>
                        <SelectItem value="utc">UTC+00:00</SelectItem>
                        <SelectItem value="utc+1">UTC+01:00</SelectItem>
                        <SelectItem value="utc+5.5">UTC+05:30</SelectItem>
                        <SelectItem value="utc+8">UTC+08:00</SelectItem>
                        <SelectItem value="utc+9">UTC+09:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </TabsContent>

          <TabsContent value="password" className="space-y-6 mt-0">
            <div className="max-w-lg space-y-4">
              <div>
                <h3 className="heading-3">Change Password</h3>
                <p className="body-base">
                  Update your password to maintain account security
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="current-password-settings">
                    Current password
                  </Label>
                  <Input id="current-password-settings" type="password" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new-password-settings">New password</Label>
                  <Input id="new-password-settings" type="password" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password-settings">
                    Confirm new password
                  </Label>
                  <Input id="confirm-password-settings" type="password" />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Update Password</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="heading-3">Notification Preferences</h3>
                <p className="body-base">
                  Manage how and when you receive notifications
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="body-sm">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="body-sm">
                      Receive notifications on your device
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Updates</Label>
                    <p className="body-sm">
                      Receive updates on your orders
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="body-sm">
                      Receive marketing emails with deals and updates
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Newsletter</Label>
                    <p className="body-sm">
                      Receive our weekly newsletter
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="display" className="space-y-6 mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="heading-3">Display Settings</h3>
                <p className="body-base">
                  Customize your display preferences
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Theme</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("light")}
                      className="gap-2"
                    >
                      <Sun className="h-4 w-4" />
                      Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                      className="gap-2"
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("system")}
                      className="gap-2"
                    >
                      <Laptop className="h-4 w-4" />
                      System
                    </Button>
                  </div>
                </div>
                <Separator />

                <div className="space-y-1.5">
                  <Label>Text Size</Label>
                  <div className="pt-2">
                    <Slider
                      value={sliderValue}
                      onValueChange={setSliderValue}
                      max={100}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Small</span>
                      <span>Default</span>
                      <span>Large</span>
                    </div>
                  </div>
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Animation Reduced Motion</Label>
                    <p className="body-sm">
                      Reduce motion effects in the user interface
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsExample;

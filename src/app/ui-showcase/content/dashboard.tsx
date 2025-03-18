"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import {
  Plus,
  Search,
  Settings,
  FilePenLine,
  Users,
  Home,
  Calendar as CalendarIcon,
  ShoppingCart,
  Mail,
  MessageSquare,
  Bell,
  MoreHorizontal,
  ArrowUpRight,
  BarChart3,
  Activity,
  CreditCard,
  DollarSign,
  Clock,
} from "lucide-react";

// Core UI Components
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/core/Avatar";
import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";
import { Calendar } from "@/components/ui/core/Calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/Card";
import { Checkbox } from "@/components/ui/core/Checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/core/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/core/DropdownMenu";
import { Input } from "@/components/ui/core/Input";
import { Label } from "@/components/ui/core/Label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/core/Popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/core/Select";
import { Separator } from "@/components/ui/core/Separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/Table";

// Demo data
const teamMembers = [
  {
    name: "Michael Scott",
    role: "Regional Manager",
    email: "michael@dundermifflin.com",
    status: "Active",
  },
  {
    name: "Jim Halpert",
    role: "Sales Representative",
    email: "jim@dundermifflin.com",
    status: "Active",
  },
  {
    name: "Pam Beesly",
    role: "Receptionist",
    email: "pam@dundermifflin.com",
    status: "Active",
  },
  {
    name: "Dwight Schrute",
    role: "Assistant to the Regional Manager",
    email: "dwight@dundermifflin.com",
    status: "Active",
  },
  {
    name: "Angela Martin",
    role: "Accountant",
    email: "angela@dundermifflin.com",
    status: "Away",
  },
];

const notifications = [
  {
    id: 1,
    title: "New message",
    description: "You have 3 unread messages",
    time: "5 mins ago",
  },
  {
    id: 2,
    title: "New order",
    description: "Someone purchased your product",
    time: "30 mins ago",
  },
  {
    id: 3,
    title: "Account update",
    description: "Your subscription will expire soon",
    time: "1 hour ago",
  },
  {
    id: 4,
    title: "New follower",
    description: "Someone followed your store",
    time: "2 hours ago",
  },
];

const products = [
  {
    id: 1,
    name: "Mechanical Keyboard",
    price: "$159.99",
    inventory: 45,
    status: "In Stock",
  },
  {
    id: 2,
    name: "Ergonomic Mouse",
    price: "$89.99",
    inventory: 30,
    status: "In Stock",
  },
  {
    id: 3,
    name: "Ultra-wide Monitor",
    price: "$399.99",
    inventory: 0,
    status: "Out of Stock",
  },
  {
    id: 4,
    name: "Wireless Headphones",
    price: "$129.99",
    inventory: 12,
    status: "Low Stock",
  },
  {
    id: 5,
    name: "USB-C Hub",
    price: "$49.99",
    inventory: 50,
    status: "In Stock",
  },
];

type Task = {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: Date;
};

const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Create project documentation",
    status: "todo",
    priority: "high",
    dueDate: new Date(2025, 2, 15),
  },
  {
    id: "task-2",
    title: "Design system components",
    status: "in-progress",
    priority: "medium",
    dueDate: new Date(2025, 2, 10),
  },
  {
    id: "task-3",
    title: "Implement authentication",
    status: "done",
    priority: "high",
    dueDate: new Date(2025, 2, 5),
  },
  {
    id: "task-4",
    title: "Setup CI/CD pipeline",
    status: "todo",
    priority: "medium",
    dueDate: new Date(2025, 2, 20),
  },
  {
    id: "task-5",
    title: "User testing",
    status: "todo",
    priority: "low",
    dueDate: new Date(2025, 2, 25),
  },
];

const DashboardExample = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const priorityColors = {
    low: "bg-primary-lightest text-primary-darker",
    medium: "bg-warning-lightest text-warning-darker",
    high: "bg-destructive-lightest text-destructive-darker",
  };

  const statusColors = {
    todo: "bg-neutral-lighter text-neutral-darkest",
    "in-progress": "bg-accent-lightest text-accent-darker",
    done: "bg-success-lightest text-success-darker",
  };

  return (
    <Card className="mt-8 p-6">
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full xl:w-64 shrink-0 space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="size-8 rounded-md bg-primary flex items-center justify-center">
              <Settings className="size-4 text-primary-foreground" />
            </div>
            <h2 className="heading-3">Command Center</h2>
          </div>

          <div className="space-y-1">
            <Button
              variant={activeTab === "dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <Home />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "team" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("team")}
            >
              <Users />
              Team
            </Button>
            <Button
              variant={activeTab === "projects" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("projects")}
            >
              <FilePenLine />
              Projects
            </Button>
            <Button
              variant={activeTab === "calendar" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("calendar")}
            >
              <CalendarIcon />
              Calendar
            </Button>
            <Button
              variant={activeTab === "products" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("products")}
            >
              <ShoppingCart />
              Products
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="heading-upper">Team</h3>
            <div>
              {teamMembers.slice(0, 3).map((member) => (
                <div
                  key={member.email}
                  className="flex items-center gap-2 rounded-md p-2 hover:bg-secondary"
                >
                  <Avatar className="size-6">
                    <AvatarFallback className="text-xs">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{member.name}</span>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                <Plus className="size-4" />
                Add member
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 size-4 text-foreground-weak" />
              <Input placeholder="Search..." className="pl-8" />
            </div>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="size-4" />
                    <span className="absolute -top-1 -right-1 size-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                      4
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div>
                    <h3 className="font-medium">Notifications</h3>
                    <p className="text-sm text-foreground-weak">
                      You have 4 unread messages.
                    </p>
                  </div>
                  <Separator className="mt-3 mb-2" />
                  <div className="space-y-2 max-h-80 overflow-y-auto pb-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start gap-2 rounded-md p-2 hover:bg-secondary"
                      >
                        <div className="size-8 rounded-full bg-white text-foreground-weak flex items-center justify-center">
                          {notification.title.includes("message") ? (
                            <Mail className="size-4" />
                          ) : notification.title.includes("order") ? (
                            <ShoppingCart className="size-4" />
                          ) : notification.title.includes("account") ? (
                            <Settings className="size-4" />
                          ) : (
                            <Bell className="size-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-medium">
                              {notification.title}
                            </h4>
                            <span className="text-xs text-foreground-weak">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm text-foreground-weak">
                            {notification.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View all notifications
                  </Button>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MessageSquare className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-0">
                    <h3 className="font-medium">Messages</h3>
                    <p className="text-sm text-foreground-weak">
                      Your recent conversations.
                    </p>
                  </div>
                  <Separator className="mt-3 mb-2" />
                  <div className="space-y-2 mb-4">
                    {teamMembers.slice(0, 3).map((member) => (
                      <div
                        key={member.email}
                        className="flex items-start gap-2 rounded-md p-2 hover:bg-secondary"
                      >
                        <Avatar>
                          <AvatarFallback className="text-xs">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-medium">
                              {member.name}
                            </h4>
                            <span className="text-xs text-foreground-weak">
                              5m ago
                            </span>
                          </div>
                          <p className="text-sm text-foreground-weak">
                            Hey, do you have a moment to discuss the project?
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View all messages
                  </Button>
                </PopoverContent>
              </Popover>

              <Separator orientation="vertical" className="h-8 mx-2" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative size-8 rounded-full"
                  >
                    <Avatar className="size-8">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Dashboard Content */}
          {activeTab === "dashboard" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="heading-2">Dashboard</h2>
                <div className="flex items-center gap-2">
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal w-[240px]"
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {date ? date.toDateString() : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => {
                          setDate(date);
                          setIsCalendarOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Refresh</DropdownMenuItem>
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Export</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="relative p-6">
                    <div className="flex justify-between items-start">
                      <div className="-mt-2">
                        <p className="text-foreground text-sm font-medium">
                          Total Revenue
                        </p>
                        <h3 className="heading-1 mt-2">$45,231.89</h3>
                        <p className="text-sm leading-none text-success-darker flex items-center mt-1.5">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          +20.1% from last month
                        </p>
                      </div>
                      <div className="absolute top-4 right-4 bg-success-lightest p-2.5 rounded-full">
                        <Users className="size-4 text-success-darker" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="relative p-6">
                    <div className="flex justify-between items-start">
                      <div className="-mt-2">
                        <p className="text-foreground text-sm font-medium">
                          New Customers
                        </p>
                        <h3 className="heading-1 mt-2">+2,350</h3>
                        <p className="text-sm leading-none text-success-darker flex items-center mt-1.5">
                          <ArrowUpRight className="size-3 mr-1" />
                          +18.7% from last month
                        </p>
                      </div>
                      <div className="absolute top-4 right-4 bg-success-lightest p-2.5 rounded-full">
                        <Users className="size-4 text-success-darker" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="relative p-6">
                    <div className="flex justify-between items-start">
                      <div className="-mt-2">
                        <p className="text-foreground text-sm font-medium">
                          Active Sessions
                        </p>
                        <h3 className="heading-1 mt-2">12,234</h3>
                        <p className="text-sm leading-none text-destructive-darker flex items-center mt-1.5">
                          <ArrowUpRight className="size-3 mr-1 rotate-180" />
                          -2.3% from last hour
                        </p>
                      </div>
                      <div className="absolute top-4 right-4 bg-destructive-lightest p-2.5 rounded-full">
                        <Activity className="size-4 text-destructive-darker" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="relative p-6">
                    <div className="flex justify-between items-start">
                      <div className="-mt-2">
                        <p className="text-foreground text-sm font-medium">
                          Pending Orders
                        </p>
                        <h3 className="heading-1 mt-2">45</h3>
                        <p className="text-sm leading-none text-success-darker flex items-center mt-1.5">
                          <ArrowUpRight className="size-3 mr-1" />
                          +4.5% from yesterday
                        </p>
                      </div>
                      <div className="absolute top-4 right-4 bg-success-lightest p-2.5 rounded-full">
                        <Users className="size-4 text-success-darker" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts & Tasks */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1.5">
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>
                          Monthly revenue for the current year
                        </CardDescription>
                      </div>
                      <Select defaultValue="year">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">Day</SelectItem>
                          <SelectItem value="week">Week</SelectItem>
                          <SelectItem value="month">Month</SelectItem>
                          <SelectItem value="year">Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[240px] w-full bg-primary/5 rounded-md flex items-center justify-center">
                      <div className="text-center p-8 space-y-2">
                        <BarChart3 className="h-10 w-10 mx-auto text-foreground-weak" />
                        <p className="text-foreground-weak">
                          Revenue chart visualization
                        </p>
                        <p className="text-xs text-foreground-weak">
                          (Placeholder for actual chart component)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="space-y-1.5">
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      The latest activity across your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div>
                          <div className="bg-primary/10 p-2 rounded-full">
                            <CreditCard className="size-4 text-primary" />
                          </div>
                        </div>
                        <div>
                          <p className="heading-5">Payment Processed</p>
                          <p className="body-sm">
                            Your payment of $299 has been processed.
                          </p>
                          <p className="text-2xs text-foreground-weak mt-1 text-right">
                            10 minutes ago
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-start gap-4">
                        <div>
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Users className="size-4 text-primary" />
                          </div>
                        </div>
                        <div>
                          <p className="heading-5">New Team Member</p>
                          <p className="body-sm">
                            Sarah Miller joined the design team.
                          </p>
                          <p className="text-2xs text-foreground-weak mt-1 text-right">
                            2 hours ago
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-start gap-4">
                        <div>
                          <div className="bg-primary/10 p-2 rounded-full">
                            <ShoppingCart className="size-4 text-primary" />
                          </div>
                        </div>
                        <div>
                          <p className="heading-5">New Order</p>
                          <p className="body-sm">
                            You received a new order for the Mechanical
                            Keyboard.
                          </p>
                          <p className="text-2xs text-foreground-weak mt-1 text-right">
                            5 hours ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity & Team Members */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1.5">
                        <CardTitle>Team Members</CardTitle>
                        <CardDescription>
                          Manage your team members and their access
                        </CardDescription>
                      </div>
                      <Button size="sm">
                        <Plus className="size-4" />
                        Add Member
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teamMembers.map((member) => (
                          <TableRow key={member.email}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="size-8">
                                  <AvatarFallback className="text-2xs">
                                    {member.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-foreground-strong leading-tight">
                                  {member.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{member.role}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  member.status === "Active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {member.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 p-0"
                                  >
                                    <MoreHorizontal className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem>
                                    View profile
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="heading-2">Products</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 size-4 text-foreground-weak" />
                    <Input
                      placeholder="Search products..."
                      className="pl-8 w-[200px]"
                    />
                  </div>
                  <Button>
                    <Plus className="size-4" />
                    Add Product
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Inventory</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="font-medium">{product.name}</div>
                          </TableCell>
                          <TableCell>{product.price}</TableCell>
                          <TableCell>{product.inventory}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.status === "In Stock"
                                  ? "default"
                                  : product.status === "Low Stock"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 p-0"
                                >
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>
                                  View details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t p-4">
                  <div className="text-sm text-foreground-weak">
                    Showing <strong>5</strong> of <strong>25</strong> products
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}

          {/* Display placeholder for other tabs */}
          {(activeTab === "team" ||
            activeTab === "projects" ||
            activeTab === "calendar") && (
            <div className="h-[400px] w-full flex items-center justify-center border-2 border-dashed rounded-xl">
              <div className="text-center space-y-2 p-8">
                <div className="bg-primary/10 size-12 rounded-full flex items-center justify-center mx-auto">
                  {activeTab === "team" ? (
                    <Users className="size-6 text-primary" />
                  ) : activeTab === "projects" ? (
                    <FilePenLine className="size-6 text-primary" />
                  ) : (
                    <CalendarIcon className="size-6 text-primary" />
                  )}
                </div>
                <h3 className="heading-3">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} View
                </h3>
                <p className="text-foreground-weak">
                  This is a placeholder for the {activeTab} page content.
                </p>
                <Button className="mt-4">
                  Add New{" "}
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to the task. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4 pb-4">
              <div className="space-y-1.5">
                <Label htmlFor="task-title">Title</Label>
                <Input
                  id="task-title"
                  value={selectedTask.title}
                  onChange={(e) =>
                    setSelectedTask({ ...selectedTask, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="task-status">Status</Label>
                <Select
                  value={selectedTask.status}
                  onValueChange={(value) =>
                    setSelectedTask({
                      ...selectedTask,
                      status: value as Task["status"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="task-priority">Priority</Label>
                <Select
                  value={selectedTask.priority}
                  onValueChange={(value) =>
                    setSelectedTask({
                      ...selectedTask,
                      priority: value as Task["priority"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {selectedTask.dueDate
                        ? selectedTask.dueDate.toDateString()
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedTask.dueDate}
                      onSelect={(date) =>
                        setSelectedTask({ ...selectedTask, dueDate: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedTask) {
                  // Update task in the tasks array
                  setTasks(
                    tasks.map((task) =>
                      task.id === selectedTask.id ? selectedTask : task
                    )
                  );
                  setIsEditDialogOpen(false);

                  // Show success toast
                  // toast({
                  //   title: "Task updated",
                  //   description: "Your task has been successfully updated.",
                  // });
                }
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DashboardExample;

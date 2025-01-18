import type { Meta, StoryObj } from '@storybook/react';
import { Home, BarChart3, FileText } from 'lucide-react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from './index';
import { Card } from '@/components/ui/Card';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof Tabs>;

// Main playground story
export const Playground: Story = {
  render: (args) => (
    <Tabs defaultValue="overview">
      <TabsList className="grid grid-cols-3" appearance={args.appearance} width={args.width} size={args.size}>
        <TabsTrigger value="overview" appearance={args.appearance} size={args.size}>
          Overview
        </TabsTrigger>
        <TabsTrigger value="analytics" appearance={args.appearance} size={args.size}>
          Analytics
        </TabsTrigger>
        <TabsTrigger value="reports" appearance={args.appearance} size={args.size}>
          Reports
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card className="p-4">Overview Content</Card>
      </TabsContent>
      <TabsContent value="analytics">
        <Card className="p-4">Analytics Content</Card>
      </TabsContent>
      <TabsContent value="reports">
        <Card className="p-4">Reports Content</Card>
      </TabsContent>
    </Tabs>
  ),
  args: {
    appearance: 'base',
    width: 'full',
    size: 'base',
  },
  argTypes: {
    appearance: {
      control: 'select',
      options: ['base', 'compact'],
    },
    width: {
      control: 'select',
      options: ['inline', 'full'],
    },
    size: {
      control: 'select',
      options: ['base', 'lg'],
    },
  },
};

// Preview different variants
export const Preview: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {/* Base Appearance */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Base Appearance</h3>
        <div className="space-y-4">
          {/* Base Size */}
          <Tabs defaultValue="tab1">
            <TabsList width="full">
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
            <TabsContent value="tab3">Content 3</TabsContent>
          </Tabs>

          {/* Large Size */}
          <Tabs defaultValue="tab1">
            <TabsList width="full" size="lg">
              <TabsTrigger value="tab1" size="lg">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2" size="lg">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3" size="lg">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <Card className="p-4">Content 1</Card>
            </TabsContent>
            <TabsContent value="tab2">
              <Card className="p-4">Content 2</Card>
            </TabsContent>
            <TabsContent value="tab3">
              <Card className="p-4">Content 3</Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Compact Appearance */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Compact Appearance</h3>
        <div className="space-y-4">
          {/* Base Size */}
          <Tabs defaultValue="tab1">
            <TabsList appearance="compact" width="full">
              <TabsTrigger value="tab1" appearance="compact">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2" appearance="compact">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3" appearance="compact">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
            <TabsContent value="tab3">Content 3</TabsContent>
          </Tabs>

          {/* Large Size */}
          <Tabs defaultValue="tab1">
            <TabsList appearance="compact" width="full" size="lg">
              <TabsTrigger value="tab1" appearance="compact" size="lg">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2" appearance="compact" size="lg">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3" appearance="compact" size="lg">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
            <TabsContent value="tab3">Content 3</TabsContent>
          </Tabs>
        </div>
      </div>

      {/* With Icons */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">With Icons</h3>
        <div className="space-y-4">
          {/* Base Appearance */}
          <Tabs defaultValue="overview">
            <TabsList width="full">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Home size={16} />
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 size={16} />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText size={16} />
                Reports
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">Overview Content</TabsContent>
            <TabsContent value="analytics">Analytics Content</TabsContent>
            <TabsContent value="reports">Reports Content</TabsContent>
          </Tabs>

          {/* Compact Appearance */}
          <Tabs defaultValue="overview">
            <TabsList appearance="compact" width="full">
              <TabsTrigger value="overview" appearance="compact" className="flex items-center gap-2">
                <Home size={16} />
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" appearance="compact" className="flex items-center gap-2">
                <BarChart3 size={16} />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" appearance="compact" className="flex items-center gap-2">
                <FileText size={16} />
                Reports
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">Overview Content</TabsContent>
            <TabsContent value="analytics">Analytics Content</TabsContent>
            <TabsContent value="reports">Reports Content</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  ),
};
import type { Meta, StoryObj } from "@storybook/react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./index";

const meta = {
  title: "Core/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Section 1</AccordionTrigger>
        <AccordionContent>
          Content for Section 1.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section 2</AccordionTrigger>
        <AccordionContent>
          Content for Section 2.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Section 3</AccordionTrigger>
        <AccordionContent>
          Content for Section 3.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  args: {
    type: "single",
    collapsible: true,
    defaultValue: "item-1",
    // size: "base",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["single", "multiple"],
      description: "Specifies the accordion behavior.",
    },
    collapsible: {
      control: "boolean",
      description: "Allows all sections to collapse when true.",
    },
    defaultValue: {
      control: "text",
      description: "The default open item.",
    },
    // size: {
    //   control: "select",
    //   options: ["sm", "base", "lg"],
    //   description: "Adjusts the size of the accordion trigger.",
    // },
  },
};


// Example showing multiple Accordion types
export const Types: Story = {
  render: () => (
    <div className="space-y-4">
      <Accordion type="single" collapsible defaultValue="single-1">
        <AccordionItem value="single-1">
          <AccordionTrigger>Single Accordion 1</AccordionTrigger>
          <AccordionContent>Content for Single Accordion 1.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="single-2">
          <AccordionTrigger>Single Accordion 2</AccordionTrigger>
          <AccordionContent>Content for Single Accordion 2.</AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="multiple">
        <AccordionItem value="multiple-1">
          <AccordionTrigger>Multiple Accordion 1</AccordionTrigger>
          <AccordionContent>Content for Multiple Accordion 1.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="multiple-2">
          <AccordionTrigger>Multiple Accordion 2</AccordionTrigger>
          <AccordionContent>Content for Multiple Accordion 2.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

// Example showcasing different content
export const CustomContent: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>Rich Text Section</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2">This is a rich-text content block.</p>
          <ul className="list-disc pl-5">
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Interactive Section</AccordionTrigger>
        <AccordionContent>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Click Me</button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

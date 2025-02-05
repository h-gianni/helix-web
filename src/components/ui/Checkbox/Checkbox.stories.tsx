import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './index';

const meta = {
 title: 'Components/Checkbox',
 component: Checkbox,
 parameters: {
   layout: 'centered',
 },
 tags: ['autodocs'],
 args: {
   label: "Checkbox label",
 },
 argTypes: {
   label: {
     control: 'text',
     description: 'Label text', 
   },
   description: {
     control: 'text',
     description: 'Description text below label',
   },
   checked: {
     control: 'boolean',
   },
   disabled: {
     control: 'boolean',
   },
   required: {
     control: 'boolean',
   },
   onCheckedChange: { action: 'checked' },
 },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
 args: {
   label: "Default checkbox",
 },
};

export const WithDescription: Story = {
 args: {
   label: "Marketing emails",
   description: "Receive emails about new products, features, and more.",
 },
};

export const Required: Story = {
 args: {
   label: "Required field",
   required: true,
 },
};

export const States: Story = {
 render: () => (
   <div className="space-y-4">
     <Checkbox
       label="Checked state"
       defaultChecked
     />
     <Checkbox
       label="Disabled state"
       disabled
     />
     <Checkbox
       label="Disabled and checked"
       disabled
       defaultChecked
     />
   </div>
 ),
};

export const CheckboxGroup: Story = {
 render: () => (
   <div className="space-y-4">
     <Checkbox
       label="Option 1"
       defaultChecked
     />
     <Checkbox
       label="Option 2"
     />
     <Checkbox
       label="Option 3"
     />
   </div>
 ),
};

export const FormExample: Story = {
 render: () => (
   <form className="w-[400px] space-y-6">
     <div className="space-y-4">
       <h4 className="ui-text-heading-3">Sign up for newsletters</h4>
       <div className="space-y-4">
         <Checkbox
           label="Product updates"
           description="Get notified about new features and updates."
           defaultChecked
         />
         <Checkbox
           label="Special offers"
           description="Receive special offers and promotions."
         />
       </div>
     </div>
   </form>
 ),
};
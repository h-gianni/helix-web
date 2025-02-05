import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './index';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import {
  MoreHorizontal,
  ArrowUpDown,
  Copy,
  Pencil,
  Trash,
} from 'lucide-react';

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'base'],
      defaultValue: 'base',
      description: 'Size of the table cells and text',
    },
    showHeader: {
      control: 'boolean',
      defaultValue: true,
      description: 'Show or hide the table header',
      table: {
        category: 'Story Controls', // Indicate this is a story-only control
      },
    },
    zebra: {
      control: 'boolean',
      defaultValue: false,
      description: 'Show alternate row background',
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof Table & StoryProps>;

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
];

type StoryProps = {
  showHeader?: boolean;
};

// Configurator
export const Configurator: Story = {
  render: ({ showHeader, ...args }) => (
    <Table {...args}>
      {showHeader && (
        <TableHeader>
          <TableRow>
            <TableHead className="ui-text-body-small">Invoice</TableHead>
            <TableHead className="ui-text-body-small">Status</TableHead>
            <TableHead className="ui-text-body-small">Method</TableHead>
            <TableHead className="ui-text-body-small text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="ui-text-body-base font-medium">{invoice.invoice}</TableCell>
            <TableCell className="ui-text-body-base">{invoice.paymentStatus}</TableCell>
            <TableCell className="ui-text-body-base">{invoice.paymentMethod}</TableCell>
            <TableCell className="ui-text-body-base text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  args: {
    size: 'base',
    showHeader: true,
    zebra: false,
  },
};

// Basic table
export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption className="ui-text-body-small">A list of recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="ui-text-body-small">Invoice</TableHead>
          <TableHead className="ui-text-body-small">Status</TableHead>
          <TableHead className="ui-text-body-small">Method</TableHead>
          <TableHead className="ui-text-body-small text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="ui-text-body-base font-medium">{invoice.invoice}</TableCell>
            <TableCell className="ui-text-body-base">{invoice.paymentStatus}</TableCell>
            <TableCell className="ui-text-body-base">{invoice.paymentMethod}</TableCell>
            <TableCell className="ui-text-body-base text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

// With selection
export const WithSelection: Story = {
  render: function Selection() {
    const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
    
    const handleSelectAll = (checked: boolean | 'indeterminate') => {
      if (checked === 'indeterminate') return;
      setSelectedRows(checked ? invoices.map(i => i.invoice) : []);
    };
    
    const handleSelectRow = (invoice: string, checked: boolean | 'indeterminate') => {
      if (checked === 'indeterminate') return;
      setSelectedRows(prev => 
        checked 
          ? [...prev, invoice]
          : prev.filter(i => i !== invoice)
      );
    };
    
    const isAllSelected = selectedRows.length === invoices.length;
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox 
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="ui-text-body-small">Invoice</TableHead>
            <TableHead className="ui-text-body-small">Status</TableHead>
            <TableHead className="ui-text-body-small">Method</TableHead>
            <TableHead className="ui-text-body-small text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => {
            const isSelected = selectedRows.includes(invoice.invoice);
            return (
              <TableRow 
                key={invoice.invoice}
                data-state={isSelected ? 'selected' : undefined}
              >
                <TableCell>
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={(checked) => handleSelectRow(invoice.invoice, checked)}
                    aria-label={`Select invoice ${invoice.invoice}`}
                  />
                </TableCell>
                <TableCell className="ui-text-body-base font-medium">{invoice.invoice}</TableCell>
                <TableCell className="ui-text-body-base">{invoice.paymentStatus}</TableCell>
                <TableCell className="ui-text-body-base">{invoice.paymentMethod}</TableCell>
                <TableCell className="ui-text-body-base text-right">{invoice.totalAmount}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  },
};

// With footer
export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="ui-text-body-small">Invoice</TableHead>
          <TableHead className="ui-text-body-small">Status</TableHead>
          <TableHead className="ui-text-body-small">Method</TableHead>
          <TableHead className="ui-text-body-small text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="ui-text-body-base font-medium">{invoice.invoice}</TableCell>
            <TableCell className="ui-text-body-base">{invoice.paymentStatus}</TableCell>
            <TableCell className="ui-text-body-base">{invoice.paymentMethod}</TableCell>
            <TableCell className="ui-text-body-base text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="ui-text-heading-4">Total</TableCell>
          <TableCell className="ui-text-heading-4 text-right">$1,750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

// With actions
export const WithActions: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead aria-hidden="true" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell>{invoice.totalAmount}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    volume="soft" 
                    size="sm"
                    className="table-action-trigger"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copy ID</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem destructive>
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

// With sorting
export const WithSorting: Story = {
  render: function Sorting() {
    const [sorting, setSorting] = React.useState<"none" | "asc" | "desc">("none");
    
    const sortInvoices = (direction: "none" | "asc" | "desc") => {
      setSorting(direction);
    };
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button 
                volume="soft" 
                size="sm"
                onClick={() => sortInvoices(sorting === "asc" ? "desc" : "asc")}
                data-sort-direction={sorting !== "none" ? sorting : undefined}
              >
                <span>Invoice</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button volume="soft" size="sm">
                <span>Status</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Method</TableHead>
            <TableHead>
              <Button volume="soft" size="sm">
                <span>Amount</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell>{invoice.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

// Empty state
export const EmptyState: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="ui-text-body-small">Invoice</TableHead>
          <TableHead className="ui-text-body-small">Status</TableHead>
          <TableHead className="ui-text-body-small">Method</TableHead>
          <TableHead className="ui-text-body-small text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell 
            colSpan={4} 
            className="h-24 text-center ui-text-body-base"
          >
            No results found.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
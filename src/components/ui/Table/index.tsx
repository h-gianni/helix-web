import * as React from "react"
import { cn } from "@/lib/utils"

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  size?: 'sm' | 'base';
  showHeader?: boolean;
  zebra?: boolean;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(({
  className,
  size = 'base',
  // showHeader = true,
  zebra = false,
  ...props
}, ref) => (
  <div className="table-container">
    <table
      ref={ref}
      className={cn(
        "table-base",
        `table-${size}`,
        zebra && "table-zebra",
        className
      )}
      data-size={size}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead 
    ref={ref} 
    className={cn("table-header", className)} 
    {...props} 
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("table-body", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn("table-head", className)}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("table-cell", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("table-footer", className)}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn("group/row table-row", className)}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("table-caption", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  type TableProps,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
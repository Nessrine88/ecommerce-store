
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function Table({
  className,
  ...props
}: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full max-w-full overflow-x-auto overscroll-x-contain rounded-md border"
    >
      <table
        data-slot="table"
        className={cn(
          "w-full min-w-[700px] caption-bottom text-xs sm:text-sm",
          className
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "[&_tr]:border-b [&_tr]:bg-muted/40",
        className
      )}
      {...props}
    />
  );
}

function TableBody({
  className,
  ...props
}: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "[&_tr:last-child]:border-0",
        className
      )}
      {...props}
    />
  );
}

function TableFooter({
  className,
  ...props
}: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

function TableRow({
  className,
  ...props
}: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50",
        "data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  );
}

function TableHead({
  className,
  ...props
}: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-9 px-2 text-left align-middle font-medium",
        "whitespace-nowrap text-foreground",
        "sm:h-10 sm:px-3",
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  );
}

function TableCell({
  className,
  ...props
}: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-2 py-2 align-middle",
        "whitespace-nowrap",
        "sm:px-3 sm:py-3",
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "mt-3 text-xs text-muted-foreground sm:mt-4 sm:text-sm",
        className
      )}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};


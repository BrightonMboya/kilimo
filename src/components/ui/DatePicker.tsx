"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "../../utils/utils";
import Button from "~/components/ui/Button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface Props {
  field: any;
  defaultDate?: Date;
}

export function DatePicker({ field, defaultDate }: Props) {
  const [date, setDate] = React.useState<Date>(
   defaultDate ? defaultDate : new Date()
  );
  const [open, setOpen] = React.useState<boolean>(false);
 

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(e) => {
            setDate(e);
            setOpen(false);
            field.onChange(e);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

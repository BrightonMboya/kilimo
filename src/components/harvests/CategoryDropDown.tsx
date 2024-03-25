"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import Button from "~/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/utils/utils";

const farmers = [
  {
    value: "john_doe",
    label: "John Doe",
  },
  {
    value: "brighton_mboya",
    label: "Brighton Mboya",
  },
  {
    value: "kondwani_ngulube",
    label: "Kondwani Ngulube",
  },
  {
    value: "green_girraffe",
    label: "Green Giraffe",
  },
  {
    value: "hello_world",
    label: "Hello World",
  },

  {
    value: "other",
    label: "Other",
  },
];

export default function CategoryDropDown() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <div className="z-[999] w-full bg-white">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between p-0 px-2 text-sm text-gray-500"
          >
            {value
              ? farmers.find((farmer) => farmer.value === value)?.label
              : "Select farmer..."}

            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search farmer.." className="h-9" />
            <CommandEmpty>No Farmer Found.</CommandEmpty>
            <CommandGroup>
              {farmers.map((farmer) => (
                <CommandItem
                  key={farmer.value}
                  value={farmer.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {farmer.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === farmer.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

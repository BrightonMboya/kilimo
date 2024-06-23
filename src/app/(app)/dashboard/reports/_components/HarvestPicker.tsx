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
import { api } from "~/utils/api";
import { Spinner } from "~/components/ui/LoadingSkeleton";
import { type ControllerRenderProps } from "react-hook-form";
import { type IReportSchema } from "../../reports/_components/schema";
import { ScrollArea } from "~/components/ui/scroll-area";

interface Props {
  field: ControllerRenderProps<IReportSchema, "harvestId">;
}

export default function HarvestPicker({ field }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(field.value || "");

  const { data, isLoading } = api.harvests.harvestsNamesAndId.useQuery();

  React.useEffect(() => {
    if (field.value) {
      setValue(field.value);
    }
  }, [field.value]);

  const selectedHarvestName = value
    ? data?.find((harvest) => harvest.id === value)?.name
    : "Select harvest...";

  return (
    <div className="w-full bg-white">
      {isLoading && <Spinner />}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="w-full">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between p-0 px-2 text-sm text-gray-500"
          >
            {selectedHarvestName}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <ScrollArea>
            <Command className="w-full">
              <CommandInput placeholder="Search harvest." className="h-9" />
              <CommandEmpty>No Harvests found.</CommandEmpty>
              <CommandGroup>
                {data?.map((harvest) => (
                  <CommandItem
                    key={harvest.id}
                    value={harvest.id}
                    onChange={field.onChange}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      field.onChange(harvest.id);
                      setOpen(false);
                    }}
                  >
                    {harvest.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === harvest.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}

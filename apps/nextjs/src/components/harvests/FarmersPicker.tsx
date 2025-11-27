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
import { cn } from "@kilimo/utils";
import { api } from "~/trpc/react";
import { Spinner } from "../ui/LoadingSkeleton";
import { ControllerRenderProps } from "react-hook-form";
import { type HarvestSchemaType } from "@kilimo/api/schemas/harvests";
import { ScrollArea } from "../ui/scroll-area";
import { useParams } from "next/navigation";
interface Props {
  field: ControllerRenderProps<HarvestSchemaType, "farmerId">;
}

export default function FarmersPicker({ field }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const params = useParams();

  const { data, isLoading } = api.farmers.farmersNamesAndIds.useQuery({
    workspaceSlug: params.accountSlug as unknown as string,
  });

  return (
    <div className=" w-full bg-white">
      {isLoading && <Spinner />}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="w-full">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between p-0 px-2 text-sm text-gray-500"
          >
            {value
              ? data?.find((farmer) => farmer.id === value)?.fullName
              : "Select farmer..."}

            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <ScrollArea>
            <Command className="w-full">
              <CommandInput placeholder="Search farmer.." className="h-9" />
              <CommandEmpty>No Farmer Found.</CommandEmpty>
              <CommandGroup>
                {data?.map((farmer) => (
                  <CommandItem
                    key={farmer.id}
                    value={farmer.id}
                    onChange={field.onChange}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      field.onChange(farmer.id);
                      setOpen(false);
                    }}
                  >
                    {farmer.fullName}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === farmer.id ? "opacity-100" : "opacity-0",
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

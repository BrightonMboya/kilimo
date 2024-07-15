"use client";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { format } from "date-fns";
import Button from "~/components/ui/Button";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { type Harvests } from "./HarvestTable";
import { useToast } from "~/utils/hooks/useToast";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";

export const columns: ColumnDef<Harvests>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Harvest Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "name",
    header: "Farmers Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.Farmers.fullName}</div>
    ),
  },
  {
    accessorKey: "crop",
    header: "Crop Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("crop")}</div>,
  },
  {
    accessorKey: "size",
    header: "Harvest size",
    cell: ({ row }) => <div className="capitalize">{row.getValue("size")}</div>,
  },
  {
    accessorKey: "unit",
    header: "unit",
    cell: ({ row }) => <div className="capitalize">{row.getValue("unit")}</div>,
  },
  {
    accessorKey: "date",
    header: "Harvest Date",
    cell: ({ row }) => (
      <div className="capitalize">{format(row.getValue("date"), "PPP")}</div>
    ),
  },

  {
    accessorKey: "inputsUsed",
    header: "Inputs Used",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("inputsUsed")}</div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const harvest = row.original;
      const { toast } = useToast();
      const utils = api.useUtils();
      const params = useParams();
      const { mutateAsync, isLoading } = api.harvests.delete.useMutation({
        onSuccess: () => {
          toast({
            description: "Harvest deleted Successfully",
          });
        },
        onMutate: (harvest) => {
          utils.harvests.fetchByOrganization.invalidate();
          const prevData = utils.harvests.fetchByOrganization.getData();
          const newData = prevData?.filter((h) => h.id !== harvest.harvestId);
          utils.harvests.fetchByOrganization.setData(
            { workspaceSlug: params.accountSlug as unknown as string },
            newData,
          );
          return { prevData };
        },
        onSettled: () => {
          utils.harvests.fetchByOrganization.invalidate();
        },
        onError: (error, data, ctx) => {
          utils.harvests.fetchByOrganization.setData(
            { workspaceSlug: params.accountSlug as unknown as string },
            ctx?.prevData,
          );
          toast({
            description: "Harvest deletion failed",
            variant: "destructive",
            duration: 3000,
          });
        },
      });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(harvest.name);
                toast({
                  description: "Harvest Name copied to clipboard",
                });
              }}
            >
              Copy harvest name
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
              <Link
                href={{
                  pathname: `/dashboard/harvests/view/`,
                  query: { harvestId: harvest.id },
                }}
              >
                View Details
              </Link>
            </DropdownMenuItem> */}
            <DropdownMenuItem>
              <Link
                href={{
                  pathname: `/dashboard/${params.accountSlug}/harvests/edit/`,
                  query: { harvestId: harvest.id },
                }}
              >
                Edit this harvest
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                toast({
                  description: "Harvest deleted",
                });
                mutateAsync({
                  harvestId: harvest.id,
                  workspaceSlug: params.accountSlug as unknown as string,
                });
              }}
              disabled={isLoading}
            >
              <Button variant="destructive" disabled={isLoading} type="button">
                Delete this harvest
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

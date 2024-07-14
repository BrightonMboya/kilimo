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
import type { Farmers } from "@prisma/client";

import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import Button from "~/components/ui/Button";
import { api } from "~/trpc/react";
import DeleteFarmerButton from "./delete-farmer-button";
import { useParams } from "next/navigation";



export const columns: ColumnDef<Farmers>[] = [
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
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("fullName")}</div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("phoneNumber")}</div>
    ),
  },
  {
    accessorKey: "province",
    header: "Province",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("province")}</div>
    ),
  },
  {
    accessorKey: "crops",
    header: "Crops",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("crops")}</div>
    ),
  },
  {
    accessorKey: "quantityCanSupply",
    header: "Quantity Can Supply (Kg)",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("quantityCanSupply")}</div>
    ),
  },
  {
    accessorKey: "farmSize",
    header: "Farm Size(acres)",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("farmSize")}</div>
    ),
  },
  {
    accessorKey: "province",
    header: "Province",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("province")}</div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const farmer = row.original;
      const { mutateAsync } = api.farmers.delete.useMutation({});
      const params = useParams()

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
              onClick={() => navigator.clipboard.writeText(farmer.fullName)}
            >
              Copy farmer name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>View Details</DropdownMenuItem> */}
            <DropdownMenuItem>
              <Link
                href={{
                  pathname: `/dashboard/${params.accountSlug}/farmers/edit`,
                  query: { id: farmer.id },
                }}
              >
                Edit Farmer
              </Link>
            </DropdownMenuItem>

            <DeleteFarmerButton farmerId={farmer.id} />
            <DropdownMenuItem></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

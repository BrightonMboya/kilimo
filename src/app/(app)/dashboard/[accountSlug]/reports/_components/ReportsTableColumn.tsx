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
import Link from "next/link";
import Button from "~/components/ui/Button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { type ReportsTableData } from "./schema";
import { useToast } from "~/utils/hooks/useToast";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { useReportQRModal } from "./reports_qr_modal";

export const columns: ColumnDef<ReportsTableData>[] = [
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
    header: "Report Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "name",
    header: "Harvest Name",
    cell: ({ row }) => <div className="capitalize">{row.original.name}</div>,
  },
  {
    accessorKey: "dateCreated",
    header: "Date Created",
    cell: ({ row }) => (
      <div className="capitalize">
        {format(row.getValue("dateCreated"), "PPP")}
      </div>
    ),
  },

  {
    accessorKey: "finishedTracking",
    header: "Finished Tracking",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("finishedTracking") ? (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>Fully Tracked</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <span>Still Tracking</span>
          </div>
        )}
      </div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const report = row.original;
      const { toast } = useToast();
      const utils = api.useUtils();
      const params = useParams();
      const { setShowReportQRModal, ReportQRModal } = useReportQRModal({
        props: {
          report_id: report.id,
        },
      });

      const finishedTrackingHandler =
        api.reports.markAsFinishedTracking.useMutation({
          onSuccess: () => {
            toast({
              description: "Report marked as complete",
            });
          },
          onMutate: (report) => {
            utils.reports.fetchByOrganization.invalidate();
            const prevData = utils.reports.fetchByOrganization.getData();
            const newData = prevData?.map((r) => {
              if (r.id === report.reportId) {
                return { ...r, finishedTracking: true };
              }
              return r;
            });
            utils.reports.fetchByOrganization.setData(
              { workspaceSlug: params.accountSlug as unknown as string },
              newData,
            );
            return { prevData };
          },
          onSettled: () => {
            utils.reports.fetchByOrganization.invalidate();
            toast({
              description: "Report marked as complete",
            });
          },
          onError: (error, data, ctx) => {
            utils.reports.fetchByOrganization.setData(
              { workspaceSlug: params.accountSlug as unknown as string },
              ctx?.prevData,
            );
            toast({
              description: "Failed to mark the tracking as complete",
              variant: "destructive",
              duration: 3000,
            });
          },
        });
      const { mutateAsync, isPending } = api.reports.delete.useMutation({
        onSuccess: () => {
          toast({
            description: "Report deleted succesfully",
          });
        },
        onMutate: (report) => {
          utils.reports.fetchByOrganization.invalidate();
          const prevData = utils.reports.fetchByOrganization.getData();
          const newData = prevData?.filter((r) => r.id !== report?.reportId);
          utils.reports.fetchByOrganization.setData(
            { workspaceSlug: params.accountSlug as unknown as string },
            newData,
          );
          return { prevData };
        },
        onSettled: () => {
          utils.reports.fetchByOrganization.invalidate();
        },
        onError: (error, data, ctx) => {
          utils.reports.fetchByOrganization.setData(
            { workspaceSlug: params.accountSlug as unknown as string },
            ctx?.prevData,
          );
          toast({
            description: "Report deletion failed",
            variant: "destructive",
            duration: 3000,
          });
        },
      });

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link
                  href={{
                    pathname: `/dashboard/${params.accountSlug}/reports/view`,
                    query: { reportId: report.id },
                  }}
                >
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(report.name);
                  toast({
                    description: "Report Name copied to clipboard",
                  });
                }}
              >
                Copy Report Name
              </DropdownMenuItem>

              <DropdownMenuItem>
                <button
                  type="button"
                  onClick={() => {
                    setShowReportQRModal(true);
                  }}
                >
                  Get QR Code
                </button>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link
                  href={{
                    pathname: `/dashboard/${params.accountSlug}/reports/edit/`,
                    query: { reportId: report.id },
                  }}
                >
                  Continue to track the report
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  finishedTrackingHandler.mutateAsync({
                    reportId: report.id,
                    workspaceSlug: params.accountSlug as unknown as string,
                  });
                }}
                className="cursor-pointer"
              >
                Mark the report as complete
              </DropdownMenuItem>
              {/* <DropdownMenuItem>Download the report as PDF</DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  toast({
                    description: "Report deleted",
                  });
                  mutateAsync({
                    reportId: report.id,
                    workspaceSlug: params.accountSlug as unknown as string,
                  });
                }}
                disabled={isPending}
              >
                <Button
                  variant="destructive"
                  disabled={isPending}
                  type="button"
                >
                  Delete this report
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ReportQRModal />
        </>
      );
    },
  },
];

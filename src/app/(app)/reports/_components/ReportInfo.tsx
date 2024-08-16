"use client";
import React from "react";
import { EmptyState } from "~/components/shared/empty/empty-state";
import LoadingSkeleton from "~/components/ui/LoadingSkeleton";
import { api } from "~/trpc/react";
import { useSearchParams } from "next/navigation";
import PDFReport from "../../dashboard/[accountSlug]/reports/_components/PDFReport";
import { useToast } from "~/utils/hooks";

export default function ReportInfo() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get("reportId");
  const workspaceSlug = searchParams.get("workspaceSlug");

  const { toast } = useToast();
  const { data, isLoading, isError } = api.reports.fetchById.useQuery({
    reportId: reportId as unknown as string,
    workspaceSlug: workspaceSlug as unknown as string,
  });
  isError &&
    toast({
      description: "Failed to load the report",
      variant: "destructive",
    });

  return (
    <main>
      {isLoading && <LoadingSkeleton />}
      {!isLoading && !data && (
        <EmptyState
          // @ts-ignore
          customContent={{
            title: "No Reports found",
            text: "The requested report was not found.",
          }}
        />
      )}

      {!isLoading && data && <PDFReport data={data} />}
    </main>
  );
}

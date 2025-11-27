"use client";
import React from "react";
import { EmptyState } from "~/components/shared/empty/empty-state";
import LoadingSkeleton from "~/components/ui/LoadingSkeleton";
import { api } from "~/trpc/react";
import { useSearchParams, useParams } from "next/navigation";
import PDFReport from "../../_components/PDFReport";

export default function ReportViewPage() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get("reportId");
  const params = useParams();
  const { data, isLoading, isError } = api.reports.fetchById.useQuery({
    reportId: reportId as unknown as string,
    workspaceSlug: params.accountSlug as unknown as string,
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

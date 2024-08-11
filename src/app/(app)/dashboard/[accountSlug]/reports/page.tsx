import LoadingSkeleton from "~/components/ui/LoadingSkeleton";
import { api, HydrateClient } from "~/trpc/server";
import Button from "~/components/ui/Button";
import Link from "next/link";
import Header from "~/components/Layout/header/header";
import { EmptyState } from "~/components/shared/empty/empty-state";
import SuperLink from "~/components/shared/SuperLink";
import ReportsTable from "./_components/ReportsTable";
import { Toaster } from "~/components/ui/Toaster";
import { Suspense } from "react";

export default async function Page(props: { params: { accountSlug: string } }) {
  // const { data, isLoading, isError } = api.reports.fetchByOrganization.useQuery(
  //   { workspaceSlug: params.accountSlug as unknown as string },
  // );
  const reports = await api.reports.fetchByOrganization({
    workspaceSlug: props.params.accountSlug,
  });
  return (
    <HydrateClient>
      <main className="">
        <Toaster />
        <Header classNames="" title="Reports">
          <div className="w-full lg:flex lg:justify-end">
            <SuperLink
              href={`/dashboard/${props.params.accountSlug}/reports/new`}
            >
              <Button className="w-full lg:w-fit ">New Report</Button>
            </SuperLink>
          </div>
        </Header>
        <Suspense fallback={<LoadingSkeleton />}>
          {reports.length === 0 && (
            <EmptyState
              customContent={{
                title: "No Reports found",
                text: "Reports are the core of your food traceability, Create your first Report now!",
                newButtonRoute: `/dashboard/${props.params.accountSlug}/reports/new`,
                newButtonContent: "New Report",
              }}
            />
          )}
          {reports.length !== 0 && <ReportsTable data={reports} />}
        </Suspense>
      </main>
    </HydrateClient>
  );
}

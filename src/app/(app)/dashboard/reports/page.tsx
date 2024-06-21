"use client";

import LoadingSkeleton from "~/components/ui/LoadingSkeleton";
import { api } from "~/trpc/react";
import Button from "~/components/ui/Button";
import Link from "next/link";
import Header from "~/components/Layout/header/header";
import { EmptyState } from "~/components/shared/empty/empty-state";
import SuperLink from "~/components/shared/SuperLink";
import ReportsTable from "./_components/ReportsTable";
import {Toaster} from "~/components/ui/Toaster";

export default function Page() {
  const { data, isLoading, isError } =
    api.reports.fetchByOrganization.useQuery();
  return (
    <main className="">
      <Toaster />
      <Header classNames="" title="Reports">
        <div className="w-full lg:flex lg:justify-end">
          <SuperLink href="/dashboard/reports/new">
            <Button className="w-full lg:w-fit ">New Report</Button>
          </SuperLink>
        </div>
      </Header>
      {!isLoading && data?.length === 0 && (
        <EmptyState
          customContent={{
            title: "No Reports found",
            text: "Reports are the core of your food traceability, Create your first Report now!",
            newButtonRoute: "/dashboard/reports/new",
            newButtonContent: "New Report",
          }}
        />
      )}
      {isLoading && <LoadingSkeleton />}
      {!isLoading && data!?.length != 0 && <ReportsTable data={data!} />}
    </main>
  );
}

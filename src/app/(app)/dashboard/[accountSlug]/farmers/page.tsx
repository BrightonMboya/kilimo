"use client";

import type { ReactElement } from "react";
import { api } from "~/trpc/react";
import FarmersTable from "./_components/farmers-table";
import Layout from "~/components/Layout/Layout";
import LoadingSkeleton from "~/components/ui/LoadingSkeleton";
import { EmptyState } from "~/components/shared/empty/empty-state";
import Button from "~/components/ui/Button";
import Header from "~/components/Layout/header/header";
import Link from "next/link";
export default function Page() {
  const { data, isLoading } = api.farmers.fetchByOrganization.useQuery();

  return (
    <main className="">
      <Header classNames="" title="All Farmers">
        <div className="w-full lg:flex lg:justify-end">
          <Link href="/dashboard/farmers/new">
            <Button className="w-full lg:w-fit ">New Farmer</Button>
          </Link>
        </div>
      </Header>
      {!isLoading && data?.length != 0 && <FarmersTable data={data!} />}

      {!isLoading && data?.length == 0 && (
        <EmptyState
          customContent={{
            title: "No Farmers found",
            text: "What are you waiting for? Create your first Farmer now!",
            newButtonRoute: "/dashboard/farmers/new",
            newButtonContent: "New Farmer",
          }}
        />
      )}
      {isLoading && <LoadingSkeleton />}
    </main>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

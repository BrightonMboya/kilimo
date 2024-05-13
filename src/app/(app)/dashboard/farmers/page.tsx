"use client";

import type { ReactElement } from "react";

import { api } from "~/trpc/react";

import FarmersTable from "./_components/farmers-table";
import Header from "~/components/harvests/Header";
import Layout from "~/components/Layout/Layout";
import NoData from "~/components/data-ui/NoData";
import LoadingSkeleton from "~/components/ui/LoadingSkeleton";

export default function Page() {
  const { data, isLoading } = api.farmers.fetchByOrganization.useQuery();
  console.log(data);

  return (
    <main className="pl-[70px]">
      <Header
        caption="Farmers"
        link="/dashboard/farmers/new"
        title="New Farmers"
      />
      {data?.length === 0 && (
        <NoData
          bigTitle="You haven't added your Farmers yet"
          smallTitle="It's easier to manage, your farmers. Go ahead and them now"
          c2a="Add Farmers"
          c2aUrl="/dashboard/farmers/new"
        />
      )}

      {isLoading && <LoadingSkeleton />}

      {/* @ts-ignore */}
      {data!?.length != 0 && data !== null && !isLoading && (
        <FarmersTable data={data} />
      )}
    </main>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

"use client";
import type { ReactElement } from "react";

import Layout from "~/components/Layout/Layout";
import { Header, NoAsset } from "~/components/harvests";
import HarvestsTable from "~/components/harvests/HarvestTable";
import LoadingSkeleton from "~/components/ui/LoadingSkeleton";
import { api } from "~/trpc/react";

export default function Index() {
  const { data, isLoading } = api.harvests.fetchByOrganization.useQuery({
    organizationEmail: ""
  });

  return (
    <main className="pl-5">
      <Header
        caption="Your company Harvests"
        title="View all harvests"
        link="/dashboard/harvests/new"
      />
      {data?.length === 0 && (
        <NoAsset
          bigTitle="You don't have any harvest"
          smallTitle="Start recording your harvest for traceability and record keeping"
          c2a="Add New Harvest"
          c2aUrl="/dashboard/harvests/new"
        />
      )}
      {data!?.length >= 0 && <HarvestsTable data={data} />}
      {isLoading && <LoadingSkeleton />}
    </main>
  );
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

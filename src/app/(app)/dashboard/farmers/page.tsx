"use client";

import type { ReactElement } from "react";

import { api } from "~/trpc/react";

import FarmersTable from "~/components/farmers/farmers-table";
import Header from "~/components/harvests/Header";
import Layout from "~/components/Layout/Layout";
import { NoAsset } from "~/components/harvests";

export default function Page() {
  const { data, isLoading } = api.farmers.fetchByOrganization.useQuery({
    organizationEmail: "",
  });

  return (
    <main className="pl-5">
      <Header
        caption="Farmers"
        link="/dashboard/farmers/new"
        title="New Farmers"
      />
      {data?.length === 0 && (
        <NoAsset
          bigTitle="You haven't added your Farmers yet"
          smallTitle="It's easier to manage, your farmers. Go ahead and them now"
          c2a="Add Farmers"
          c2aUrl="/dashboard/farmers/new"
        />
      )}

      {/* @ts-ignore */}
      {data!?.length >= 0 && <FarmersTable data={data} />}
    </main>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

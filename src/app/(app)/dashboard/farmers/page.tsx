"use client";

import type { ReactElement } from "react";

import { api } from "~/trpc/react";

import FarmersTable from "./_components/farmers-table";
import Layout from "~/components/Layout/Layout";
import NoData from "~/components/data-ui/NoData";
import LoadingSkeleton from "~/components/ui/LoadingSkeleton";
import { EmptyState } from "~/components/shared/empty/empty-state";
import Button from "~/components/ui/Button";
import Header from "~/components/Layout/header/header";
export default function Page() {
  const { data, isLoading } = api.farmers.fetchByOrganization.useQuery();
  console.log(data);

  return (
    <main className="">
      <Header classNames="">
        <div className="w-full lg:flex lg:justify-end">
          <Button className="w-full lg:w-fit ">New Farmer</Button>
        </div>
      </Header>
      <EmptyState />
    </main>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

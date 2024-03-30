import { useUser } from "@clerk/nextjs";
import type { ReactElement } from "react";

import Layout from "~/components/Layout/Layout";
import { Header, NoAsset } from "~/components/harvests";
import HarvestsTable from "~/components/harvests/HarvestTable";
import { api } from "~/utils/api";

export default function Index() {
  const { user } = useUser();
  const { data, isLoading } = api.harvests.fetchByOrganization.useQuery({
    organizationEmail: user?.primaryEmailAddress
      ?.emailAddress as unknown as string,
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
    </main>
  );
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

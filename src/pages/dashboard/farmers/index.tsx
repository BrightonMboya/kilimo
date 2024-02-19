import type { ReactElement } from "react";
import { useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";

import FarmersTable from "~/components/farmers/farmers-table";
import Header from "~/components/harvests/Header";
import Layout from "~/components/Layout/Layout";
import { NoAsset } from "~/components/harvests";

export default function Page() {
  const { user } = useUser();
  const { data, isLoading } = api.organization.fetchFarmers.useQuery({
    email: user?.primaryEmailAddress?.emailAddress as unknown as string,
  });

  // console.log(data);
  return (
    <main className="pl-5">
      <Header caption={user?.username as unknown as string} />

      <NoAsset
        bigTitle="You haven't added your Farmers yet"
        smallTitle="It's easier to manage, your farmers. Go ahead and them now"
        c2a="Add Farmers"
        c2aUrl="/dashboard/farmers/new"
      />

      {/* @ts-ignore */}
      {data!?.length >= 0 && <FarmersTable data={data} />}
    </main>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

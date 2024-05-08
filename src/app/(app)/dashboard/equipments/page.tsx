import { useUser } from "@clerk/nextjs";
import type { ReactElement } from "react";
import Layout from "~/components/Layout/Layout";
import { Header, NoAsset } from "~/components/harvests";
import LoadingSkeleton from "~/components/ui/LoadingSkeleton";
import { api } from "~/utils/api";

export default function Index() {
  const { user } = useUser();
  const { isLoading, data } = api.equipments.fetchByOrganization.useQuery({
    organizationEmail: user?.primaryEmailAddress
      ?.emailAddress as unknown as string,
  });
  return (
    <main className="pl-5">
      <Header caption="Your farm Equipments" title={""} link={""} />

      {data?.length === 0 && (
        <NoAsset
          bigTitle="You don't have any harvest"
          smallTitle="Start recording your harvest for traceability and record keeping"
          c2a="Add New Harvest"
          c2aUrl="/dashboard/harvests/new"
        />
      )}
      {isLoading && <LoadingSkeleton />}
    </main>
  );
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

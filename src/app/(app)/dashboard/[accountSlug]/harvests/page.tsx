"use client";

import HarvestsTable from "~/components/harvests/HarvestTable";
import LoadingSkeleton from "~/components/ui/LoadingSkeleton";
import { api } from "~/trpc/react";
import Button from "~/components/ui/Button";
import Link from "next/link";
import Header from "~/components/Layout/header/header";
import { EmptyState } from "~/components/shared/empty/empty-state";
import { useParams } from "next/navigation";

export default function Index() {
  const params = useParams();
  const { data, isLoading } = api.harvests.fetchByOrganization.useQuery({
    workspaceSlug: params.accountSlug as unknown as string,
  });

  return (
    <main className="">
      <Header classNames="" title="All Harvests">
        <div className="w-full lg:flex lg:justify-end">
          <Link href={`/dashboard/${params.accountSlug}/harvests/new`}>
            <Button className="w-full lg:w-fit ">New Harvest</Button>
          </Link>
        </div>
      </Header>
      {!isLoading && data?.length === 0 && (
        <EmptyState
          customContent={{
            title: "No Harvests found",
            text: "What are you waiting for? Create your first Harvest now!",
            newButtonRoute: `/dashboard/${params.accountSlug}/harvests/new`,
            newButtonContent: "New Harvest",
          }}
        />
      )}
      {!isLoading && data!?.length != 0 && <HarvestsTable data={data} />}
      {isLoading && <LoadingSkeleton />}
    </main>
  );
}

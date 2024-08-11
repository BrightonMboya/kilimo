import HarvestsTable from "~/components/harvests/HarvestTable";
import LoadingSkeleton from "~/components/ui/LoadingSkeleton";
import { api, HydrateClient } from "~/trpc/server";
import Button from "~/components/ui/Button";
import Link from "next/link";
import Header from "~/components/Layout/header/header";
import { EmptyState } from "~/components/shared/empty/empty-state";
import { Suspense } from "react";

export default async function Index(props: {
  params: { accountSlug: string };
}) {
  const harversts = await api.harvests.fetchByOrganization({
    workspaceSlug: props.params.accountSlug,
  });


  return (
    <HydrateClient>
      <main className="">
        <Header classNames="" title="All Harvests">
          <div className="w-full lg:flex lg:justify-end">
            <Link href={`/dashboard/${props.params.accountSlug}/harvests/new`}>
              <Button className="w-full lg:w-fit ">New Harvest</Button>
            </Link>
          </div>
        </Header>
        <Suspense fallback={<LoadingSkeleton />}>
          {harversts.length === 0 && (
            <EmptyState
              customContent={{
                title: "No Harvests found",
                text: "What are you waiting for? Create your first Harvest now!",
                newButtonRoute: `/dashboard/${props.params.accountSlug}/harvests/new`,
                newButtonContent: "New Harvest",
              }}
            />
          )}
          {harversts.length != 0 && <HarvestsTable data={harversts} />}
        </Suspense>
      </main>
    </HydrateClient>
  );
}

import FarmersTable from "./_components/farmers-table";
import LoadingSkeleton from "~/components/ui/LoadingSkeleton";
import { EmptyState } from "~/components/shared/empty/empty-state";
import Button from "~/components/ui/Button";
import Header from "~/components/Layout/header/header";
import Link from "next/link";
import { api, HydrateClient } from "~/trpc/server";


import { Suspense } from "react";

export default async function Page(props: { params: { accountSlug: string } }) {
  const farmers = await api.farmers.fetchByOrganization({
    workspaceSlug: props.params.accountSlug,
  });
return (
    <HydrateClient>
      <main className="">
        <Header classNames="" title="All Farmers">
          <div className="w-full lg:flex lg:justify-end">
            <Link href={`/dashboard/${props.params.accountSlug}/farmers/new`}>
              <Button className="w-full lg:w-fit ">New Farmer</Button>
            </Link>
          </div>
        </Header>
        <Suspense fallback={<LoadingSkeleton />}>
          {farmers.length !== 0 && <FarmersTable data={farmers} />}
          {farmers.length === 0 && (
            <EmptyState
              customContent={{
                title: "No Farmers found",
                text: "What are you waiting for? Create your first Farmer now!",
                newButtonRoute: `/dashboard/${props.params.accountSlug}/farmers/new`,
                newButtonContent: "New Farmer",
              }}
            />
          )}
        </Suspense>
      </main>
    </HydrateClient>
  );
}

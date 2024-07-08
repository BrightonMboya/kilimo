"use client";
import { useSearchParams, useRouter } from "next/navigation";
import LoadingSkeleton from "~/components/ui/LoadingSkeleton";
import { api } from "~/trpc/react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const harvestId = searchParams.get("harvestId");
  const { data, isLoading } = api.harvests.fetchById.useQuery({
    harvestId: harvestId as unknown as string,
  });
  return (
    <>
      {isLoading && <LoadingSkeleton />}
      {!isLoading && <></>}
    </>
  );
}

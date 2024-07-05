"use client";

import { useRouter, useParams } from "next/navigation";
import AccountSelector from "./AccountSwitcher";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/Skeleton";
import { useGetAccountBySlug } from "~/utils/hooks/use-accounts";

export default function NavigatingAccountSelector() {
  const params = useParams();
  const router = useRouter();
  console.log(params.accountSlug);
  const { data, isLoading, isError } = api.auth.getAccountBySlug.useQuery({
    accountSlug: params.accountSlug as unknown as string,
  });
  // const data = useGetAccountBySlug({accountSlug: params.accountSlug as unknown as string})
  // console.log(data.error, "???????")

  return (
    <>
      {/* {isLoading ? (
        <Skeleton className="h-[50px] w-full" />
      ) : (
        <AccountSelector
          accountId={data?.account_id}
          onAccountSelected={(account) =>
            router.push(
              account?.personal_account
                ? `/dashboard/farmers`
                : `/dashboard/${account?.slug}/farmers`,
            )
          }
        />
      )} */}
    </>
  );
}

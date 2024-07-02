"use client";

import { useRouter, useParams } from "next/navigation";
import AccountSelector from "./AccountSwitcher";
import { api } from "~/trpc/react";
interface Props {
  accountId: string;
}
export default function NavigatingAccountSelector() {
  const params = useParams();
  // console.log(params.accountSlug, params.);
  const { data, isLoading, isError } = api.auth.getAccountBySlug.useQuery({
    accountSlug: params.accountSlug as unknown as string,
  });
  console.log(data, "?????????");

  return (
    <AccountSelector
      accountId=""
      //   onAccountSelected={(account) =>
      //     router.push(
      //       account?.personal_account
      //         ? `/dashboard`
      //         : `/dashboard/${account?.slug}`,
      //     )
      //   }
      onAccountSelected={() => {
        console.log("Motherfucker");
      }}
    />
  );
}

import useSWR, { SWRConfiguration } from "swr";
import { createClient } from "../supabase/client";
import { GetAccountsResponse } from "@usebasejump/shared";

export const useAccounts = (options?: SWRConfiguration) => {
  const supabaseClient = createClient();
  return useSWR<GetAccountsResponse>(
    !!supabaseClient && ["accounts"],
    async () => {
      const { data, error } = await supabaseClient.rpc("get_accounts");

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    options,
  );
};

interface Props {
  options?: SWRConfiguration;
  accountSlug: string;
}

export const useGetAccountBySlug = (props: Props) => {
  const supabaseClient = createClient();
  return useSWR(
    !!supabaseClient && ["accounts"],
    async () => {
      const { data, error } = await supabaseClient.rpc("get_account_by_slug", {
        slug: props.accountSlug,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  );
};

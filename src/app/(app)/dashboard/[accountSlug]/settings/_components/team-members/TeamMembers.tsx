"use client";
// import { PendingInvitesTable } from "@/components/tables/pending-invites";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/Tabs";
import { Suspense } from "react";
// import { MembersTable } from "./tables/members";
// import { PendingInvitesSkeleton } from "./tables/pending-invites/table";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { Alert } from "~/components/ui/alert";
import ManageTeamInvitations from "./manage-team-invitations";
import ManageTeamMembers from "./manage-team-members";

export function TeamMembers() {
  const params = useParams();
  const { data, isLoading } = api.auth.getAccountBySlug.useQuery({
    accountSlug: params.accountSlug as unknown as string,
  });

  return (
    <>
      {!isLoading && (
        <>
          {data.account_role !== "owner" && (
            <Alert variant="destructive">
              You are not allowed to view this page
            </Alert>
          )}

          <ManageTeamInvitations accountId={data.account_id} />
          <ManageTeamMembers accountId={data.account_id} />
        </>
      )}
    </>
  );
}

"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { Table, TableRow, TableBody, TableCell } from "~/components/ui/table";

import { Badge } from "~/components/ui/badge";
import TeamMemberOptions from "./team-member-options";
import { api } from "~/trpc/react";

type Props = {
  accountId: string;
};

export default function ManageTeamMembers({ accountId }: Props) {
  //   const supabaseClient = createClient();

  //   const { data: members } = await supabaseClient.rpc("get_account_members", {
  //     account_id: accountId,
  //   });

  //   const { data } = await supabaseClient.auth.getUser();
  //   const isPrimaryOwner = members?.find(
  //     (member: any) => member.user_id === data?.user?.id,
  //   )?.is_primary_owner;
  const { data, isLoading } = api.auth.getAccountMembers.useQuery({
    accountId: accountId,
  });
  const isPrimaryOwner = data?.members.find(
    (member: any) => member.user_id === data?.user?.user?.id,
  )?.is_primary_owner;


  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>These are the users in your team</CardDescription>
      </CardHeader>
      {!isLoading && data && (
        <CardContent>
          <Table>
            <TableBody>
              {data.members?.map((member: any) => (
                <TableRow key={member.user_id}>
                  <TableCell>
                    <div className="flex gap-x-2">
                      {member.name}
                      <Badge
                        variant={
                          member.account_role === "owner"
                            ? "default"
                            : "outline"
                        }
                      >
                        {member.is_primary_owner
                          ? "Primary Owner"
                          : member.account_role}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {!Boolean(member.is_primary_owner) && (
                      <TeamMemberOptions
                        teamMember={member}
                        accountId={accountId}
                        isPrimaryOwner={isPrimaryOwner}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
}

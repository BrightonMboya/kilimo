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
import CreateTeamInvitationButton from "./create-team-invitation-button";
import { formatDistanceToNow } from "date-fns";
import DeleteTeamInvitationButton from "./delete-team-invitation-button";
import { api } from "~/trpc/react";

type Props = {
  accountId: string;
};

export default function ManageTeamInvitations({ accountId }: Props) {
  const { data: invitations, isLoading } =
    api.auth.getAccountInvitations.useQuery({
      accountId: accountId,
    });
  //   const supabaseClient = createClient();

  //   const { data: invitations } = await supabaseClient.rpc(
  //     "get_account_invitations",
  //     {
  //       account_id: accountId,
  //     },
  //   );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Pending Invitations</CardTitle>
            <CardDescription>
              These are the pending invitations for your team
            </CardDescription>
          </div>
          <CreateTeamInvitationButton accountId={accountId} />
        </div>
      </CardHeader>
      {!isLoading && invitations && (
        <>
          {Boolean(invitations?.length) && (
            <CardContent>
              <Table>
                <TableBody>
                  {invitations?.map((invitation: any) => (
                    <TableRow key={invitation.invitation_id}>
                      <TableCell>
                        <div className="flex gap-x-2">
                          {formatDistanceToNow(invitation.created_at, {
                            addSuffix: true,
                          })}
                          <Badge
                            variant={
                              invitation.invitation_type === "24_hour"
                                ? "default"
                                : "outline"
                            }
                          >
                            {invitation.invitation_type}
                          </Badge>
                          <Badge
                            variant={
                              invitation.account_role === "owner"
                                ? "default"
                                : "outline"
                            }
                          >
                            {invitation.account_role}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DeleteTeamInvitationButton
                          invitationId={invitation.invitation_id}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          )}
        </>
      )}
    </Card>
  );
}

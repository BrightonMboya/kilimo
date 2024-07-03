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
import { Skeleton } from "~/components/ui/Skeleton";

type Props = {
  accountId: string;
};

export default function ManageTeamInvitations({ accountId }: Props) {
  const { data: invitations, isLoading } =
    api.auth.getAccountInvitations.useQuery({
      accountId: accountId,
    });

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
      {isLoading && (
        <div className="space-y-3 pl-5 pb-5">
          <div className="flex  space-x-3">
            <Skeleton className="h-[20px] w-[150px]" />
            <Skeleton className="h-[20px] w-[70px]" />
            <Skeleton className="h-[20px] w-[70px]" />
          </div>
          <div className="flex  space-x-3">
            <Skeleton className="h-[20px] w-[150px]" />
            <Skeleton className="h-[20px] w-[70px]" />
            <Skeleton className="h-[20px] w-[70px]" />
          </div>
          <div className="flex  space-x-3">
            <Skeleton className="h-[20px] w-[150px]" />
            <Skeleton className="h-[20px] w-[70px]" />
            <Skeleton className="h-[20px] w-[70px]" />
          </div>
        </div>
      )}
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

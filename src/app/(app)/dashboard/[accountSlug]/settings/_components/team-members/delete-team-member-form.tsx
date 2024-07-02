import { SubmitButton } from "~/components/ui/submit-button";
import { removeTeamMember } from "~/utils/actions/members";
import { GetAccountMembersResponse } from "@usebasejump/shared";
import { usePathname } from "next/navigation";

type Props = {
  accountId: string;
  teamMember: GetAccountMembersResponse[0];
};

export default function DeleteTeamMemberForm({ accountId, teamMember }: Props) {
  const pathName = usePathname();

  return (
    <form className="animate-in flex w-full flex-1 flex-col justify-center gap-y-6 text-foreground">
      <input type="hidden" name="accountId" value={accountId} />
      <input type="hidden" name="userId" value={teamMember.user_id} />
      <input type="hidden" name="returnUrl" value={pathName} />

      <SubmitButton
        variant="destructive"
        formAction={removeTeamMember}
        pendingText="Removing..."
      >
        Remove member
      </SubmitButton>
    </form>
  );
}

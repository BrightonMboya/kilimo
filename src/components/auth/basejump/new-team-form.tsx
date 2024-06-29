import { Input, Label } from "~/components/ui";
import { SubmitButton } from "~/components/ui/submit-button";
import { createTeam } from "~/utils/actions/teams";

export default function NewTeamForm() {
  return (
    <form className="animate-in flex w-full flex-1 flex-col justify-center gap-y-6 text-foreground">
      <div className="flex flex-col gap-y-2">
        <Label htmlFor="email">Team Name</Label>
        <Input name="name" placeholder="My Team" required />
      </div>
      <div className="flex flex-col gap-y-2">
        <Label htmlFor="password">Identifier</Label>
        <div className="flex items-center gap-x-2">
          <span className="grow whitespace-nowrap text-sm text-muted-foreground">
            https://your-app.com/
          </span>
          <Input name="slug" placeholder="my-team" required />
        </div>
      </div>
      <SubmitButton formAction={createTeam} pendingText="Creating...">
        Create team
      </SubmitButton>
    </form>
  );
}

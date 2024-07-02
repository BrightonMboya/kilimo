"use client";

import { ComponentPropsWithoutRef, useMemo, useState } from "react";
import { Check, ChevronsUpDown, PlusCircle, LogOut } from "lucide-react";

import { cn } from "~/utils/utils";
import Button from "~/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/Command";
import { Spinner } from "~/components/ui/LoadingSkeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import NewTeamForm from "./new-team-form";
import { useAccounts } from "~/utils/hooks/use-accounts";
import { signOut } from "~/app/auth/actions";

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>;

type SelectedAccount = NonNullable<ReturnType<typeof useAccounts>["data"]>[0];

interface AccountSelectorProps extends PopoverTriggerProps {
  accountId: string;
  placeholder?: string;
  onAccountSelected?: (account: SelectedAccount) => void;
}

export default function AccountSelector({
  className,
  accountId,
  onAccountSelected,
  placeholder = "Select an account...",
}: AccountSelectorProps) {
  const [open, setOpen] = useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);

  const { data: accounts } = useAccounts();

  const { teamAccounts, personalAccount, selectedAccount } = useMemo(() => {
    const personalAccount = accounts?.find(
      (account) => account.personal_account,
    );
    const teamAccounts = accounts?.filter(
      (account) => !account.personal_account,
    );
    const selectedAccount = accounts?.find(
      (account) => account.account_id === accountId,
    );
    // console.log(teamAccounts, ",,,,,")

    return {
      personalAccount,
      teamAccounts,
      selectedAccount,
    };
  }, [accounts, accountId]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[250px] justify-between", className)}
          >
            {selectedAccount?.name || placeholder}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search account..." />
              <CommandEmpty>No account found.</CommandEmpty>
              <CommandGroup heading="Personal Account">
                <CommandItem
                  key={personalAccount?.account_id}
                  onSelect={() => {
                    if (onAccountSelected) {
                      onAccountSelected(personalAccount!);
                    }
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  {personalAccount?.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedAccount?.account_id ===
                        personalAccount?.account_id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              </CommandGroup>
              {Boolean(teamAccounts?.length) && (
                <CommandGroup heading="Teams">
                  {teamAccounts?.map((team) => (
                    <CommandItem
                      key={team.account_id}
                      onSelect={() => {
                        if (onAccountSelected) {
                          onAccountSelected(team);
                        }

                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      {team.name}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedAccount?.account_id === team.account_id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    value="new-team"
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>

            <CommandList>
              <CommandGroup>
                <CommandItem
                  value="new-team"
                  className="text-white "
                  style={{
                    backgroundColor: "#ef4444",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onSelect={() => {
                    setIsLoggingOut(true);
                    signOut();
                    setIsLoggingOut(false);
                  }}
                >
                  {isLoggingOut ? <Spinner /> : <LogOut />}
                  <span className="pl-3">Log Out</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new team</DialogTitle>
          <DialogDescription>
            Create a team to collaborate with others.
          </DialogDescription>
        </DialogHeader>
        <NewTeamForm />
      </DialogContent>
    </Dialog>
  );
}

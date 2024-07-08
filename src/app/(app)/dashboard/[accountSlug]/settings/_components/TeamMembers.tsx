import { AvatarImage, AvatarFallback, Avatar } from "~/components/ui/avatar";
import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "~/components/ui/popover";
import {
  CommandInput,
  CommandEmpty,
  CommandItem,
  CommandGroup,
  CommandList,
  Command,
} from "~/components/ui/Command";
import Button from "~/components/ui/Button";
import { JSX, SVGProps } from "react";
export default function TeamMembers() {
  return (
    <div className="mt-10 rounded-md border bg-white">
      <div className="rounded-t-md border-b bg-neutral-50 px-4 py-2 sm:px-6 md:py-3">
        <span className="mb-4 text-base font-medium sm:text-lg">
          All Team Members
        </span>
      </div>

      <div className="sm:px-6 md:py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/avatars/01.png" />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">Sofia Davis</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                m@example.com
              </p>
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="ml-auto" variant="outline">
                Owner
                <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="p-0">
              <Command>
                <CommandInput placeholder="Select new role..." />
                <CommandList>
                  <CommandEmpty>No roles found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem className="flex flex-col items-start gap-1 px-4 py-2">
                      <p>Viewer</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Can view and comment.
                      </p>
                    </CommandItem>
                    <CommandItem className="flex flex-col items-start gap-1 px-4 py-2">
                      <p>Developer</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Can view, comment and edit.
                      </p>
                    </CommandItem>
                    <CommandItem className="flex flex-col items-start gap-1 px-4 py-2">
                      <p>Billing</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Can view, comment and manage billing.
                      </p>
                    </CommandItem>
                    <CommandItem className="flex flex-col items-start gap-1 px-4 py-2">
                      <p>Owner</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Admin-level access to all resources.
                      </p>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/avatars/02.png" />
              <AvatarFallback>JL</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">Jackson Lee</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                p@example.com
              </p>
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="ml-auto" variant="outline">
                Member
                <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="p-0">
              <Command>
                <CommandInput placeholder="Select new role..." />
                <CommandList>
                  <CommandEmpty>No roles found.</CommandEmpty>
                  <CommandGroup className="p-1.5">
                    <CommandItem className="flex flex-col items-start gap-1 px-4 py-2">
                      <p>Viewer</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Can view and comment.
                      </p>
                    </CommandItem>
                    <CommandItem className="flex flex-col items-start gap-1 px-4 py-2">
                      <p>Developer</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Can view, comment and edit.
                      </p>
                    </CommandItem>
                    <CommandItem className="flex flex-col items-start gap-1 px-4 py-2">
                      <p>Billing</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Can view, comment and manage billing.
                      </p>
                    </CommandItem>
                    <CommandItem className="flex flex-col items-start gap-1 px-4 py-2">
                      <p>Owner</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Admin-level access to all resources.
                      </p>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}

function ChevronDownIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

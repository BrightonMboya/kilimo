"use client";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import { Label } from "~/components/ui/label";
import TeamMembers from "./team-members/TeamMembers";
import { api } from "~/trpc/react";

export default function TeamSettings() {
  const { data } = api.organization.getAllUsers.useQuery();
  console.log(data);
  return (
    <>
      <div className="rounded-md border bg-white">
        <div className="rounded-t-md border-b bg-neutral-50 px-4 py-2 sm:px-6 md:py-3">
          <span className="mb-4 text-base font-medium sm:text-lg">
            Collaborators
          </span>
        </div>
        <div className="space-y-5 p-4 sm:px-6 lg:w-[60%]">
          <p>
            To invite people to your plan, send them an email invite using the
            form below
          </p>

          <form>
            <div className="space-y-2">
              <Label htmlFor="name">Email</Label>
              <div className="flex items-center space-x-5">
                <Input
                  id="name"
                  placeholder="john@acme.com"
                  className="w-[300px]"
                />

                <Button className="h-9">Invite</Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <TeamMembers />
    </>
  );
}

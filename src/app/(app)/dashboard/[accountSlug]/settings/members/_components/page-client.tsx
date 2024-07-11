"use client";
import { useEditRoleModal } from "~/components/auth/workspaces/modals/edit-role-modal";
import { useInviteCodeModal } from "~/components/auth/workspaces/modals/invite-code-modal";
import { useInviteTeammateModal } from "~/components/auth/workspaces/modals/invite-team-modal";
import { useRemoveTeammateModal } from "~/components/auth/workspaces/modals/use-remove-team-modal";
import {
  CheckCircleFill,
  Link as LinkIcon,
  ThreeDots,
} from "~/components/ui/icons";
import {
  Avatar,
  Badge,
  Copy,
  IconMenu,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui";
import { Button } from "~/components/auth/Auth-Button";
import { cn, timeAgo } from "~/utils";
import { UserMinus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { TooltipProvider } from "~/components/ui";
import { useToast } from "~/utils/hooks";

const tabs: Array<"Members" | "Invitations"> = ["Members", "Invitations"];


export default function WorkspacePeopleClient() {
  const params = useParams();
  const { data, isLoading } = api.workspace.getSpecificWorkspace.useQuery({
    slug: params.accountSlug as unknown as string,
  });
  const workspace = data?.workspace;
  const { setShowInviteTeammateModal, InviteTeammateModal } =
    useInviteTeammateModal({
      id: workspace?.id!,
      slug: workspace?.slug!,
      logo: workspace?.logo!,
    });

  const { setShowInviteCodeModal, InviteCodeModal } = useInviteCodeModal({
    id: workspace?.id!,
    inviteCode: workspace?.logo!,
  });

  const [currentTab, setCurrentTab] = useState<"Members" | "Invitations">(
    "Members",
  );
  const { data: usersAndInvites } = api.workspace.getUsersAndInvites.useQuery({
    projectId: workspace?.id!,
  });
  const users =
    currentTab === "Invitations"
      ? usersAndInvites?.invites
      : usersAndInvites?.users;


  return (
    <>
      <TooltipProvider>
        <InviteTeammateModal />
        <InviteCodeModal />
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="flex flex-col items-center justify-between space-y-3 p-5 sm:flex-row sm:space-y-0 sm:p-10">
            <div className="flex flex-col space-y-3">
              <h2 className="text-xl font-medium">People</h2>
              <p className="text-sm text-gray-500">
                Teammates that have access to this workspace.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                text="Invite"
                onClick={() => setShowInviteTeammateModal(true)}
                className="h-9"
                {...(!data?.isOwner && {
                  disabledTooltip:
                    "Only workspace owners can invite new teammates.",
                })}
              />
              <Button
                icon={<LinkIcon className="h-4 w-4 text-gray-800" />}
                variant="secondary"
                onClick={() => setShowInviteCodeModal(true)}
                className="h-9 space-x-0"
                {...(!data?.isOwner && {
                  disabledTooltip:
                    "Only workspace owners can generate invite links for new teammates.",
                })}
              />
            </div>
          </div>
          <div className="flex space-x-3 border-b border-gray-200 px-3 sm:px-7">
            {tabs.map((tab) => (
              <div
                key={tab}
                className={`${
                  tab === currentTab ? "border-black" : "border-transparent"
                } border-b py-1`}
              >
                <button
                  onClick={() => setCurrentTab(tab)}
                  className="rounded-md px-3 py-1.5 text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
                >
                  {tab}
                </button>
              </div>
            ))}
          </div>
          <div className="grid divide-y divide-gray-200">
            {users ? (
              users.length > 0 ? (
                users.map((user) => (
                  <UserCard
                  //@ts-ignore too lazy to fix the type issue
                    key={user.id}
                    user={user}
                    currentTab={currentTab}
                    logo={workspace?.logo!}
                    workspaceId={workspace?.id!}
                    workspaceName={workspace?.name!}
                    isOwner={data?.isOwner!}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <img
                    src="/_static/illustrations/video-park.svg"
                    alt="No invitations sent"
                    width={300}
                    height={300}
                    className="pointer-events-none -my-8"
                  />
                  <p className="text-sm text-gray-500">No invitations sent</p>
                </div>
              )
            ) : (
              Array.from({ length: 5 }).map((_, i) => (
                <UserPlaceholder key={i} />
              ))
            )}
          </div>
        </div>
      </TooltipProvider>
    </>
  );
}

const UserCard = ({
  user,
  currentTab,
  workspaceName,
  workspaceId,
  logo,
  isOwner,
}: {
  user: any;
  currentTab: "Members" | "Invitations";
  workspaceName: string;
  workspaceId: string;
  logo: string;
  isOwner: boolean;
}) => {
  const [openPopover, setOpenPopover] = useState(false);

  const { id, name, email, createdAt, role: currentRole } = user.user;

  const [role, setRole] = useState<"owner" | "member">(currentRole);

  const { EditRoleModal, setShowEditRoleModal } = useEditRoleModal({
    user,
    role,
  });

  const { RemoveTeammateModal, setShowRemoveTeammateModal } =
    useRemoveTeammateModal({
      user,
      invite: currentTab === "Invitations",
      workspaceId: workspaceId,
      workspaceName: workspaceName,
      logo: logo,
    });

  const { data: session } = useSession();

  // invites expire after 14 days of being sent
  const expiredInvite =
    currentTab === "Invitations" &&
    createdAt &&
    Date.now() - new Date(createdAt).getTime() > 14 * 24 * 60 * 60 * 1000;

  const [copiedUserId, setCopiedUserId] = useState(false);
  const {toast} = useToast()

  const copyUserId = () => {
    navigator.clipboard.writeText(id);
    setCopiedUserId(true);
    toast({
      description: "User ID copied!"
    })
    setOpenPopover(false)
    setTimeout(() => setCopiedUserId(false), 3000);
  };

  return (
    <>
      <EditRoleModal />
      <RemoveTeammateModal />
      <div
        key={id}
        className="flex items-center justify-between space-x-3 px-4 py-3 sm:pl-8"
      >
        <div className="flex items-start space-x-3">
          <div className="flex items-center space-x-3">
            <Avatar user={user.user} />
            <div className="flex flex-col">
              <h3 className="text-sm font-medium">{name || email}</h3>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
          </div>

          {expiredInvite && <Badge variant="gray">Expired</Badge>}
        </div>
        <div className="flex items-center space-x-3">
          {currentTab === "Members" ? (
            session?.user?.email === email ? (
              <p className="text-xs capitalize text-gray-500">{role}</p>
            ) : (
              //   !isMachine && (
              <select
                className={cn(
                  "rounded-md border border-gray-200 text-xs text-gray-500 focus:border-gray-600 focus:ring-gray-600",
                  {
                    "cursor-not-allowed bg-gray-100": !isOwner,
                  },
                )}
                value={role}
                disabled={!isOwner}
                onChange={(e) => {
                  setRole(e.target.value as "owner" | "member");
                  setOpenPopover(false);
                  setShowEditRoleModal(true);
                }}
              >
                <option value="owner">Owner</option>
                <option value="member">Member</option>
              </select>
              //   )
            )
          ) : (
            <p className="text-xs text-gray-500" suppressHydrationWarning>
              Invited {timeAgo(createdAt)}
            </p>
          )}

          <Popover open={openPopover}>
            <PopoverContent>
              <div className="grid w-full gap-1 p-2 sm:w-48">
                <Button
                  text="Copy User ID"
                  variant="outline"
                  onClick={() => copyUserId()}
                  icon={
                    copiedUserId ? (
                      <CheckCircleFill className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )
                  }
                  className="h-9 justify-start px-2 font-medium"
                />
                <button
                  onClick={() => {
                    setOpenPopover(false);
                    setShowRemoveTeammateModal(true);
                  }}
                  className="rounded-md p-2 text-left text-sm font-medium text-red-600 transition-all duration-75 hover:bg-red-600 hover:text-white"
                >
                  <IconMenu
                    text={
                      session?.user?.email === email
                        ? "Leave workspace"
                        : currentTab === "Members"
                          ? "Remove teammate"
                          : "Revoke invite"
                    }
                    icon={<UserMinus className="h-4 w-4" />}
                  />
                </button>
              </div>
            </PopoverContent>
            <PopoverTrigger>
              <div>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenPopover(!openPopover);
                  }}
                  icon={<ThreeDots className="h-5 w-5 text-gray-500" />}
                  className="h-8 space-x-0 px-1 py-2"
                  variant="outline"
                  {...(!isOwner &&
                    session?.user?.email !== email && {
                      disabledTooltip:
                        "Only workspace owners can edit roles or remove teammates.",
                    })}
                />
              </div>
            </PopoverTrigger>
          </Popover>
        </div>
      </div>
    </>
  );
};

const UserPlaceholder = () => (
  <div className="flex items-center justify-between space-x-3 px-4 py-3 sm:px-8">
    <div className="flex items-center space-x-3">
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
      <div className="flex flex-col">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="mt-1 h-3 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
  </div>
);

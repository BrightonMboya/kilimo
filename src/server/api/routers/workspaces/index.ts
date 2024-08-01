import { mergeRouters } from "../../trpc";
import { getSpecificWorkSpace } from "./get-specific-workspace";
import { addWorkSpace } from "./add-workspace";
import { fetchAllWorkspaces } from "./fetch-all-workspaces";
import { getUsersAndInvites } from "./getUsersAndInvites";
import { editWorkspace } from "./edit-workspace";
import { invites } from "./invites";
import { deleteTeamInvite } from "./delete-team-invite";
import { resetInviteLink } from "./reset-invites";
import { acceptInvite } from "./accept-invite";

const workspace = mergeRouters(
  addWorkSpace,
  getSpecificWorkSpace,
  fetchAllWorkspaces,
  getUsersAndInvites,
  editWorkspace,
  invites,
  deleteTeamInvite,
  resetInviteLink,
  acceptInvite,
);
export default workspace;

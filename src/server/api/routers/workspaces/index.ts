import { mergeRouters } from "../../trpc";
import { getSpecificWorkSpace } from "./get-specific-workspace";
import { addWorkSpace } from "./add-workspace";
import { fetchAllWorkspaces } from "./fetch-all-workspaces";
import { getUsersAndInvites } from "./getUsersAndInvites";
import { editWorkspace } from "./edit-workspace";

const workspace = mergeRouters(
  addWorkSpace,
  getSpecificWorkSpace,
  fetchAllWorkspaces,
  getUsersAndInvites,
  editWorkspace
);
export default workspace;

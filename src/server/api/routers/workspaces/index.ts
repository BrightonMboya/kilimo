import { mergeRouters } from "../../trpc";
import { getSpecificWorkSpace } from "./get-specific-workspace";
import { addWorkSpace } from "./add-workspace";
import { fetchAllWorkspaces } from "./fetch-all-workspaces";
import { getUsersAndInvites } from "./getUsersAndInvites";

const workspace = mergeRouters(
  addWorkSpace,
  getSpecificWorkSpace,
  fetchAllWorkspaces,
  getUsersAndInvites,
);
export default workspace;

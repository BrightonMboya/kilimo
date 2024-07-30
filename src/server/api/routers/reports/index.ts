import { mergeRouters } from "../../trpc";
import { fetchByOrganization } from "./fetchByOrganization";
import { fetchById } from "./fetchById";
import { edit } from "./edit";
import { deleteReport } from "./delete";
import { deleteTrackingEvent } from "./deleteTrackingEvent";
import { markAsFinishedTracking } from "./markAsFinishedTracking";
import { add } from "./add";

const reports = mergeRouters(
  fetchByOrganization,
  fetchById,
  edit,
  deleteReport,
  deleteTrackingEvent,
  markAsFinishedTracking,
  add,
);

export default reports;

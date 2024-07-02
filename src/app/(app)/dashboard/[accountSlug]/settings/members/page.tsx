import { TeamMembers } from "../_components/team-members/TeamMembers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members | Jani AI",
};

export default async function Members() {
  return <TeamMembers />;
}

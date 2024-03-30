import { db } from "~/server/db";

export default async function useOrganizationId(organizationEmail: string) {
  return await db.organization.findUnique({
    where: {
      email: organizationEmail,
    },
    select: {
      id: true,
    },
  });
}

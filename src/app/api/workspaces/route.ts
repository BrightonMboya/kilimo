import { DubApiError } from "@/lib/api/errors";
import { withSession } from "@/lib/auth";
import { checkIfUserExists } from "@/lib/planetscale";
import { db } from "~/server/db";
import {
  WorkspaceSchema,
  createWorkspaceSchema,
} from "@/lib/zod/schemas/workspaces";
import { FREE_WORKSPACES_LIMIT, nanoid } from "@dub/utils";
import { waitUntil } from "@vercel/functions";
import { NextResponse } from "next/server";

// GET /api/workspaces - get all projects for the current user
export const GET = withSession(async ({ session }) => {
  const workspaces = await db.project.findMany({
    where: {
      users: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      users: {
        where: {
          userId: session.user.id,
        },
        select: {
          role: true,
        },
      },
      domains: {
        select: {
          slug: true,
          primary: true,
        },
      },
    },
  });
  return NextResponse.json(
    workspaces.map((project) =>
      WorkspaceSchema.parse({ ...project, id: `ws_${project.id}` }),
    ),
  );
});

export const POST = withSession(async ({ req, session }) => {
  const { name, slug } = await createWorkspaceSchema.parseAsync(
    await req.json(),
  );

  const userExists = await checkIfUserExists(session.user.id);

  if (!userExists) {
    throw new DubApiError({
      code: "not_found",
      message: "Session expired. Please log in again.",
    });
  }

  const freeWorkspaces = await db.project.count({
    where: {
      plan: "free",
      users: {
        some: {
          userId: session.user.id,
          role: "owner",
        },
      },
    },
  });

  if (freeWorkspaces >= FREE_WORKSPACES_LIMIT) {
    throw new DubApiError({
      code: "exceeded_limit",
      message: `You can only create up to ${FREE_WORKSPACES_LIMIT} free workspaces. Additional workspaces require a paid plan.`,
    });
  }

  const slugExist = await db.project.findUnique({
    where: {
      slug,
    },
    select: {
      slug: true,
    },
  });

  if (slugExist) {
    throw new DubApiError({
      code: "conflict",
      message: "Slug is already in use.",
    });
  }

  const workspaceResponse = await db.project.create({
    data: {
      name,
      slug,
      users: {
        create: {
          userId: session.user.id,
          role: "owner",
        },
      },
      billingCycleStart: new Date().getDate(),
      inviteCode: nanoid(24),
      defaultDomains: {
        create: {}, // by default, we give users all the default domains when they create a project
      },
    },
    include: {
      users: {
        where: {
          userId: session.user.id,
        },
        select: {
          role: true,
        },
      },
      domains: {
        select: {
          slug: true,
          primary: true,
        },
      },
    },
  });

  waitUntil(
    (async () => {
      if (session.user["defaultWorkspace"] === null) {
        await db.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            defaultWorkspace: workspaceResponse.slug,
          },
        });
      }
    })(),
  );

  return NextResponse.json(
    WorkspaceSchema.parse({
      ...workspaceResponse,
      id: `ws_${workspaceResponse.id}`,
    }),
  );
});

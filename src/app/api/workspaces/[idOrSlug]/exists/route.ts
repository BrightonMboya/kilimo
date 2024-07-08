import { db } from "~/server/db";
import { isReservedKey } from "~/utils/lib/edge-config";
import { DEFAULT_REDIRECTS } from "~/utils";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";

// GET /api/workspaces/[idOrSlug]/exists – check if a project exists
export const POST = async (req: NextApiRequest) => {
  console.log(req.body, req.method, "????>>?>?>>>>");
  const { slug } = req.body;
  console.log(slug, ">???????????????????????????????????????????????????????????")
  if ((await isReservedKey(slug)) || DEFAULT_REDIRECTS[slug]) {
    return NextResponse.json(1);
  }
  const project = await db.project.findUnique({
    where: {
      slug,
    },
    select: {
      slug: true,
    },
  });
  if (project) {
    return NextResponse.json(1);
  } else {
    return NextResponse.json(0);
  }
};

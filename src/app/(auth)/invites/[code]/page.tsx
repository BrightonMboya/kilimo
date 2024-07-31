import { auth } from "~/utils/lib/auth/auth";
import { db } from "~/server/db";
import LoadingSpinner from "~/components/ui/LoadingSpinner";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const runtime = "nodejs";

const PageCopy = ({ title, message }: { title: string; message: string }) => {
  return (
    <>
      <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="max-w-lg text-gray-600 [text-wrap:balance] sm:text-lg">
        {message}
      </p>
    </>
  );
};

export default function InvitesPage({
  params,
}: {
  params: {
    code: string;
  };
}) {

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-6 text-center">
      <Suspense
        fallback={
          <>
            <PageCopy
              title="Verifying Invite"
              message={`${process.env.NEXT_PUBLIC_APP_NAME} is verifying your invite link...`}
            />
            <LoadingSpinner className="h-7 w-7" />
          </>
        }
      >
        <VerifyInvite code={params.code} />
      </Suspense>
    </div>
  );
}

async function VerifyInvite({ code }: { code: string }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const workspace = await db.project.findUnique({
    where: {
      inviteCode: code,
    },
    select: {
      id: true,
      slug: true,
      users: {
        where: {
          userId: session?.user?.id,
        },
        select: {
          role: true,
        },
      },
      _count: {
        select: {
          users: {},
        },
      },
    },
  });

  if (!workspace) {
    return (
      <>
        <PageCopy
          title="Invalid Invite"
          message="The invite link you are trying to use is invalid. Please contact the workspace owner for a new invite."
        />
      </>
    );
  }

  // check if user is already in the workspace
  if (workspace.users.length > 0) {
    redirect(`/dashboard/${workspace.slug}/farmers`);
  }

  // if (workspace._count.users >= 7) {
  //   return (
  //     <PageCopy
  //       title="User Limit Reached"
  //       message="The workspace you are trying to join is currently full. Please contact the workspace owner for more information."
  //     />
  //   );
  // }

  await db.projectUsers.create({
    data: {
      userId: session?.user?.id!,
      projectId: workspace.id!,
    },
  });

  redirect(`/${workspace.slug}`);
}

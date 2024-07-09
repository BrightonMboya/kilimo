"use client";
import UploadLogo from "~/components/auth/workspaces/upload-logo";
import DeleteWorkspace from "~/components/auth/workspaces/DeleteWorkspace";
import { useParams } from "next/navigation";

import { api } from "~/trpc/react";
import { TooltipProvider } from "~/components/ui";
import GeneralSettings from "./_components/GeneralSettings";

export default function Page() {

  const params = useParams();
  const { data, isLoading } = api.workspace.getSpecificWorkspace.useQuery({
    slug: params.accountSlug as unknown as string,
  });
  

  return (
    <section className="space-y-5">
      <TooltipProvider>
        <GeneralSettings data={data} />
        <UploadLogo
          id={data?.workspace.id!}
          isOwner={data?.isOwner!}
          logo={data?.workspace.logo!}
        />
        <DeleteWorkspace />
      </TooltipProvider>
    </section>
  );
}

"use client";
// import { toast } from "sonner";
import { mutate } from "swr";
import { Form } from "./form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { useToast } from "~/utils/hooks";
import { Input } from "~/components/ui";
import { Button } from "~/components/auth/Auth-Button";
import { cn } from "~/utils";
import { useState } from "react";

export default function GeneralSettings({ data }: any) {
  const router = useRouter();
  const { update } = useSession();
  const { toast } = useToast();
  const changeWorkspaceName = api.workspace.changeWorkspaceName.useMutation({
    onSettled(data, error, variables, context) {
      toast({
        description: "Successfully updated workspace name!",
      });
    },
  });



  return (
    <>
       <Form
        title="Workspace Name"
        description={`This is the name of your workspace on ${process.env.NEXT_PUBLIC_APP_NAME}.`}
        inputAttrs={{
          name: "name",
          defaultValue: data?.workspace.name,
          placeholder: "My Workspace",
          maxLength: 32,
        }}
        helpText="Max 32 characters."
        {...(!data?.isOwner && {
          disabledTooltip:
            "Only workspace owners can change the workspace name.",
        })}
        handleSubmit={
          async (formData) => {
            const res = changeWorkspaceName.mutateAsync({
              updatedName: formData.name,
              workspaceId: data?.workspace.slug,
            });
            console.log(res);
          }
        }
      /> 
      <Form
        title="Workspace Slug"
        description={`This is your workspace's unique slug on ${process.env.NEXT_PUBLIC_APP_NAME}.`}
        inputAttrs={{
          name: "slug",
          defaultValue: data?.workspace.slug!,
          placeholder: "my-workspace",
          pattern: "^[a-z0-9-]+$",
          maxLength: 48,
        }}
        helpText="Only lowercase letters, numbers, and dashes. Max 48 characters."
        {...(!data?.isOwner && {
          disabledTooltip:
            "Only workspace owners can change the workspace slug.",
        })}
        handleSubmit={async (data) => {}}
        // handleSubmit={(data) =>
        //   fetch(`/api/workspaces/${data?.workspace.id}`, {
        //     method: "PATCH",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(data),
        //   }).then(async (res) => {
        //     if (res.status === 200) {
        //       const { slug: newSlug } = await res.json();
        //       await mutate("/api/workspaces");
        //       if (newSlug != data?.workspace.slug) {
        //         router.push(`/${newSlug}/settings`);
        //         update();
        //       }
        //       toast.success("Successfully updated workspace slug!");
        //     } else {
        //       const { error } = await res.json();
        //       toast.error(error.message);
        //     }
        // })
        // }
      />
    </>
  );
}



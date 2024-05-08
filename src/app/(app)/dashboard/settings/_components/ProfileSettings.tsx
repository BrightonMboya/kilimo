"use client";
import Label from "~/components/ui/label";
import Input from "~/components/ui/Input";
import Button from "~/components/ui/Button";
import { api } from "~/trpc/react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Spinner } from "~/components/ui/LoadingSkeleton";
import { useToast } from "~/utils/hooks/useToast";
import { Skeleton } from "~/components/ui/Skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { getAvatarFallback } from "~/components/Layout/ProfileDetailsSheet";
import { useState } from "react";
import { createClient } from "~/utils/supabase/client";

function ProfileSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-6 w-[200px]" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-[200px]" />
      <Skeleton className="h-6 w-full" />
    </div>
  );
}

const organizationSchema = z.object({
  organization_name: z.string(),
  email: z.string().email(),
});

type OrganizationSchema = z.infer<typeof organizationSchema>;

export default function ProfileSettings() {
  const utils = api.useUtils();
  const { data, isLoading } = api.auth.getProfileData.useQuery();
  const [uploadingImage, setUploadingImage] = useState(false);

  const { toast } = useToast();

  const orgRouter = api.organization.editOrganization.useMutation({
    onSuccess: () => {
      toast({
        title: "Organization updated",
        description: "Your organization has been updated",
        duration: 3000,
      });
    },
    onSettled: () => {
      utils.auth.getProfileData.invalidate();
    },
    onError: (err, data, ctx) => {
      toast({
        title: "Failed to save organization",
        description: err.message,
        variant: "destructive",
        duration: 5000,
      });
      console.log(err);
    },
  });
  const { register, handleSubmit, setValue } = useForm<OrganizationSchema>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      organization_name: data?.user_metadata.organization_name,
      email: data?.email,
    },
  });

  useEffect(() => {
    if (data) {
      setValue("organization_name", data.user_metadata.organization_name);
      setValue("email", data?.email!);
    }
  }, [data, setValue]);

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const selectedFile = e.target?.files[0]!;

    setFile(selectedFile);
  };

  const onSubmit: SubmitHandler<OrganizationSchema> = async (data) => {
    utils.organization.invalidate();
    // uploading the file to supabase
    setUploadingImage(true);
    const extensionType = file?.name.split(".")[1];
    const supabase = createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    const res = await supabase.storage
      .from("profile_pics")
      .upload(`${userId}/profilePic.${extensionType}`, file!, {
        upsert: true,
      });
    if (res.error) {
      toast({
        title: "Failed to save profile picture",
        variant: "destructive",
        duration: 5000,
      });
    }
    orgRouter.mutate({
      organization_name: data.organization_name,
      avatar_url: res.data?.path!,
    });
    setUploadingImage(false);
    // update the data on the auth.metadata

    // const fileLink = res.data?.path;
    // console.log(fileLink);
  };

  return (
    <div className="rounded-md border bg-white">
      <div className="rounded-t-md border-b bg-neutral-50 px-4 py-2 sm:px-6 md:py-3">
        <span className="mb-4 text-base font-medium sm:text-lg">
          Profile Information
        </span>
      </div>
      <div className="space-y-5 p-4 sm:px-6 lg:w-[60%]">
        {isLoading && <ProfileSkeleton />}
        {data && !isLoading && (
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Avatar className="relative h-32 w-32">
              <AvatarImage
                alt="user profile"
                className="object-cover"
                // src={
                //   data?.user_metadata?.avatar_url
                //     ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_pics/${data?.user_metadata?.avatar_url}`
                //     : file
                //       ? URL.createObjectURL(file)
                //       : undefined
                // }
                src={
                  file
                    ? URL.createObjectURL(file)
                    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_pics/${data?.user_metadata?.avatar_url}`
                }
              />
              <AvatarFallback>
                {getAvatarFallback(data?.user_metadata?.organization_name)}
              </AvatarFallback>
              <input
                className="absolute top-[50%] border-2 border-red-500 opacity-0"
                type="file"
                onChange={handleFileChange}
              />
            </Avatar>
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                {...register("organization_name")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                type="email"
                readOnly
                className="read-only:cursor-not-allowed"
                {...register("email")}
              />
            </div>

            <Button
              className="mt-5 w-[200px] disabled:cursor-not-allowed"
              disabled={orgRouter.isLoading || uploadingImage}
            >
              {orgRouter.isLoading && <Spinner />}
              Save
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

"use client";
import { ProfileIcon } from "./ProfileDetailsSheet";
import { api } from "~/trpc/react";
import { Skeleton } from "../ui/Skeleton";

export default function Header() {
  const { data, isLoading } = api.auth.getProfileData.useQuery();

  return (
    <nav className=" h-[60px] w-full  border-b-[1px] border-b-gray-300">
      <div className="flex items-center justify-end gap-4 pr-5 pt-2 text-base text-gray-500">
        {isLoading && (
          <>
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </>
        )}
        {!isLoading && data && (
          <>
            <p className="font-medium">
              {data?.user_metadata?.organization_name}
            </p>
            <ProfileIcon user={data} />
          </>
        )}
      </div>
    </nav>
  );
}

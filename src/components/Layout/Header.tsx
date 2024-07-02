"use client";
import { ProfileIcon } from "./ProfileDetailsSheet";
import { api } from "~/trpc/react";
import { Skeleton } from "../ui/Skeleton";

export default function Header() {
  const { data, isLoading } = api.auth.getProfileData.useQuery();

  return (
    <nav className=" h-[60px] w-full  border-[1px] border-gray-300 rounded-md cursor-pointer">
      <div className="flex items-center gap-4 pl-5 pt-2 text-base text-gray-500">
        {isLoading && (
          <>
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </>
        )}
        {!isLoading && data && (
          <>
            <ProfileIcon user={data} />
           
          </>
        )}
      </div>
    </nav>
  );
}

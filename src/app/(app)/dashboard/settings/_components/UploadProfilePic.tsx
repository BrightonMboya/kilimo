"use client";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { getAvatarFallback } from "~/components/Layout/ProfileDetailsSheet";
import type { User } from "@supabase/supabase-js";
import { useState } from "react";

export default function UploadProfilePic({ data }: { data: User }) {
  const [file, setFile] = useState<File | null>(null);
  const avatarFallback = getAvatarFallback(
    data?.user_metadata?.organization_name,
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const selectedFile = e.target?.files[0]!;

    setFile(selectedFile);
  };
  const avatarUrl = file;
  return (
    <div className="">
      <Avatar className="relative h-32 w-32">
        <AvatarImage
          alt="@shadcn"
          src={file ? URL.createObjectURL(file) : undefined}
        />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
        <input
          className="absolute top-[50%] border-2 border-red-500 opacity-0"
          type="file"
          onChange={handleFileChange}
        />
      </Avatar>
    </div>
  );
}

"use client";
import { User } from "@supabase/supabase-js";
import { LogOutIcon, Mail, MessageSquare, UserRound } from "lucide-react";
import Button from "~/components/ui/Button";
import { Separator } from "~/components/ui/seperator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signOut } from "~/app/auth/actions";
import { useState } from "react";
import { Spinner } from "../ui/LoadingSkeleton";

interface ProfileProps {
  user: User;
}

export function getAvatarFallback(text: string) {
  // Split the text into words
  const words = text.trim().split(/\s+/);
  // Extract the characters of the first two words or just the first word if there's only one
  let fallback = "";
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    fallback += words?.[i]?.[0];
  }

  return fallback.toUpperCase(); // Convert to uppercase for consistency
}

export function ProfileIcon({ user }: ProfileProps) {
  const avatarFallback = getAvatarFallback(
    user?.user_metadata?.organization_name,
  );

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex items-center space-x-3">
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_pics/${user?.user_metadata?.avatar_url}`}
              alt="user_profile"
            />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>

          <p className="font-medium">
            {user?.user_metadata?.organization_name}
          </p>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your profile</SheetTitle>
          <SheetDescription>
            Here you will find necessary information about your profile.
          </SheetDescription>
        </SheetHeader>

        <Separator className="mt-5" />
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-3 text-sm">
            <Avatar>
              <AvatarImage
                src={user?.user_metadata?.avatar_url}
                alt="user_profile"
              />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <div>
              <p>{user?.user_metadata?.organization_name}</p>
              <p>{user?.email}</p>
            </div>
          </div>

          <Separator className="mt-5" />
          <div className="flex flex-col space-y-3 text-sm">
            <p>Need Assistance?</p>

            <div className="flex cursor-pointer items-center space-x-2 rounded-md p-3 hover:bg-gray-200">
              <MessageSquare
                height={14}
                width={14}
                className="hover:text-indigo-700"
              />
              <p>Have a question? Ask away</p>
            </div>

            <div className="flex cursor-pointer items-center space-x-2 rounded-md p-3 hover:bg-gray-200">
              <Mail height={14} width={14} className="hover:text-indigo-700" />
              <p>Send us an email</p>
            </div>

            <div className="flex cursor-pointer items-center space-x-2 rounded-md p-3 hover:bg-gray-200">
              <UserRound
                height={14}
                width={14}
                className="hover:text-indigo-700"
              />
              <p>Talk to an expert</p>
            </div>
          </div>
        </div>

        <Button
          className="fixed bottom-10  space-x-2"
          variant="destructive"
          onClick={() => {
            setIsLoggingOut(true);
            signOut();
            setIsLoggingOut(false);
          }}
          disabled={isLoggingOut}
        >
          <>
            {isLoggingOut ? <Spinner /> : <LogOutIcon />}

            <span>Log out</span>
          </>
        </Button>
      </SheetContent>
    </Sheet>
  );
}

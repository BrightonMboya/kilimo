import Link from "next/link";
import { useRouter } from "next/router";
import { UserButton } from "@clerk/nextjs";
import { CubeIcon, PersonIcon } from "@radix-ui/react-icons";
import Button from "../ui/Button";
import { LogOutIcon } from "lucide-react";

export default function SideBar() {
  const router = useRouter();

  function signOut(arg0: () => Promise<boolean>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <section className="font-montserrat ">
      <div className="flex w-[150px] flex-col items-center justify-center space-y-7 pt-5 ">
        <UserButton afterSignOutUrl="/agri" appearance={{}} />

        <Link href="/dashboard/farmers">
          <div
            className={`flex items-center justify-center space-x-2
              ${
                router.pathname.startsWith("/dashboard/farmers")
                  ? "text-dark"
                  : "text-gray-500"
              }
          `}
          >
            <PersonIcon width={20} height={20} />

            <h3 className="font-montserrat">Farmers</h3>
          </div>
        </Link>

        

        <Link href="/dashboard/harvests">
          <div
            className={`flex items-center justify-center space-x-2
              ${
                router.pathname.startsWith("/dashboard/harvests")
                  ? "text-dark"
                  : "text-gray-500"
              }
          `}
          >
            <CubeIcon width={20} height={20} />

            <h3 className="font-montserrat">Harvests</h3>
          </div>
        </Link>

        <Link href="/dashboard/accounting">
          <div
            className={`flex items-center justify-center space-x-2
              ${
                router.pathname.startsWith("/dashboard/accounting")
                  ? "text-dark"
                  : "text-gray-500"
              }
          `}
          >
            <span>$</span>

            <h3 className="font-montserrat">Accounting</h3>
          </div>
        </Link>

        <Button
          className="fixed bottom-10 ml-10 w-[150px] space-x-2"
          variant="destructive"
          onClick={() => signOut(() => router.push("/auth/login"))}
        >
          <LogOutIcon />
          <span>Log out</span>
        </Button>
      </div>
    </section>
  );
}

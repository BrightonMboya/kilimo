import Link from "next/link";
import { useRouter } from "next/router";
import { UserButton } from "@clerk/nextjs";
import { CubeIcon, PersonIcon } from "@radix-ui/react-icons";

import BlurImage from "~/components/UI/BlurImage";


export default function SideBar() {
  const router = useRouter();


  return (
    <section className="font-montserrat ">
      <div className="flex w-[150px] flex-col items-center justify-center space-y-7 pt-5 ">

        <UserButton afterSignOutUrl="/agri"
        appearance={{
          
        }}
        />
      

        <Link href="/agri/dashboard/farmers">
          <div
            className={`flex items-center justify-center space-x-2
              ${
                router.pathname.startsWith("/agri/dashboard/farmers")
                  ? "text-dark"
                  : "text-gray-500"
              }
          `}
          >
            <PersonIcon width={20} height={20} />

            <h3 className="font-montserrat">Farmers</h3>
          </div>
        </Link>

        <Link href="/agri/dashboard/harvests">
          <div
            className={`flex items-center justify-center space-x-2
              ${
                router.pathname.startsWith("/agri/dashboard/harvests")
                  ? "text-dark"
                  : "text-gray-500"
              }
          `}
          >
            <CubeIcon width={20} height={20} />

            <h3 className="font-montserrat">Harvests</h3>
          </div>
        </Link>

       

        <Link href="/agri/dashboard/accounting">
          <div
            className={`flex items-center justify-center space-x-2
              ${
                router.pathname.startsWith("/agri/dashboard/accounting")
                  ? "text-dark"
                  : "text-gray-500"
              }
          `}
          >
            <span>$</span>

            <h3 className="font-montserrat">Accounting</h3>
          </div>
        </Link>
      </div>
    </section>
  );
}
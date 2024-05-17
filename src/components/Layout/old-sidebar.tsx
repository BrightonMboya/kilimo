"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CubeIcon, PersonIcon } from "@radix-ui/react-icons";
import Button from "../ui/Button";
import { DoorOpen, Flower2, LogOutIcon, Tractor } from "lucide-react";
import { SVGProps } from "react";
import { Separator } from "../ui/seperator";

export default function SideBar() {
  const pathname = usePathname();
  const baseLinkClass =
    "flex items-center gap-2 rounded-md px-3 py-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900  ";
  const activeLinkClass = "text-white bg-primary";

  return (
    <section className="hidden lg:block md:fixed z-[1000]  min-h-screen ">
      <div className="flex h-screen max-h-screen w-[200px] flex-col gap-4 border-r-[1px] border-r-gray-300 bg-white p-4 ">
        <div className="flex items-center gap-2 font-semibold text-gray-900 ">
          <span>Kilimo App</span>
        </div>
        <Separator className="" />
        <nav className="flex flex-col gap-[15px]">
          <Link
            href="/dashboard/farmers"
            className={`${baseLinkClass} ${pathname.startsWith("/dashboard/farmers") && activeLinkClass} `}
          >
            <PersonIcon width={20} height={20} />

            <h3 className="">Farmers</h3>
          </Link>

          <Link
            href="/dashboard/harvests"
            className={`${baseLinkClass} ${pathname.startsWith("/dashboard/harvests") && activeLinkClass} `}
          >
            <Flower2 width={20} height={20} />

            <h3 className="">Harvests</h3>
          </Link>

          <Link
            href="/dashboard/equipments"
            className={`${baseLinkClass} ${pathname.startsWith("/dashboard/equipments") && activeLinkClass} `}
          >
            <Tractor width={20} height={20} />

            <h3 className="">Equipments</h3>
          </Link>

          <Link
            href="/dashboard/warehouses"
            className={`${baseLinkClass} ${pathname.startsWith("/dashboard/warehouses") && activeLinkClass} `}
          >
            <DoorOpen width={20} height={20} />

            <h3 className="">Warehouses</h3>
          </Link>

          <Link
            href="/dashboard/inventory"
            className={`${baseLinkClass} ${pathname.startsWith("/dashboard/inventory") && activeLinkClass} `}
          >
            <CubeIcon width={20} height={20} />

            <h3 className="">Inventories</h3>
          </Link>

          {/* <Link
            href="/dashboard/accounting"
            className={`${baseLinkClass} ${pathname.startsWith("/dashboard/accounting") && activeLinkClass} `}
          >
            <span>$</span>

            <h3 className="">Accounting</h3>
          </Link> */}
          <Link
            className={`${baseLinkClass} ${pathname.startsWith("/dashboard/settings") && activeLinkClass} `}
            href="/dashboard/settings"
          >
            <SettingsIcon className="h-4 w-4" />
            Settings
          </Link>
          <Link
            className={`${baseLinkClass} ${pathname.startsWith("/dashboard/billing") && activeLinkClass} `}
            href="/dashboard/billing"
          >
            <CreditCardIcon className="h-4 w-4" />
            Billing
          </Link>
          <Button
            className="fixed bottom-10 w-[150px] space-x-2"
            variant="destructive"
          >
            <LogOutIcon />
            <span>Log out</span>
          </Button>
        </nav>
      </div>
    </section>
  );
}

export function SettingsIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function CreditCardIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

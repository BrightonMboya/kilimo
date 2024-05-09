"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { CubeIcon, PersonIcon } from "@radix-ui/react-icons";
import Button from "../ui/Button";
import { DoorOpen, Flower, Flower2, LogOutIcon, Tractor } from "lucide-react";

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <section className="min-h-screen w-[200px] bg-primary/10 pl-5">
      <div className="flex w-[150px] flex-col  space-y-7 pt-5 ">
        <Link href="/dashboard/farmers">
          <div
            className={`flex items-center space-x-2
              ${
                pathname.startsWith("/dashboard/farmers")
                  ? "text-dark"
                  : "text-gray-500"
              }
          `}
          >
            <PersonIcon width={20} height={20} />

            <h3 className="">Farmers</h3>
          </div>
        </Link>

        <Link href="/dashboard/harvests">
          <div
            className={`flex items-center  space-x-2
              ${
                pathname.startsWith("/dashboard/harvests")
                  ? "text-dark"
                  : "text-gray-500"
              }
          `}
          >
            <Flower2 width={20} height={20} />

            <h3 className="">Harvests</h3>
          </div>
        </Link>

        <Link href="/dashboard/equipments">
          <div
            className={`flex items-center  space-x-2
              ${
                pathname.startsWith("/dashboard/equipments")
                  ? "text-dark"
                  : "text-gray-500"
              }
          `}
          >
            <Tractor width={20} height={20} />

            <h3 className="">Equipments</h3>
          </div>
        </Link>

        <Link href="/dashboard/warehouses">
          <div
            className={`flex items-center  space-x-2
              ${
                pathname.startsWith("/dashboard/warehouses")
                  ? "text-dark"
                  : "text-gray-500"
              }
          `}
          >
            <DoorOpen width={20} height={20} />

            <h3 className="">Warehouses</h3>
          </div>
        </Link>

        <Link href="/dashboard/inventories">
          <div
            className={`flex items-center  space-x-2
              ${
                pathname.startsWith("/dashboard/inventories")
                  ? "text-dark"
                  : "text-gray-500"
              }
          `}
          >
            <CubeIcon width={20} height={20} />

            <h3 className="">Inventories</h3>
          </div>
        </Link>

        <Link href="/dashboard/accounting">
          <div
            className={`flex items-center space-x-2
              ${
                pathname.startsWith("/dashboard/accounting")
                  ? "text-dark"
                  : "text-gray-500"
              }
          `}
          >
            <span>$</span>

            <h3 className="">Accounting</h3>
          </div>
        </Link>

        <Button
          className="fixed bottom-10 w-[150px] space-x-2"
          variant="destructive"
        >
          <LogOutIcon />
          <span>Log out</span>
        </Button>
      </div>
    </section>
  );
}

"use client";

import { useMainMenuItems } from "~/utils/hooks/use-main-menu-items";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuItems = () => {
  const { menuItemsTop, menuItemsBottom } = useMainMenuItems();
  const pathname = usePathname();
  const baseNavClass =
    "group my-1 flex items-center gap-3 rounded px-3 py-2.5 text-[16px] font-semibold text-gray-700 transition-all duration-75 hover:bg-primary hover:text-white";

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full flex-col justify-between">
        <ul className="menu">
          {menuItemsTop.map((item) => (
            <li key={item.label}>
              <Link
                className={`${baseNavClass} ${pathname.startsWith(item.to) ? "bg-primary text-white" : ""}`}
                href={item.to}
                title={item.label}
              >
                <i
                  className={`inline-flex pl-[2px] text-gray-500 transition duration-200 ease-linear group-hover:text-white
                  ${pathname.startsWith(item.to) ? "text-white" : "text-gray-500"}`}
                >
                  {item.icon}
                </i>
                <span className="text whitespace-nowrap transition duration-200 ease-linear group-hover:text-white">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="lower-menu">
          <ul className="menu mb-6">
            {menuItemsBottom.map((item) => (
              <li key={item.label}>
                <Link
                  className="hover:bg-primary-50 hover:text-primary-600 my-1 flex items-center gap-3 rounded px-3 py-2.5 text-[16px] font-semibold text-gray-700 transition-all duration-75"
                  href={item.to}
                  title={item.label}
                >
                  <i className="icon inline-flex pl-[2px] text-gray-500">
                    {item.icon}
                  </i>
                  <span className="text whitespace-nowrap transition duration-200 ease-linear">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MenuItems;

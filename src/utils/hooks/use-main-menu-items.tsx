import Icon from "~/components/ui/icons/icons";

// import { useUserIsSelfService } from "./user-user-is-self-service";

export function useMainMenuItems() {
  let menuItemsTop = [
    {
      icon: <Icon icon="graph" />,
      to: "dashboard",
      label: "Dashboard",
    },
    {
      icon: <Icon icon="farmers" />,
      to: "/dashboard/farmers",
      label: "Farmers",
    },
    {
      icon: <Icon icon="harvest" />,
      to: "/dashboard/harvests",
      label: "Harvests",
    },
    {
      icon: <Icon icon="reports" />,
      to: "/dashboard/reports",
      label: "Reports",
    },
    {
      icon: <Icon icon="shoppingCart" />,
      to: "/dashboard/orders",
      label: "Orders",
    },
    {
      icon: <Icon icon="currencyDollar" />,
      to: "/dashboard/sales",
      label: "Sales",
    },

    {
      icon: <Icon icon="settings" />,
      to: "/dashboard/settings",
      label: "Settings",
      end: true,
    },
    {
      icon: <Icon icon="scanQR" />,
      to: "scanner",
      label: "Billing",
      end: true,
    },
  ];
  const menuItemsBottom = [
    {
      icon: <Icon icon="scanQR" />,
      to: "scanner",
      label: "QR scanner",
      end: true,
    },
    {
      icon: <Icon icon="settings" />,
      to: "settings",
      label: "Settings",
      end: true,
    },
  ];

//   if (useUserIsSelfService()) {
//     /** Deleting the Dashboard menu item as its not needed for self_service users. */
//     const itemsToRemove = ["dashboard", "categories", "tags", "locations"];
//     menuItemsTop = menuItemsTop.filter(
//       (item) => !itemsToRemove.includes(item.to)
//     );
//   }

  return {
    menuItemsTop,
    menuItemsBottom,
  };
}

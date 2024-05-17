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
      to: "farmers",
      label: "Farmers",
    },
    {
      icon: <Icon icon="harvest" />,
      to: "harvests",
      label: "Harvests",
    },
    {
      icon: <Icon icon="shoppingCart" />,
      to: "orders",
      label: "Orders",
    },
    {
      icon: <Icon icon="currencyDollar" />,
      to: "sales",
      label: "Sales",
    },

    {
      icon: <Icon icon="settings" />,
      to: "settings",
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

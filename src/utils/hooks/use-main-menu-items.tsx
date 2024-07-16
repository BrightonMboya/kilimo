import Icon from "~/components/ui/icons/icons";

export function useMainMenuItems({ accountSlug }: { accountSlug: string }) {
  let menuItemsTop = [
    {
      icon: <Icon icon="graph" />,
      to: "dashboard",
      label: "Dashboard",
    },
    {
      icon: <Icon icon="farmers" />,
      to: `/dashboard/${accountSlug}/farmers`,
      label: "Farmers",
    },
    {
      icon: <Icon icon="harvest" />,
      to: `/dashboard/${accountSlug}/harvests`,
      label: "Harvests",
    },
    {
      icon: <Icon icon="reports" />,
      to: `/dashboard/${accountSlug}/reports`,
      label: "Reports",
    },
    // {
    //   icon: <Icon icon="shoppingCart" />,
    //   to: `/dashboard/${accountSlug}/orders`,
    //   label: "Orders",
    // },
    // {
    //   icon: <Icon icon="currencyDollar" />,
    //   to: `/dashboard/${accountSlug}/sales`,
    //   label: "Sales",
    // },

    {
      icon: <Icon icon="settings" />,
      to: `/dashboard/${accountSlug}/settings`,
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

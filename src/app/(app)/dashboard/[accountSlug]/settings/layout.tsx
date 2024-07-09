import { SettingsNav } from "./_components/settingsNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[800px]">
      <SettingsNav
        items={[
          { path: "settings/", label: "General" },
          // { path: "accounts", label: "Accounts" },
          { path: "settings/members", label: "Members" },
          // { path: "categories", label: "Categories" },
          // { path: "notifications", label: "Notifications" },
        ]}
      />

      <main className="mt-8">{children}</main>
    </div>
  );
}

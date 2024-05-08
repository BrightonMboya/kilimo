import Link from "next/link";
import Button from "~/components/ui/Button";
import ProfileSettings from "./ProfileSettings";
import DangerZone from "./DangerZone";

export default function GeneralSettings() {
  return (
    <section className="space-y-6">
      <ProfileSettings />
      <div className="rounded-md border bg-white">
        <div className="rounded-t-md border-b bg-neutral-50 px-4 py-2 sm:px-6 md:py-3">
          <span className="mb-4 text-base font-medium sm:text-lg">
            Manage Subscription
          </span>
        </div>

        <div className="p-4 sm:px-6">
          <div className="mb-4 flex flex-col gap-4 text-sm sm:text-base">
            <div>You can cancel your subscription with the link below</div>
            <Button asChild className="max-w-fit">
              <Link href="/dashboard/billing" target="_blank" rel="noreferrer">
                Manage Subscription
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <DangerZone />
    </section>
  );
}

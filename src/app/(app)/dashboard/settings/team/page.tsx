import { EmptyState } from "~/components/shared/empty/empty-state";

export default function Page() {
  return (
    <div className="mt-5">
      <div className="mb-2.5 flex flex-col justify-between bg-white md:rounded md:border md:border-gray-200 md:px-6 md:py-8">
        <div className="mb-6 flex justify-between border-b pb-5">
          <div>
            {/* <h3 className="text-text-lg font-semibold">
                {isPersonalOrg ? "Team" : `${organization.name}'s team`}
              </h3> */}
            <p className="text-sm text-gray-600">
              Manage your existing team and give team members custody to certain
              assets.
            </p>
          </div>
        </div>
      <div  className="flex flex-col gap-6 xl:flex-row xl:gap-16">
        <div className="xl:w-1/4">
          <div className="text-text-sm font-medium text-gray-700">
            Non-registered members (NRM)
          </div>
          <p className="text-sm text-gray-600">
            Team members are part of your workspace but do not have an account.
          </p>
        </div>
        <EmptyState
          customContent={{
            title: "No team members on database",
            text: "What are you waiting for? Add your first team member now!",
            newButtonRoute: `add-member`,
            newButtonContent: "Add NRM",
          }}
          modelName={{
            singular: "team member",
            plural: "team members",
          }}
        />
      </div>
      </div>

    </div>
  );
}

import { Tabs, TabsTrigger, TabsContent, TabsList } from "~/components/ui/Tabs";
import { Button } from "~/components/ui/Button";

export default function Page() {
  return (
    <>
      <div className=" flex flex-col">
        <div className="mb-8 mt-3">
          <div className="mb-2 flex items-center gap-3 rounded border border-gray-300 p-4">
            <div className="border-primary-50 bg-primary-100 inline-flex items-center justify-center rounded-full border-[5px] border-solid p-1.5 text-primary">
              <InfoIcon />
            </div>
            {!subscription ? (
              <p className="text-[14px] font-medium text-gray-700">
                You’re currently using the{" "}
                <span className="font-semibold">FREE</span> version of Shelf
              </p>
            ) : (
              <CurrentPlanDetails />
            )}
          </div>
        </div>

        <div className="mb-8 justify-between border-b pb-5 lg:flex">
          <div className="mb-8 lg:mb-0">
            <h3 className="text-text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600">{subTitle}</p>
          </div>
          {subscription && <CustomerPortalForm />}
        </div>

        <Tabs
          defaultValue={subscription?.items.data[0]?.plan.interval || "year"}
          className="flex w-full flex-col"
        >
          <TabsList className="center mx-auto mb-8">
            <TabsTrigger value="year">
              Yearly{" "}
              <span className="bg-primary-50 text-primary-700 ml-2 rounded-[16px] px-2 py-1 text-xs font-medium">
                Save 54%
              </span>
            </TabsTrigger>
            <TabsTrigger value="month">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="year">
            <Prices prices={prices["year"]} />
          </TabsContent>
          <TabsContent value="month">
            <Prices prices={prices["month"]} />
          </TabsContent>
        </Tabs>
      </div>
      <SuccessfulSubscriptionModal />
    </>
  );
}

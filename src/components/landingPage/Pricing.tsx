import { Button } from "~/components/UI";

export default function Pricing() {
  return (
    <section className="dark:bg-dark relative z-20 overflow-hidden bg-white pb-12 pt-20 lg:pb-[90px] lg:pt-[120px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[510px] text-center">
              <span className="text-primary mb-2 block text-lg font-semibold">
                Pricing Table
              </span>
              <h2 className="text-dark mb-3 text-3xl font-bold dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                Awesome Pricing Plan
              </h2>
              <p className="text-body-color dark:text-dark-6 text-base">
                There are many variations of passages of Lorem Ipsum available
                but the majority have suffered alteration in some form.
              </p>
            </div>
          </div>
        </div>
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 md:w-1/2 lg:w-1/3">
            <div className="relative z-10 mb-10 overflow-hidden rounded-xl border-[1px]  px-8 py-10 sm:p-12 lg:px-6 lg:py-10 xl:p-14">
              <span className="text-dark mb-5 block text-xl font-medium dark:text-white">
                Starter
              </span>
              <h2 className="text-dark mb-11 text-4xl font-semibold dark:text-white xl:text-[42px] xl:leading-[1.21]">
                <span className="text-xl font-medium">$</span>
                <span className="-ml-1 -tracking-[2px]">25.00</span>
                <span className="text-body-color dark:text-dark-6 text-base font-normal">
                  Per Month
                </span>
              </h2>
              <div className="mb-[50px]">
                <h5 className="text-dark mb-5 text-lg font-medium dark:text-white">
                  Features
                </h5>
                <div className="flex flex-col gap-[14px]">
                  <p className="text-body-color dark:text-dark-6 text-base">
                    Managed Workflow
                  </p>
                  <p className="text-body-color dark:text-dark-6 text-base">
                    Data Management
                  </p>
                  <p className="text-body-color dark:text-dark-6 text-base">
                    Lifetime access
                  </p>
                  <p className="text-body-color dark:text-dark-6 text-base">
                    Feature 3
                  </p>
                </div>
              </div>

              <Button className=" px-7 py-1 ">Purchase Now</Button>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 lg:w-1/3">
            <div className="relative  z-10 mb-10 overflow-hidden rounded-xl border-[1px] bg-gray-100  px-8 py-10 sm:p-12 lg:px-6 lg:py-10 xl:p-14">
              <p className="bg-primary absolute right-[-50px] top-[60px] inline-block -rotate-90 rounded-bl-md rounded-tl-md px-5 py-2 text-base font-medium text-white">
                Recommended
              </p>
              <span className="text-dark mb-5 block text-xl font-medium dark:text-white">
                Basic
              </span>
              <h2 className="text-dark mb-11 text-4xl font-semibold dark:text-white xl:text-[42px] xl:leading-[1.21]">
                <span className="text-xl font-medium">$</span>
                <span className="-ml-1 -tracking-[2px]">59.00</span>
                <span className="text-body-color dark:text-dark-6 text-base font-normal">
                  Per Month
                </span>
              </h2>
              <div className="mb-[50px]">
                <h5 className="text-dark mb-5 text-lg font-medium dark:text-white">
                  Features
                </h5>
                <div className="flex flex-col gap-[14px]">
                  <p className="text-body-color dark:text-dark-6 text-base">
                    Managed Workflow
                  </p>
                  <p className="text-body-color dark:text-dark-6 text-base">
                    Data Management
                  </p>
                  <p className="text-body-color dark:text-dark-6 text-base">
                    Lifetime access
                  </p>
                  <p className="text-body-color dark:text-dark-6 text-base">
                    Feature 3
                  </p>
                </div>
              </div>
              <Button className=" px-7 py-1 ">Purchase Now</Button>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 lg:w-1/3">
            <div className="relative z-10 mb-10 overflow-hidden rounded-xl border-[1px]  px-8 py-10 sm:p-12 lg:px-6 lg:py-10 xl:p-14">
              <span className="text-dark mb-5 block text-xl font-medium dark:text-white">
                Premium
              </span>
              <h2 className="text-dark mb-11 text-4xl font-semibold dark:text-white xl:text-[42px] xl:leading-[1.21]">
                <span className="text-xl font-medium">$</span>
                <span className="-ml-1 -tracking-[2px]">699.00</span>
                <span className="text-body-color dark:text-dark-6 text-base font-normal">
                  Per Month
                </span>
              </h2>
              <div className="mb-[50px]">
                <h5 className="text-dark mb-5 text-lg font-medium dark:text-white">
                  Features
                </h5>
                <div className="flex flex-col gap-[14px]">
                  <p className="text-body-color dark:text-dark-6 text-base">
                    Managed Workflow
                  </p>
                  <p className="text-body-color dark:text-dark-6 text-base">
                    Data Management
                  </p>
                  <p className="text-body-color dark:text-dark-6 text-base">
                    Lifetime access
                  </p>
                  <p className="text-body-color dark:text-dark-6 text-base">
                    Feature 3
                  </p>
                </div>
              </div>

              <Button className=" px-7 py-1 ">Purchase Now</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

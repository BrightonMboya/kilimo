import Image from "next/image";

export default function Page() {
  return (
    <>
      <div className="relative flex  items-center justify-center " id="hero">
        <div className="pt-24 sm:pb-12 sm:pt-32">
          <div className="mx-auto max-w-7xl items-center px-6 lg:px-8">
            <div className="mx-auto flex max-w-3xl flex-col items-center justify-center text-center">
              <div className="rounded-full px-6 py-2.5 text-sm">
                <span className="">
                  Track resources across your supply chain{" "}
                </span>
              </div>
              <h3 className="text-balance text-3xl font-extrabold tracking-tight md:text-5xl lg:text-7xl ">
                Collaborate with your team
              </h3>
              <p className="mt-6 text-lg leading-8">
                Invite your teammates to collaborate on your work. Invite them
                to your workspace for easy collaboration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

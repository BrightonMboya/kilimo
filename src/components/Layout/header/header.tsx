import { Heading, SubHeading } from "~/components/ui/heading";

import { tw } from "~/utils/utils";

// import { Breadcrumbs } from "../breadcrumbs";

export interface HeaderData {
  /** Heading/title that will be rendered on top of the view */
  title: string;

  /** Subheading rendered below the heading */
  subHeading?: string;
}

export default function Header({
  title = null,
  children,
  subHeading,
  hidePageDescription = false,
  hideBreadcrumbs = false,
  classNames,
}: {
  /** Pass a title to replace the default route title set in the loader
   * This is very useful for interactive adjustments of the title
   */
  title?: string | null;
  children?: React.ReactNode;
  subHeading?: React.ReactNode;
  hidePageDescription?: boolean;
  hideBreadcrumbs?: boolean;
  classNames?: string;
}) {
  //   const data = useLoaderData<{
  //     header?: HeaderData;
  //   }>();
  //   const header = data?.header;

  return (
    <header className={tw("-mx-4 bg-white", classNames)}>
      {!hideBreadcrumbs && (
        <>
          {/* <div className="flex w-full items-center justify-between border-b border-gray-200 px-4 py-2 md:min-h-[67px] md:py-3">
       
            {children && (
              <div className="hidden shrink-0 gap-3 md:flex">{children}</div>
            )}
          </div> */}
          {children && (
            <div className="flex w-full items-center justify-between border-b border-gray-200 px-4 py-2 md:hidden">
              <div className="header-buttons flex flex-1 shrink-0 gap-3">
                {children}
              </div>
            </div>
          )}
        </>
      )}
      {!hidePageDescription && (
        <div className="border-b border-gray-200 p-4">
          <Heading as="h2" className="break-all text-[20px] font-semibold">
            {title || "Untitled Header"}
          </Heading>
          {subHeading ? (
            <SubHeading>{subHeading}</SubHeading>
          ) : (
         
            <SubHeading>{subHeading}</SubHeading>
          )}
        </div>
      )}
    </header>
  );
}

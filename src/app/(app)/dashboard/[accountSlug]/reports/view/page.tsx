"use client";
import React from "react";
import { EmptyState } from "~/components/shared/empty/empty-state";
import LoadingSkeleton from "~/components/ui/LoadingSkeleton";
import { api } from "~/trpc/react";
import { useSearchParams, useParams } from "next/navigation";
import PDFReport from "../_components/PDFReport";

export default function Page() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get("reportId");
  const params = useParams();
  const { data, isLoading, isError } = api.reports.fetchById.useQuery({
    reportId: reportId as unknown as string,
    workspaceSlug: params.accountSlug as unknown as string,
  });

  return (
    <main>
      {isLoading && <LoadingSkeleton />}
      {!isLoading && !data && (
        <EmptyState
          // @ts-ignore
          customContent={{
            title: "No Reports found",
            text: "The requested report was not found.",
          }}
        />
      )}

      {!isLoading && data && (
        // <section className="min-h-screen pt-4">
        //   <div className="mx-auto my-8 max-w-4xl rounded-lg bg-white p-8 shadow-lg">
        //     <header className="mb-8 flex items-center justify-between border-b pb-4">
        //       <div>
        //         <h1 className="mb-2 text-3xl font-bold text-gray-800">
        //           {data.name}
        //         </h1>
        //         <p className="text-gray-500">
        //           Organization Name: {data.Organization.name}
        //         </p>
        //         <p className="text-gray-500">Report ID: {data.id}</p>
        //         <p className="text-gray-500">
        //           Date Created: {format(data.dateCreated, "MMMM d, yyyy")}
        //         </p>
        //         <p className="flex items-center text-gray-500">
        //           Finished Tracking:
        //           {data.finishedTracking ? (
        //             <FaCheckCircle className="ml-2 text-green-500" />
        //           ) : (
        //             <FaTimesCircle className="ml-2 text-red-500" />
        //           )}
        //         </p>
        //       </div>
        //     </header>

        //     <h2 className="mb-4 text-2xl font-semibold text-gray-700">
        //       Basic Details
        //     </h2>
        //     <section className="mb-8 rounded-lg border bg-gray-50 p-6 shadow-sm">
        //       <div className="space-y-4 ">
        //         <p className="text-gray-600">
        //           Farmer Name: {data.Harvests.Farmers.fullName}
        //         </p>

        //         <p className="text-gray-600">
        //           Country: {data.Harvests.Farmers.country}
        //         </p>
        //         <p className="text-gray-600">
        //           Province: {data.Harvests.Farmers.province}
        //         </p>
        //         <p className="text-gray-600">
        //           Inputs Used: {data.Harvests.inputsUsed}
        //         </p>
        //       </div>
        //     </section>

        //     <section>
        //       <h2 className="mb-4 text-2xl font-semibold text-gray-700">
        //         What happened in the supply chain ...
        //       </h2>
        //       <div className="space-y-4">
        //         {data.ReportTrackingEvents.map((event) => (
        //           <div
        //             key={event.id}
        //             className="space-y-4 rounded-lg border bg-gray-50 p-6 shadow-sm"
        //           >
        //             <p className=" text-gray-800">
        //               <span className="text-lg font-medium">Name: </span>{" "}
        //               {event.eventName}
        //             </p>
        //             <p className="text-gray-800">
        //               <span className="text-lg font-medium">
        //                 Date Created:{" "}
        //               </span>
        //               {format(event.dateCreated, "MMMM d, yyyy")}
        //             </p>
        //             <p className="mt-2 text-gray-800">
        //               <span className="text-lg font-medium">Description: </span>
        //               {event.description}
        //             </p>
        //           </div>
        //         ))}
        //       </div>
        //     </section>
        //   </div>
        // </section>
        <PDFReport data={data} />
      )}
    </main>
  );
}

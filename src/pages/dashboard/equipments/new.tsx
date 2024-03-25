import type { ReactElement } from "react";

import Layout from "~/components/Layout/Layout";
import { Header, NoAsset } from "~/components/harvests";
import z from "zod"


export const equipmentSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  leased: z.boolean(),
  dateAcquired: z.date(),
  purchasePrice: z.string().min(1),
  estimatedValue: z.string().min(1),
  brand: z.string().min(1),
  status: z.string().min(1),
});

export default function Index() {
  return (
    <main className="pl-5">
      <Header caption="Green Giraffe Harvests" />
      <NoAsset
        bigTitle="You don't have any harvest"
        smallTitle="Start recording your harvest for traceability and record keeping"
        c2a="Add New Harvest"
        c2aUrl="/dashboard/harvests/new"
      />
    </main>
  );
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

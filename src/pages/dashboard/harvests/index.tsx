import type { ReactElement } from "react";

import Layout from "~/components/Layout/Layout";
import { Header, NoAsset } from "~/components/harvests";

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

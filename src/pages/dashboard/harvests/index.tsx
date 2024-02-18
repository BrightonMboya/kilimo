import type { ReactElement } from "react";

import AgriLayout from "~/components/agriBusiness/Layout/Layout";
import { Header, NoAsset } from "~/components/agriBusiness/harvests";

export default function Index() {
  return (
    <main className="pl-5">
      <Header
      caption="Green Giraffe Harvests"
      />
      <NoAsset
        bigTitle="You don't have any harvest"
        smallTitle="Start recording your harvest for traceability and record keeping"
        c2a="Add New Harvest"
        c2aUrl="/agri/dashboard/harvests/new"
      />
    </main>
  );
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <AgriLayout>{page}</AgriLayout>;
};

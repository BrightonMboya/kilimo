import type { ReactElement } from "react";

import AgriLayout from "~/components/agriBusiness/Layout/Layout";

export default function Page() {
  return <div>index!!</div>;
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <AgriLayout>{page}</AgriLayout>;
};

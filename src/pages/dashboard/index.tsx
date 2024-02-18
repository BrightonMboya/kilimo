import type { ReactElement } from "react";

import Layout from "~/components/Layout/Layout";

export default function Page() {
  return <div>index!!</div>;
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

import { ReactElement } from "react";
import Layout from "~/components/Layout/HomeLayout";
import {
  About,
  Call2Action,
  Faq,
  Features,
  HeroSection,
  Pricing,
} from "~/components/landingPage";

function Page() {
  return (
    <Layout>
      <HeroSection />
      <Features />
      <About />
      <Call2Action />
      <Pricing />
      <Faq />
      <Call2Action />
    </Layout>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;

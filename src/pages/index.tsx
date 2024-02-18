import Layout from "~/components/Layout/HomeLayout";
import {
  About,
  Call2Action,
  Faq,
  Features,
  HeroSection,
  Pricing,
} from "~/components/landingPage";

export default function Index() {
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

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
    <>
      <HeroSection />
      <Features />
      <About />
      <Call2Action />
      {/* <Pricing /> */}
      <Faq />
    </>
  );
}

export default Page;

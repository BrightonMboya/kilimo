import { Navbar, Footer, CustomCursor } from "~/components/landingPage/layout";
import { Hero, Carousel, TraceabilityJourney, JoinJani, FinalCTA } from '~/components/landingPage/sections';
import { InfiniteScroll } from '~/components/landingPage/providers';

export default function Home() {
  return (
    <div className="relative flex flex-col">
      <InfiniteScroll />
      <CustomCursor />
      <Navbar />

      <div id="content-section-1" className="w-full h-fit z-10">
        <Hero />
        <Carousel />
        <TraceabilityJourney />
        <JoinJani />
        <FinalCTA />
      </div>
      <div className="h-[110vh] -z-100" />
      <Hero />
      <Footer />
    </div>
  );
}

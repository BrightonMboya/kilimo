import { Navbar, Footer, CustomCursor } from "~/components/landingPage/layout";
import { Hero, Carousel, TraceabilityJourney, JoinJani, FinalCTA } from '~/components/landingPage/sections';
import { InfiniteScroll } from '~/components/landingPage/providers';

export default function Home() {
  return (
    <div className="relative flex w-full flex-col overflow-x-hidden">
      <InfiniteScroll />
      <CustomCursor />
      <Navbar />

      <div id="content-section-1" className="z-10 h-fit w-full">
        <Hero />
        <Carousel />
        <TraceabilityJourney />
        <JoinJani />
        <FinalCTA />
      </div>
      <div className="-z-100 h-[85svh] md:h-[110vh]" />
      <Hero />
      <Footer />
    </div>
  );
}

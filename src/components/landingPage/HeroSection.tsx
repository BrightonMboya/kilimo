import Image from "next/legacy/image";

import { Button } from "~/components/UI";
import styles from "./gradient.module.css";

export default function HeroSection() {
  return (
    <section className={styles["gradient"]}>
      <div className="styles relative overflow-hidden pt-[120px] md:pt-[130px] lg:pt-[160px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4">
              <div
                className="hero-content wow fadeInUp mx-auto max-w-[780px] text-center"
                data-wow-delay=".2s"
              >
                <h1 className="mb-6 text-3xl font-medium leading-snug  sm:text-4xl sm:leading-snug lg:text-5xl lg:leading-[1.2]">
                  Helping AgriBusinesses Collect, Manage, and analyze data
                  flows.
                </h1>
                <p className="mx-auto mb-9 max-w-[600px] text-base font-medium sm:text-lg sm:leading-[1.44]">
                  Something catchy I cant think of as of right now. What I know
                  is that it will be exactly this long for easy readiblity and
                  flow.
                </p>
                <ul className="mb-10 flex flex-wrap items-center justify-center gap-5">
                  <li>
                    <Button>Contact Sales</Button>
                  </li>

                  <li>
                    <Button variant="ghost">Watch Demo</Button>
                  </li>
                </ul>
                {/* <div>
                  <p className="mb-4 text-center text-base font-medium">
                    Built with latest technology
                  </p>
               
                </div> */}
              </div>
            </div>

            <div className="w-full px-4">
              <div
                className="wow fadeInUp relative z-10 mx-auto max-w-[845px]"
                data-wow-delay=".25s"
              >
                <div className="mt-10">
                  <img
                    src="https://uplink.weforum.org/uplink/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=0682o00000rF3w4AAC"
                    alt="hero"
                    className="mx-auto max-w-full rounded-t-xl rounded-tr-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

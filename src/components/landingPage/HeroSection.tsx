import  Button  from "~/components/ui/Button";
import styles from "./gradient.module.css";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className={styles["gradient"]}>
      <section className="flex flex-col items-center justify-center">
        <div className="styles relative overflow-hidden pt-[120px] md:pt-[130px] lg:pt-[160px]">
          <div className="container">
            <div className="-mx-4 flex flex-wrap items-center">
              <div className="w-full px-4">
                <div className="px-5 text-black">
                  <h1
                    className="text-balance text-3xl font-extrabold tracking-tight md:text-5xl lg:text-7xl "
                  >
                    Helping AgriBusinesses{" "}
                    <span className="underline decoration-primary decoration-dashed underline-offset-4">
                      track resources
                    </span>{" "}
                    across the supply chain.
                  </h1>

                  <p className="mx-auto mb-9 pt-5 text-xl font-medium sm:text-lg md:text-2xl lg:pt-7">
                    Track your resources from the farm all the way up to the
                    fork. Give your clients more observability and traceability
                    to increase trust and transparency.
                  </p>
                  <ul className="mb-10 flex flex-wrap gap-5">
                    <li>
                      <Link href="https://cal.com/brightonmboya/15min">
                        <Button className="lg:py-6 lg:text-xl" size="lg">
                          Contact Sales
                        </Button>
                      </Link>
                    </li>

                    {/* <li>
                      <Button variant="ghost">Watch Demo</Button>
                    </li> */}
                  </ul>
                </div>
              </div>

              <div className="w-full px-4">
                <div className="relative z-10 mx-auto ">
                  <div className="mt-10 hidden rounded-md border-2 border-primary shadow-lg md:block">
                    <img
                      src="/static/images/product.png"
                      alt="hero"
                      className="mx-auto max-w-full rounded-md rounded-t-xl rounded-tr-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

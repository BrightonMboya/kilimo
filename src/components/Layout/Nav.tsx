"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { RiMenu3Line } from "react-icons/ri";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/legacy/image";

const Nav = () => {
  const [showNav, setShowNav] = useState(false);

  const activeRoute = "text-gold font-medium border-b-[2px] border-b-gold";
  const normalRoute = "";
  const pathname = usePathname();

  return (
    <>
      <nav className="font-montserrat absolute top-0 z-[9999] w-full ">
        {/* <div
          onClick={() => setShowNav(!showNav)}
          className="absolute right-5 top-5 z-10 cursor-pointer lg:hidden"
        >
          {showNav ? (
            <FaTimes size={30} color="#fff" />
          ) : (
            <RiMenu3Line size={30} color="#46783E" />
          )}
        </div> */}
        <div className="absolute left-5 top-5 md:hidden">
          <div className="relative h-[50px] w-[80px] lg:block">
            <Image
              src="/static/images/jani.svg"
              style={{
                borderRadius: "12px",
              }}
              alt="logo"
              layout="fill"
            />
          </div>
        </div>
        <ul
          className={
            !showNav
              ? "hidden"
              : "absolute left-0 top-0  flex h-[400px] w-full flex-col items-center justify-center gap-5 bg-[#46783E] text-lg font-medium text-white"
          }
        >
          {/* <li>
            <Link
              href="/"
              className={pathname === "/" ? activeRoute : normalRoute}
            >
              {" "}
              Home
            </Link>
          </li>
          <li>
            <Link href="https://cal.com/shamba-data/30min">Book a demo</Link>
          </li>
          <li>
            <Link
              href="/#about"
              className={pathname === "/#about" ? activeRoute : normalRoute}
            >
              Sub Heading
            </Link>
          </li>

          */}
          <li>
            <Link href="https://cal.com/brightonmboya/15min">Contact Us</Link>
          </li>
        </ul>

        {/* for freaking wide screens */}
        <ul className=" hidden text-xl text-white md:h-[100px] md:items-center md:justify-between md:space-x-5 md:bg-[#46783E] md:px-7 md:text-lg lg:flex">
          <div>
            <li>
              <Link href="/">
                <div className="relative hidden h-[65px] w-[148px] lg:block">
                  <Image
                    src="/static/images/jani-white.png"
                    style={{
                      borderRadius: "12px",
                    }}
                    alt="logo"
                    layout="fill"
                  />
                </div>
              </Link>
            </li>
          </div>
          <div className="flex items-center space-x-7">
            {/* <li>
              <Link
                href="/"
                className={pathname === "/" ? activeRoute : normalRoute}
              >
                {" "}
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/#about"
                className={pathname === "/#about" ? activeRoute : normalRoute}
              >
                sub Header
              </Link>
            </li> */}

            <li>
              <Link href="https://cal.com/brightonmboya/15min">
                <button className="font-semi-bold rounded-md bg-white px-4 py-2 text-black">
                  Book an Enteprise Demo
                </button>
              </Link>
            </li>
            <li></li>
          </div>
        </ul>
      </nav>
    </>
  );
};

export default Nav;

//use-client

import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { RiMenu3Line } from "react-icons/ri";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/legacy/image";
import { UserButton } from "@clerk/nextjs";

const Nav = () => {
  const [showNav, setShowNav] = useState(false);
  const router = useRouter();
  const activeRoute = "text-gold font-medium border-b-[2px] border-b-gold";
  const normalRoute = "";

  return (
    <>
      <nav className="font-montserrat absolute top-0 z-[9999] w-full">
        <div
          onClick={() => setShowNav(!showNav)}
          className="absolute right-5 top-5 z-10 cursor-pointer lg:hidden"
        >
          {showNav ? (
            <FaTimes size={30} color="#fff" />
          ) : (
            <RiMenu3Line size={30} color="#46783E" />
          )}
        </div>
        <ul
          className={
            !showNav
              ? "hidden"
              : "bg-green absolute left-0  top-0 flex h-[400px] w-full flex-col items-center justify-center gap-5 text-lg font-medium text-white"
          }
        >
          <li>
            <Link
              href="/"
              className={router.pathname === "/" ? activeRoute : normalRoute}
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
              className={
                router.pathname === "/#about" ? activeRoute : normalRoute
              }
            >
             Sub Heading
            </Link>
          </li>
          

          <li>
            <Link href="/contactus">Contact Us</Link>
          </li>
         
        </ul>

        {/* for freaking wide screens */}
        <ul className=" md:bg-green hidden text-xl text-white md:h-[100px] md:items-center md:justify-between md:space-x-5 md:px-7 md:text-lg lg:flex">
          <div>
            <li>
              <Link href="/">
                <div className="relative hidden h-[65px] w-[148px] lg:block">
                  <Image
                    src="/new_logo.png"
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
            <li>
              <Link
                href="/"
                className={router.pathname === "/" ? activeRoute : normalRoute}
              >
                {" "}
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/#about"
                className={
                  router.pathname === "/#about" ? activeRoute : normalRoute
                }
              >
                sub Header
              </Link>
            </li>
            
           
            <li>
              <Link href="https://cal.com/shamba-data/30min">
                <button className="font-semi-bold rounded-md bg-white px-4 py-2 text-black">
                  Book an Enteprise Demo
                </button>
              </Link>
            </li>
            <li>
              <UserButton />
            </li>
          </div>
        </ul>
      </nav>
    </>
  );
};

export default Nav;

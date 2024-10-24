"use client";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  Logo,
} from "~/components/ui";
import { cn } from "~/utils";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { DesktopNavLink, MobileNavLink } from "./link";
import { Button } from "~/components/auth/Auth-Button";

export function Navigation() {
  const [scrollPercent, setScrollPercent] = useState(0);

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 100;
      const scrollPercent = Math.min(window.scrollY / 2 / scrollThreshold, 1);
      setScrollPercent(scrollPercent);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      style={{
        backgroundColor: `rgba(255, 255, 255, ${scrollPercent})`,
        borderColor: `rgba(209, 213, 219, ${Math.min(scrollPercent / 5, 0.15)})`,
      }}
      className="fixed top-0 z-[100] w-full overflow-x-hidden border-b-[1px] border-b-gray-300 py-3 shadow-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container flex items-center justify-between">
        <Link href="/" aria-label="Home">
          <Logo className="min-w-[50px]" />
        </Link>
        <div className="flex w-full items-center justify-end sm:w-auto sm:gap-12 lg:justify-between lg:gap-20 ">
          <MobileLinks className="mr-5 lg:hidden" />
          <DesktopLinks className="hidden lg:flex" />
        </div>
        <div className="hidden space-x-5 sm:flex">
          <Link href="/register">
            <Button
              text="Create Account"
              icon={<ChevronRight />}
              className="h-8 border-[1px] border-gray-500 text-sm"
              variant="outline"
            />
          </Link>
          <Link href="/login">
            <Button text="Sign In" icon={<ChevronRight />} className="h-8" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

function MobileLinks({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={className}>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex h-8 items-center justify-end gap-2 py-2 pl-3 text-sm duration-150 "
          >
            Menu
            <ChevronDown className="relative top-[1px] h-4 w-4" />
          </button>
        </DrawerTrigger>
        <DrawerContent className="z-[110] bg-white">
          <DrawerHeader className="flex justify-center"></DrawerHeader>
          <div className="relative z-[110] mx-auto w-full antialiased">
            <ul className="flex flex-col divide-y divide-white/25 px-8">
              <li>
                <MobileNavLink
                  onClick={() => setIsOpen(false)}
                  href="/"
                  label="Home"
                />
              </li>
              <li>
                <MobileNavLink
                  onClick={() => setIsOpen(false)}
                  href="/about"
                  label="About"
                />
              </li>
              <li>
                <MobileNavLink
                  onClick={() => setIsOpen(false)}
                  href="/blog"
                  label="Blog"
                />
              </li>
              <li>
                <MobileNavLink
                  onClick={() => setIsOpen(false)}
                  href="/pricing"
                  label="Pricing"
                />
              </li>
              {/* <li>
                <MobileNavLink
                  onClick={() => setIsOpen(false)}
                  href="/changelog"
                  label="Changelog"
                />
              </li> */}
              <li>
                <MobileNavLink
                  onClick={() => setIsOpen(false)}
                  href="/features/farmerManagement"
                  label="Features"
                />
              </li>
            </ul>
          </div>
          <DrawerFooter>
            <Link href="/login">
              <Button
                text="Sign In"
                icon={<ChevronRight />}
                className="flex w-full justify-center text-center"
              />
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={cn(
                "h-10 rounded-lg border bg-white px-4 text-center text-white/75 duration-500 hover:text-white/80",
                className,
              )}
            >
              Close
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

const DesktopLinks: React.FC<{ className: string }> = ({ className }) => (
  <ul className={cn("hidden items-center gap-8 lg:flex xl:gap-12", className)}>
    <li>
      <DesktopNavLink href="/about" label="About" />
    </li>
    <li>
      <DesktopNavLink href="/blog" label="Blog" />
    </li>
    <li>
      <DesktopNavLink href="/pricing" label="Pricing" />
    </li>
    {/* <li>
      <DesktopNavLink href="/changelog" label="Changelog" />
    </li> */}
    <li>
      <DesktopNavLink href="/features/farmerManagement" label="Features" />
    </li>
    {/* <li>
      <DesktopNavLink href="/docs" label="Docs" />
    </li> */}
  </ul>
);

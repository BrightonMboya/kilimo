import Image from "next/legacy/image";

import { Toaster } from "~/components/ui/Toaster";
import { LoginForm } from "./LoginForm";

export default function Page() {
  return (
    <>
      <Toaster />

      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900 " />
          <Image
            src="https://images.unsplash.com/photo-1583499871880-de841d1ace2a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHdpbGRsaWZlfGVufDB8MXwwfHx8MA%3D%3D"
            alt="hero"
            layout="fill"
            className="object-cover opacity-40"
          />

          <div className="relative z-20 flex items-center text-lg font-medium">
            <div className="relative hidden h-[65px] w-[148px] lg:block">
              {/* <Image
                src="/new_logo.png"
                style={{
                  borderRadius: "12px",
                }}
                alt="logo"
                layout="fill"
              /> */}
            </div>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This software has streamlined every process of my
                company.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <LoginForm />
      </div>
    </>
  );
}

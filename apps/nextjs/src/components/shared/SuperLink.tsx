"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { type ComponentPropsWithRef } from "react"

export default function SuperLink(props: ComponentPropsWithRef<typeof Link>) {
    const router = useRouter()
    return (
      <Link
        {...props}
        onMouseEnter={(e) => {
          const href =
            typeof props.href === "string" ? props.href : props.href.href;
          if (href) {
            router.prefetch(href);
          }
          return props.onMouseEnter?.(e);
        }}
      />
    );
}
"use client";
import { cn } from "~/utils";
import Link from "next/link";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";

type Props = { href: string; label: string; external?: boolean };

export const DesktopNavLink: React.FC<Props> = ({ href, label, external }) => {
  const segment = useSelectedLayoutSegment();
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      className={cn(
        "text-sm tracking-[0.07px] text-black duration-200 hover:text-black/60",
        {
          "text-black/90 underline decoration-primary decoration-dashed underline-offset-4":
            href.startsWith(`/${segment}`),
        },
      )}
    >
      {label}
    </Link>
  );
};

export function MobileNavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  external?: boolean;
  onClick: () => void;
}) {
  const segment = useSelectedLayoutSegment();
  const router = useRouter();

  return (
    <button
      type="button"
      className={cn(
        "py-3 text-lg font-medium tracking-[0.07px] duration-200",
        {
          "text-white": href.startsWith(`/${segment}`),
        },
      )}
      onClick={() => {
        onClick();
        router.push(href);
      }}
    >
      {label}
    </button>
  );
}

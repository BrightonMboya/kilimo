import { cn } from "~/utils";
import type React from "react";

type BlogListProps = {
  children?: React.ReactNode;
  className?: string;
};

export function BlogList({ children, className }: BlogListProps) {
  // console.log("BlogList children", children);
  return (
    <ul
      className={cn("flex list-disc flex-col gap-4 pl-6 text-white", className)}
    >
      {children}
    </ul>
  );
}
export function BlogListNumbered({ children, className }: BlogListProps) {
  // console.log("BlogList children", children);
  return (
    <ol
      className={cn(
        "flex list-decimal flex-col gap-6 pl-6 text-white ",
        className,
      )}
    >
      {children}
    </ol>
  );
}
export function BlogListItem({ children, className }: BlogListProps) {
  return (
    <li
      className={cn(
        "pl-6 font-normal leading-8 text-white/60 sm:text-lg",
        className,
      )}
    >
      <span className="text-lg">{children}</span>
    </li>
  );
}

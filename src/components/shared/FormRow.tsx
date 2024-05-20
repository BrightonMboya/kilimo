import React from "react";
import { tw } from "~/utils/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function SubHeading({ children, className }: Props) {
  return (
    <div className={tw(`font-normal text-gray-500`, className)}>{children}</div>
  );
}

interface Props {
  /** Label to be rendered on the left side of the row */
  rowLabel: string;
  children: React.ReactNode;
  className?: string;
  subHeading?: string | JSX.Element;
  required?: boolean;
}

export default function FormRow({
  children,
  rowLabel,
  subHeading,
  className,
  required = false,
}: Props) {
  return (
    <div
      className={tw(`flex gap-8 border-b border-y-gray-200 py-6`, className)}
    >
      <div className="hidden lg:block lg:min-w-[280px] lg:basis-[280px]">
        <div
          className={tw(
            "text-text-sm font-medium text-gray-700",
            required && "required-input-label",
          )}
        >
          {rowLabel}
        </div>
        <SubHeading className="text-xs text-gray-600" rowLabel={""}>
          {subHeading}
        </SubHeading>
      </div>

      <div className="flex w-[512px] flex-wrap">{children}</div>
    </div>
  );
}

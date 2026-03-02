import { cn } from "@kilimo/utils";
import { Minus } from "lucide-react";
type BlogQuoteProps = {
  children?: React.ReactNode;
  className?: string;
  author?: string;
};

export function BlogQuote({ children, className, ...props }: BlogQuoteProps) {
  return (
    <div
      className={cn(
        "flex flex-col border-l-2 border-white/20 py-4 pl-16 text-left text-lg sm:py-2 sm:pl-8 ",
        className,
      )}
    >
      <div className="h-fit align-middle ">
        <blockquote className="my-auto font-medium leading-8 text-white sm:my-0 sm:text-xs">
          {children}
        </blockquote>
        {props.author && (
          <div className="flex flex-row font-normal leading-8 text-white/40">
            {" "}
            <Minus className="mt-1.5 pr-1" size={20} />{" "}
            <p className="">{props.author}</p>
          </div>
        )}
      </div>
    </div>
  );
}

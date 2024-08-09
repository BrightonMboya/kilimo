import {
  ShadCnAvatar as Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";
import type { Author } from "~/content/blog/authors";
import { cn } from "~/utils";
import { format } from "date-fns";
import { Frame } from "./frame";
import { ImageWithBlur } from "./ImageWithBlur";

export function QuestionCircle({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="7.5" stroke="white" />
      <path
        d="M9.98389 9C10.17 8.62441 10.4574 8.30833 10.8136 8.08745C11.1698 7.86657 11.5807 7.74969 11.9999 7.75C12.4464 7.74998 12.8827 7.88278 13.2535 8.13152C13.6243 8.38025 13.9126 8.73367 14.082 9.14679C14.2513 9.55992 14.2938 10.0141 14.2042 10.4515C14.1147 10.8889 13.897 11.2897 13.5789 11.603C13.0789 12.096 12.4709 12.628 12.1769 13.253M11.9999 16.25V16.26"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
    </svg>
  );
}

type BlogHeroProps = {
  tags?: string[];
  imageUrl?: string;
  title?: string;
  subTitle?: string;
  author: Author;
  publishDate?: string;
  className?: string;
};

export function BlogHero({
  tags,
  imageUrl,
  title,
  subTitle,
  author,
  publishDate,
  className,
}: BlogHeroProps) {
  return (
    <div
      className={cn(
        "z-100 relative flex w-full flex-col gap-8 rounded-3xl border border-transparent p-3 duration-150 ease-out hover:border-[1px] hover:border-gray-300 hover:shadow-sm  lg:flex-row xl:gap-16",
        className,
      )}
    >
      <div className="flex h-full w-full flex-col lg:w-1/2">
        <Frame className="z-100 order-2 h-full w-full lg:order-1" size="sm">
          <ImageWithBlur
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8+e1bKQAJMQNc5W2CQwAAAABJRU5ErkJggg=="
            src={imageUrl!}
            width={1920}
            height={1080}
            alt="Hero Image"
          />
        </Frame>
      </div>
      <div className="lg:w-1/2">
        <div className="z-100 order-1 flex h-full flex-col justify-evenly lg:order-2">
          <div className="flex flex-row justify-center gap-4 pb-4 lg:justify-start">
            {tags?.map((tag) => (
              <p
                key={tag}
                className="py-.5 z-100 flex w-fit items-center rounded-md bg-primary/90 px-[9px] text-sm capitalize leading-6 "
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </p>
            ))}
          </div>
          <h2 className="blog-heading-gradient flex w-full justify-center text-center text-3xl font-medium leading-10 lg:justify-start lg:text-left">
            {title}
          </h2>
          <p className="flex justify-center text-center text-base font-normal leading-7  lg:justify-start lg:text-left">
            {subTitle}
          </p>
          <div className="flex w-full flex-row justify-center gap-6 pt-6 lg:justify-start">
            <div className="flex flex-col gap-2 text-nowrap">
              <span className="text-sm  ">Written by</span>
              <div className="flex items-center gap-4">
                <Avatar className="mt-4">
                  <AvatarImage
                    alt={author.name}
                    src={author.image.src}
                    width={12}
                    height={12}
                  />
                  <AvatarFallback />
                </Avatar>
                <span className="mt-4 text-sm">{author.name}</span>
                <div />
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <span className="text-sm ">Published on</span>
              <div>
                <span className="pt-2 text-sm">
                  {format(new Date(publishDate!), "MMM dd, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

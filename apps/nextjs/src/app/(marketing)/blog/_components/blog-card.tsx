import type { Author } from "~/content/blog/authors";
import { cn } from "~/utils";
import { format } from "date-fns";
import { Frame } from "./frame";
import { ImageWithBlur } from "./ImageWithBlur";
import { ShadCnAvatar as Avatar, AvatarFallback, AvatarImage } from "~/components/ui";

type BlogCardProps = {
  tags?: string[];
  imageUrl?: string;
  title?: string;
  subTitle?: string;
  author: Author;
  publishDate?: string;
  className?: string;
};

export function BlogCard({
  tags,
  imageUrl,
  title,
  subTitle,
  author,
  publishDate,
  className,
}: BlogCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-3xl border border-transparent p-3 duration-150 ease-out max-sm:h-full hover:bg-gray-100 border-gray-100",
        className,
         
      )}
    >
      <div className="w-full rounded-2xl bg-clip-border">
        <Frame size="sm">
          <div className="relative aspect-video">
            <ImageWithBlur
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8+e1bKQAJMQNc5W2CQwAAAABJRU5ErkJggg=="
              src={imageUrl!}
              alt="Hero Image"
              className="w-full overflow-hidden object-center"
              fill={true}
            />
          </div>
        </Frame>
      </div>
      <div className="flex h-full flex-col px-1">
        <div className="flex h-80 flex-col pb-2 pt-3">
          <div className="flex-inline flex h-6 flex-wrap gap-2">
            {tags?.map((tag) => (
              <div className="content-center rounded-md px-[9px] text-sm bg-primary/90 text-white/80">
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </div>
            ))}
          </div>
          <h2 className="blog-heading-gradient mt-6 flex justify-start text-xl font-medium leading-10 sm:text-2xl md:text-2xl">
            {title}
          </h2>

          <p className="mt-6 h-full text-base font-normal leading-6 sm:text-sm">
            {subTitle}
          </p>
          {/* Todo: Needs ability to add multiple authors at some point */}
          <div className="flex h-full flex-col flex-wrap justify-end">
            <div className="flex flex-row">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  alt={author.name}
                  src={author.image.src}
                  width={12}
                  height={12}
                />
                <AvatarFallback />
              </Avatar>
              <p className="ml-4 pt-3 text-sm font-medium">
                {author.name}
              </p>
              <p className="ml-6 pt-3 text-sm font-normal">
                {format(new Date(publishDate!), "MMM dd, yyyy")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

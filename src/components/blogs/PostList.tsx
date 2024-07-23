import Image from "next/image";
import Link from "next/link";

export const cx = (...classNames: string[]) =>
  classNames.filter(Boolean).join(" ");

interface PostListProps {
  post: any;
  aspect: "landscape" | "square";
}
export default function PostList({ post, aspect }: PostListProps) {
  return (
    <>
      <Link href="/blogs/[slug]" as={`/blogs/${post.slug}`}>
        <div className="group min-h-[200px] w-[350px] cursor-pointer rounded-md shadow-md  ">
          <div
            className={cx(
              "relative h-[200px] w-[350px] overflow-hidden rounded-md transition-all hover:scale-105",
              aspect === "landscape" ? "aspect-video" : "aspect-square",
            )}
          >
            {/* <Link href={`/reports/${post.slug.current}`}> */}
            {post?.coverImage ? (
              <Image
                // src={imageProps["src"]}
                src={post?.coverImage}
                alt="Thumbnail"
                width={350}
                height={200}
                className="h-[200px] w-full rounded-t-md"
              />
            ) : (
              // <BlurImage imageUrl={imageProps["src"]} preload rounded={false} />
              ""
            )}
            {/* </Link> */}
          </div>
          <div className="px-3">
            {/* <CategoryLabel categories={post.categories} /> */}
            <h2 className="text-brand-primary mt-0 text-lg font-medium tracking-normal">
              <Link href={`/blogs/${post.slug}`}>
                <span className="bg-gradient-to-r from-green-200 to-green-100 bg-[length:0px_10px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_10px]">
                  {post.title}
                </span>
              </Link>
            </h2>

            {post.excerpt && (
              <p className="line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
                <Link href={`/blogs/${post.slug}`}>{post.excerpt}</Link>
              </p>
            )}
            {/* <div className="mb-3 mt-2">
              <time
                dateTime={post?.publishedAt || post._createdAt}
                className="text-sm text-gray-700"
              >
                {format(
                  parseISO(post?.publishedAt || post._createdAt),
                  "MMMM dd, yyyy"
                )}
              </time>
            </div> */}
          </div>
        </div>
      </Link>
    </>
  );
}

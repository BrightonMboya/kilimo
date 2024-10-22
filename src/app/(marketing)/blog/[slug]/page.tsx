import { SuggestedBlogs } from "../_components/suggestedBlogs";
import { MDX } from "../_components/MDXComponent";
import {
  ShadCnAvatar as Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";
import { authors } from "~/content/blog/authors";
import { cn } from "~/utils";
import { allPosts } from "content-collections";
import type { Post } from "content-collections";
import { format, parseISO } from "date-fns";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "~/components/landingPage/gradient.module.css"

export const generateStaticParams = async () =>
  allPosts.map((post) => ({
    slug: post.slug,
  }));

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = allPosts.find((post) => post.slug === `${params.slug}`);
  if (!post) {
    notFound();
  }
  return {
    title: `${post.title} | Jani AI`,
    description: post.description,
  

    openGraph: {
      title: `${post.title} | Jani AI`,
      description: post.description,
      url: `https://jani-ai.com/${post._meta.path}`,
      siteName: "jani-ai.com",
      type: "article",
      images: {
        // url: `https://jani-ai.com${post.image}`,
        url: `${post.image}`,
        width: 1200,
        height: 800,
      },

      publishedTime: format(parseISO(post.date.toString()), "yyyy-MM-dd"),
      modifiedTime: format(parseISO(post.date.toString()), "yyyy-MM-dd"),
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Jani AI`,
      description: post.description,
      site: "@jani-ai",
      creator: "@jani-ai",
      images: {
        // url: `https://jani-ai.com${post.image}`,
        url: `${post.image}`,
        width: 1200,
        height: 800,
      },
    },
  };
}

const BlogArticleWrapper = async ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post.slug === `${params.slug}`) as Post;
  if (!post) {
    notFound();
  }
  const author = authors[post.author];
  return (
    <>
      <div className="container mx-auto scroll-smooth pt-48 sm:overflow-hidden md:overflow-visible ">
        <div className="flex w-full flex-row">
          <div className="flex w-full flex-col lg:w-3/4">
            <div className={`prose sm:prose-sm md:prose-md sm:mx-6 ${styles["gradient"]}`}>
              <div className="m-0 mb-8 flex items-center gap-5 p-0 text-xl font-medium leading-8">
                <Link href="/blog">
                  <span className="bg-clip-text  ">
                    Blog
                  </span>
                </Link>
                <span className="text-black/40">/</span>
                <Link href={`/blog?tag=${post.tags?.at(0)}`}>
                  <span className=" bg-clip-text capitalize">
                    {post.tags?.at(0)}
                  </span>
                </Link>
              </div>
              <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-6xl blog-heading-gradient">{post.title}</h1>
              {/* <p className="not-prose mt-8 text-lg font-medium leading-8 text-black/60 lg:text-xl">
                {post.description}
              </p> */}
              <div className="flex flex-row justify-stretch gap-8 sm:mt-12 md:gap-16 lg:hidden ">
                <div className="flex h-full flex-col">
                  <p className="text-black/50">Written by</p>
                  <div className="flex h-full flex-row">
                    <Avatar className="my-auto flex items-center">
                      <AvatarImage
                        alt={author?.name}
                        src={author?.image.src}
                        width={12}
                        height={12}
                        className="h-full w-full"
                      />
                      <AvatarFallback />
                    </Avatar>
                    <p className="m-0 ml-2 flex items-center justify-center text-nowrap p-0 pt-2 text-black">
                      {author?.name}
                    </p>
                  </div>
                </div>
                <div className="flex h-full flex-col">
                  {" "}
                  <p className="text-nowrap text-xs text-black/50">
                    Published on
                  </p>
                  <div className="mt-2 flex sm:mt-6">
                    <time
                      dateTime={post.date}
                      className="inline-flex items-center text-nowrap text-black"
                    >
                      {format(parseISO(post.date), "MMM dd, yyyy")}
                    </time>
                  </div>
                </div>
              </div>
            </div>
            <div className="prose-sm md:prose-md prose-strong:text-black/90 prose-code:text-black/80 prose-code:bg-white/10 prose-code:px-2 prose-code:py-1 prose-code:border-white/20 prose-code:rounded-md prose-pre:p-0 prose-pre:m-0 prose-pre:leading-6 mt-12 text-black/60 sm:mx-6 lg:pr-24">
              <MDX code={post.mdx} />
            </div>
          </div>

          <div className="prose not-prose top-24 hidden h-full items-start gap-4 space-y-4 pt-8 lg:sticky lg:mt-12 lg:flex lg:w-1/4 lg:flex-col">
            <div className="not-prose flex flex-col gap-4 lg:gap-2">
              <p className="text-sm text-black">Written by</p>
              <div className="mt-1 flex h-full flex-col gap-2 xl:flex-row">
                <Avatar className="mr-4 h-10 w-10">
                  <AvatarImage
                    alt={author?.name}
                    src={author?.image.src}
                    width={12}
                    height={12}
                    className="w-full"
                  />
                  <AvatarFallback />
                </Avatar>
                <p className="my-auto text-nowrap text-black">{author?.name}</p>
              </div>
            </div>
            <div className="not-prose mt-4 flex flex-col gap-4 lg:gap-2">
              <p className="text-nowrap text-sm text-black">Published on</p>
              <time
                dateTime={post.date}
                className="inline-flex h-10 items-center text-nowrap text-black/60"
              >
                {format(parseISO(post.date), "MMM dd, yyyy")}
              </time>
            </div>
            {post.tableOfContents?.length !== 0 ? (
              <div className="not-prose flex flex-col gap-4 lg:gap-2">
                <p className="prose text-nowrap text-sm text-black">
                  Contents
                </p>
                <ul className="relative flex flex-col gap-1 overflow-hidden">
                  {post.tableOfContents.map((heading) => {
                    return (
                      <li key={`#${heading.slug}`}>
                        <Link
                          data-level={heading.level}
                          className={cn({
                            "text-md mt-4 truncate bg-clip-text  font-medium text-black/60 ":
                              heading.level === 1 || heading.level === 2,
                            "ml-4 truncate  bg-clip-text text-sm  leading-8 text-black/60":
                              heading.level === 3 || heading.level === 4,
                          })}
                          href={`#${heading.slug}`}
                        >
                          {heading.text}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
            <div className="mt-4 flex flex-col">
              <p className="text-md pt-10 text-black">Suggested</p>
              <div>
                <SuggestedBlogs currentPostSlug={post.url} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogArticleWrapper;

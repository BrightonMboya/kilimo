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
        url: `https://jani-ai.com${post.image}`,
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
        url: `https://jani-ai.com${post.image}`,
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
            <div className="prose sm:prose-sm md:prose-md sm:mx-6">
              <div className="m-0 mb-8 flex items-center gap-5 p-0 text-xl font-medium leading-8">
                <Link href="/blog">
                  <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent ">
                    Blog
                  </span>
                </Link>
                <span className="">/</span>
                <Link href={`/blog?tag=${post.tags?.at(0)}`}>
                  <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text capitalize text-transparent">
                    {post.tags?.at(0)}
                  </span>
                </Link>
              </div>

              <h1 className="not-prose blog-heading-gradient text-left text-4xl font-medium leading-[56px] tracking-tight  sm:text-5xl sm:leading-[72px]">
                {post.title}
              </h1>
              <p className="not-prose mt-8 text-lg font-medium leading-8  lg:text-xl">
                {post.description}
              </p>
              <div className="flex flex-row justify-stretch gap-8 sm:mt-12 md:gap-16 lg:hidden ">
                <div className="flex h-full flex-col">
                  <p className="">Written by</p>
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
                    <p className="m-0 ml-2 flex items-center justify-center text-nowrap p-0 pt-2">
                      {author?.name}
                    </p>
                  </div>
                </div>
                <div className="flex h-full flex-col">
                  {" "}
                  <p className="text-nowrap text-xs">
                    Published on
                  </p>
                  <div className="mt-2 flex sm:mt-6">
                    <time
                      dateTime={post.date}
                      className="inline-flex items-center text-nowrap"
                    >
                      {format(parseISO(post.date), "MMM dd, yyyy")}
                    </time>
                  </div>
                </div>
              </div>
            </div>
            <div className="prose-sm md:prose-md prose-strong:text-white/90 prose-code:text-white/80 prose-code:bg-white/10 prose-code:px-2 prose-code:py-1 prose-code:border-white/20 prose-code:rounded-md prose-pre:p-0 prose-pre:m-0 prose-pre:leading-6 mt-12 text-white/60 sm:mx-6 lg:pr-24">
              <MDX code={post.mdx} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogArticleWrapper;

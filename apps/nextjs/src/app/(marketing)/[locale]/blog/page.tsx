import { BlogHero } from "./_components/blog-hero";
import { BlogGrid } from "./_components/blog-grid";
// import { CTA } from "@/components/cta";
// import {
//   TopLeftShiningLight,
//   TopRightShiningLight,
// } from "@/components/svg/background-shiny";
// import { MeteorLinesAngular } from "@/components/ui/meteorLines";
import { authors } from "~/content/blog/authors";
import { type Post, allPosts } from "content-collections";
import Link from "next/link";

export const metadata = {
  title: "Blog | Jani AI",
  description: "Latest blog posts and news from JANI AI team.",
  openGraph: {
    title: "Blog | Jani AI",
    description: "Latest blog posts and news from JANI AI team.",
    url: "https://jani-ai.com/blogs",
    siteName: "jani-ai.com",
    images: [
      {
        url: "",
        width: 1200,
        height: 675,
      },
    ],
  },
  twitter: {
    title: "Blog | Jani AI",
    card: "summary_large_image",
  },
};

type Props = {
  searchParams?: {
    tag?: string;
    page?: number;
  };
};

export default async function Blog(props: Props) {

  const posts = allPosts.sort((a: Post, b: Post) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  const blogGridPosts = posts.slice(1, posts.length);

  return (
    <>
      <div className="container mx-auto w-full overflow-hidden scroll-smooth pt-48">
     
        <div className="mx-0 w-full rounded-3xl px-0">
          <Link href={`${posts[0]?.url}`} key={posts[0]?.url}>
            <BlogHero
              tags={posts[0]?.tags}
              imageUrl={
                posts[0]?.image ?? "/images/blog-images/defaultBlog.png"
              }
              title={posts[0]?.title}
              subTitle={posts[0]?.description}
              author={authors[posts[0]?.author!]!}
              publishDate={posts[0]?.date}
            />
          </Link>
        </div>
        <BlogGrid posts={blogGridPosts} searchParams={props.searchParams} />

      </div>
    </>
  );
}

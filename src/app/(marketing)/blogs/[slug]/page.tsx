
import markdownToHtml from "~/utils/functions/markdownToHtml";
import { getAllPosts, getPostBySlug } from "~/utils";
import { Container } from "~/components/ui";
import markdownStyles from "~/components/ui/markdownStyles.module.css";

type Params = {
  params: {
    slug: string;
  };
};

export async function GetBlog() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
  };
}

export default async function Post({ params }: any) {
  const blog = await GetBlogsBySlug({ params });

  //   const router = useRouter();
  //   if (!router.isFallback && !post?.slug) {
  //     return <ErrorPage statusCode={404} />;
  //   }
  return (
    <>
      <Container className="mt-[50px]">
        <>
          <article className="mb-32">
            <h1 className=" text-center text-5xl font-bold leading-tight tracking-tighter md:text-left md:text-7xl md:leading-none ">
              {blog.title}
            </h1>
            <img
              src={blog.author.picture}
              className="mr-4 h-12 w-12 rounded-full"
              alt={blog.author.name}
            />
            <div className="text-xl font-medium">
              {blog.author.name}{" "}
              <span className="font-regular text-sm">{blog.date}</span>
            </div>

            <PostBody content={blog.content} />
          </article>
        </>
        {/* {router.isFallback ? (
            //   <PostTitle>Loading…</PostTitle>
            <h3>Loading</h3>
          ) : (
            
          )} */}
      </Container>
    </>
  );
}

const PostBody = ({ content }: any) => {
  return (
    <div className="mx-auto max-w-2xl">
      <div
        className={markdownStyles["markdown"]}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export async function GetBlogsBySlug({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "coverImage",
  ]);
  const content = await markdownToHtml(post.content || "");

  return {
    ...post,
    content,
    ogUrl: post.slug,
  };
}

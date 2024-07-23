import { getAllPosts } from "~/utils";
import PostList from "./PostList";

interface PostProps {
  postdata: [
    _createdAt: string,
    _id: any,
    _rev: string,
    _type: string,
    _updatedAt: string,
    mainImage: any,
    slug: {
      _type: string;
      current: string;
    },
    body: [],
  ][];
  siteconfig: any;
  preview: any;
}

export default async function BlogReview() {
  const blogs = await GetAllBlogs();
  return (
    <>
      <h3 className="pt-[20px] text-center text-lg font-medium lg:pt-[30px] lg:text-xl">
        Catch up on our Blog
      </h3>
      <section className="mt-5 flex justify-items-center md:grid md:grid-cols-2">
        {blogs.postdata.map((post: any) => (
          <PostList
            // key={post._id}
            key={post.title}
            post={post}
            aspect="square"
          />
        ))}
      </section>
    </>
  );
}

export const GetAllBlogs = async () => {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
  ]);
  return {
    postdata: allPosts,
  };
};

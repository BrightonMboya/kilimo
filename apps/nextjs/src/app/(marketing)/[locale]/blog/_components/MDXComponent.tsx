import { useMDXComponent } from "@content-collections/mdx/react";
import { BlogImage } from "./blog-image";
import { BlogList, BlogListItem, BlogListNumbered } from "./blog-list";
import { BlogQuote } from "./blog-quote";
/** Custom components here!*/

export const MdxComponents = {
  Image: (props: any) => (
    <BlogImage size="sm" imageUrl={props} unoptimize={props.unoptimize} />
  ),
  img: (props: any) => (
    <BlogImage size="sm" imageUrl={props} unoptimize={props.unoptimize} />
  ),
  th: (props: any) => (
    <th
      {...props}
      className="pb-4 text-left text-base font-semibold text-black"
    />
  ),
  tr: (props: any) => (
    <tr {...props} className="border-b-[.75px] border-white/10 text-left" />
  ),
  td: (props: any) => (
    <td
      {...props}
      className="py-4 text-left text-base font-normal text-black/70"
    />
  ),
  a: (props: any) => (
    <a
      {...props}
      aria-label="Link"
      className="text-left text-black underline hover:text-black/60"
    />
  ),
  blockquote: (props: any) => BlogQuote(props),
  BlogQuote: (props: any) => BlogQuote(props),
  ol: (props: any) => BlogListNumbered(props),
  ul: (props: any) => BlogList(props),
  li: (props: any) => BlogListItem(props),
  h1: (props: any) => (
    <h2
      {...props}
      className=" scroll-mt-20 pt-5 text-2xl lg:text-4xl font-extrabold leading-8 text-primary"
    />
  ),
  h2: (props: any) => (
    <h2
      {...props}
      className=" scroll-mt-20 pt-5 text-2xl lg:text-3xl font-bold leading-8 text-primary "
    />
  ),
  h3: (props: any) => (
    <h3
      {...props}
      className=" scroll-mt-20 pt-5 text-xl font-medium leading-8 text-black/60"
    />
  ),
  h4: (props: any) => (
    <h4
      {...props}
      className=" text-lg font-medium leading-8 text-black/60"
    />
  ),
  p: (props: any) => (
    <p
      {...props}
      className="text-left text-lg font-normal leading-8 text-black/90 pt-5"
    />
  ),
  code: (props: any) => (
    <code
      className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 font-medium text-gray-600 before:hidden after:hidden"
      {...props}
    />
  ),
  
};

interface MDXProps {
  code: string;
}

export function MDX({ code }: MDXProps) {
  const Component = useMDXComponent(code);

  return (
    <Component
      components={{
        ...MdxComponents,
      }}
    />
  );
}

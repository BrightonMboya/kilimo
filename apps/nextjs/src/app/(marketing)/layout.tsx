import Layout from "~/components/Layout/HomeLayout";

export default function Page({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

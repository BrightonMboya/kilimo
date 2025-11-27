import { Container } from "~/components/ui";
import markdownStyles from "~/components/ui/markdownStyles.module.css";
import Layout from "~/components/Layout/HomeLayout";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return (
    <Layout>
      <Container className="mt-[100px]">
        <div className={markdownStyles["markdown"]}>{children}</div>
      </Container>
    </Layout>
  );
}

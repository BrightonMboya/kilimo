import Button from "~/components/ui/Button";
import Link from "next/link";

interface Props {
  caption: string;
  title: string;
  link: string;
}

export default function Header({ caption, link, title }: Props) {
  return (
    <div className="flex w-[1000px] items-center justify-between pt-[40px] ">
      <h3 className="text-3xl font-medium ">{caption}</h3>
      <div className="flex items-center gap-2">
        <Button variant="ghost">Export</Button>
        <Link href={link}>
          <Button>{title}</Button>
        </Link>
      </div>
    </div>
  );
}

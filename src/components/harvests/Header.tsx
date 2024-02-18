import Button from "~/components/UI/Button";
import Link from "next/link";

export default function Header({caption}: {caption: string}) {
  return (
    <div className="flex w-[1000px] items-center justify-between pt-[40px] ">
      <h3 className="text-3xl font-medium ">{caption}</h3>
      <div className="flex items-center gap-2">
        <Button
        variant="ghost"
        >Export</Button>
        <Link href="/agri/dashboard/harvests/new">
          <Button>New Harvest</Button>
        </Link>
      </div>
    </div>
  );
}

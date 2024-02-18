import Link from "next/link";

import Button from "~/components/UI/Button";

export default function Header({ name }: { name: string }) {
  return (
    <div className="flex w-[1000px] items-center justify-between pt-[40px] ">
      <h3 className="text-3xl font-medium ">{`${name} Farmers`}</h3>
      <div className="flex items-center gap-2">
        <Link href="/agri/dashboard/farmers/new">
          <Button variant="ghost">View Farmers</Button>
        </Link>
        <Link href="/agri/dashboard/farmers/new">
          <Button>New Farmer</Button>
        </Link>
      </div>
    </div>
  );
}

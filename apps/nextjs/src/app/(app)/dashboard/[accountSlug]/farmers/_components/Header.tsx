import Link from "next/link";

import Button from "~/components/ui/Button";

export default function Header() {
  return (
    <div className="flex w-[1000px] items-center justify-between pt-[40px] ">
      <h3 className="text-3xl font-medium ">All Farmers</h3>
      <div className="flex items-center gap-2">
        <Link href="/dashboard/farmers/new">
          <Button variant="ghost">View Farmers</Button>
        </Link>
        <Link href="/dashboard/farmers/new">
          <Button>New Farmer</Button>
        </Link>
      </div>
    </div>
  );
}

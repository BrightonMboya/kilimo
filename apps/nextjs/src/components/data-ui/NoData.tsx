import BlurImage from "~/components/ui/BlurImage";
import Button from "~/components/ui/Button";
import Link from "next/link";

type NoAssetProps = {
  c2a: string;
  bigTitle: string;
  smallTitle: string;
  c2aUrl: string;
};

export default function NoData({
  c2a,
  bigTitle,
  smallTitle,
  c2aUrl,
}: NoAssetProps) {
  return (
    <div className="mt-[50px] flex h-[500px] w-[1000px] flex-col items-center justify-center rounded-md border-[1px] bg-white shadow-md">
      <div className="relative h-[200px] w-[200px] rounded-full">
        <BlurImage
          imageUrl="https://images.unsplash.com/photo-1520038410233-7141be7e6f97?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJveGVzfGVufDB8fDB8fHww"
          preload={false}
          rounded={true}
        />
      </div>
      <h3 className="mt-5 text-lg font-medium">{bigTitle}</h3>
      <h3 className="pt-2">{smallTitle}</h3>

      <Link href={c2aUrl}>
        <Button className="mt-[30px]">{c2a}</Button>
      </Link>
    </div>
  );
}

export function AssetLabel({
  label,
  caption,
}: {
  label: string;
  caption?: string;
}) {
  return (
    <div className="max-w-[400px] ">
      <h3 className="text-base font-medium">{label}</h3>
      <h3 className="text-sm">{caption}</h3>
    </div>
  );
}

export function ItemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 items-center gap-[50px]">{children}</div>
  );
}

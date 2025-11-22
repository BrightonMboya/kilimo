export function AssetLabel({
  label,
  caption,
}: {
  label: string;
  caption?: string;
}) {
  return (
    <div className="max-w-[400px] ">
      <h3 className="">{label}</h3>
      <h3 className="text-sm">{caption}</h3>
    </div>
  );
}

export function ItemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:grid md:grid-cols-2 md:items-center md:gap-[50px]">{children}</div>
  );
}

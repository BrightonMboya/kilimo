import { Loader2Icon } from "lucide-react";
import Button, { ButtonProps } from "~/components/ui/Button";

export function LoaderButton({
  children,
  isLoading,
  ...props
}: ButtonProps & { isLoading?: boolean }) {
  return (
    <Button
      disabled={isLoading}
      type="submit"
      {...props}
      className="flex justify-center gap-2 px-3 py-2"
    >
      {isLoading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : children}
    </Button>
  );
}

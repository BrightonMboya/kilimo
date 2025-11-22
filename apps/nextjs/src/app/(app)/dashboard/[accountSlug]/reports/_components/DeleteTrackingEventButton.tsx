"use client";
import { Trash2 } from "lucide-react";
import { type UseFieldArrayRemove } from "react-hook-form";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { api } from "~/trpc/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "~/components/ui/Input";
import { Loader2Icon } from "lucide-react";
import Button, { ButtonProps } from "~/components/ui/Button";
import { useToast } from "~/utils/hooks/useToast";

export const deleteSchema = z.object({
  confirm: z.string().refine((v) => v === "Please delete", {
    message: "Please type 'Please delete' to confirm",
  }),
});

interface Props {
  remove: UseFieldArrayRemove;
  idx: number;
  eventId: string;
}

export default function DeleteTrackingEventButton(props: Props) {
  const { remove, idx, eventId } = props;
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof deleteSchema>>({
    resolver: zodResolver(deleteSchema),
    defaultValues: {
      confirm: "",
    },
  });
  const { toast } = useToast();
  const utils = api.useUtils();
  const { isPending, mutateAsync } =
    api.reports.deleteTrackingEvent.useMutation({
      onMutate: () => {},
      onError: (err, event, ctx) => {
        console.log(err);
        toast({
          description: "Failed to delete the tracking event, please try again",
          variant: "destructive",
        });
      },
      onSettled: () => {
        utils.reports.fetchById.invalidate(),
          toast({
            description: "Deleted the event succesfully",
          });
        setIsOpen(false);
      },
      //   onSuccess: () => {
      //     toast({
      //       description: "Deleted the event succesfully",
      //     });
      //   },
    });
  const onSubmit = () => {
    try {
      mutateAsync({ eventId: eventId });
    } catch (cause) {
      console.log(cause);
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="pt-5"
          //   onClick={() => {
          //     remove(idx);
          //   }}
        >
          <Trash2 className="h-5 w-5 text-gray-400 hover:text-gray-500" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This is a destructive operation and you wont be able to undo it.
            Please type <strong>Please delete</strong> to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <LoaderButton
                isLoading={isPending}
                variant="destructive"
                type="button"
                onClick={onSubmit}
              >
                Delete
              </LoaderButton>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function LoaderButton({
  children,
  isLoading,
  ...props
}: ButtonProps & { isLoading?: boolean }) {
  return (
    <Button
      disabled={isLoading}
      type="button"
      {...props}
      className="flex justify-center gap-2 px-3 py-2"
    >
      {isLoading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : children}
    </Button>
  );
}

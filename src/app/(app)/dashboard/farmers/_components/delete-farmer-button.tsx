"use client";

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
import Button from "~/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import Input from "~/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";
import { useToast } from "~/utils/hooks/useToast";
import { LoaderButton } from "~/components/shared/LoaderButton";

export const deleteSchema = z.object({
  confirm: z.string().refine((v) => v === "delete", {
    message: "Please type 'delete' to confirm",
  }),
});

export default function DeleteFarmerButton({ farmerId }: { farmerId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const utils = api.useUtils();
  const { mutateAsync, isLoading } = api.farmers.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Farmer deleted successfully",
        duration: 5000,
      });
    },
    onSettled: () => {
      setIsOpen(false);
      utils.farmers.fetchByOrganization.invalidate();
    },
    onMutate: (data) => {
      utils.farmers.fetchByOrganization.cancel();
      const prevData = utils.farmers.fetchByOrganization.getData();
      const newData = prevData?.filter((farmer) => farmer.id !== data.id);
      utils.farmers.fetchByOrganization.setData(undefined, newData);
      return { prevData };
    },
    onError: (err, data, ctx) => {
      utils.farmers.fetchByOrganization.setData(undefined, ctx?.prevData);
      toast({
        title: "Error",
        description: `${err.message}`,
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const form = useForm<z.infer<typeof deleteSchema>>({
    resolver: zodResolver(deleteSchema),
    defaultValues: {
      confirm: "",
    },
  });
  function onSubmit() {
    mutateAsync({
      id: farmerId,
    });
  }
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-fit" variant="destructive" type="button">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            By deleting this farmer, you are deleting all records such as
            harvests, reports etc assoc. Please type <strong>delete</strong> to
            confirm.
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
              <LoaderButton isLoading={isLoading} variant="destructive">
                Delete
              </LoaderButton>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

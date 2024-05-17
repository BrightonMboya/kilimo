"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppRouter } from "~/server/api/root";
import { inferProcedureInput } from "@trpc/server";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";

import { ToastAction } from "~/components/ui/Toast";
import { useToast } from "~/utils/hooks/useToast";

import { farmersSchema, ValidationSchema } from "../_components/schema";
import NewFarmerForm from "../_components/new-farmer-form";
import { Toaster } from "~/components/ui/Toaster";

export default function Page() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({ resolver: zodResolver(farmersSchema) });
  const utils = api.useUtils();

  const { isLoading, mutateAsync } = api.farmers.addFarmer.useMutation({
    onSuccess: () => {
      toast({
        description: "Farmer added succesfully",
      });
    },
    onMutate: (data) => {
      // cancel any outgoing requests that fetches the farmer
      utils.farmers.fetchByOrganization.cancel();

      // get the prev farmers
      const prevData = utils.farmers.fetchByOrganization.getData();

      // set the data to include the new added one
      utils.farmers.fetchByOrganization.setData(undefined, (old) => [
        // @ts-ignore
        ...old,
        data,
      ]);
      return { prevData };
    },
    onSettled: () => {},
    onError: (error, data, ctx) => {
      utils.farmers.fetchByOrganization.setData(undefined, ctx?.prevData);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: ` ${error.message}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        duration: 1500,
      });
    },
  });

  const [gender, setGender] = React.useState("");

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    router.push("/dashboard/farmers");
    type Input = inferProcedureInput<AppRouter["farmers"]["addFarmer"]>;
    const input: Input = {
      ...data,
      gender,
      organizationEmail: "",
    };

    try {
      mutateAsync(input);
    } catch (cause) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${cause}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        duration: 3500,
      });
    }
  };
  return (
    <main className="max-w-[80%] pb-10 pt-[40px]">
      <h3 className="text-sm font-medium">New Farmer</h3>
      <Toaster />
      <NewFarmerForm
        handleSubmit={handleSubmit}
        register={register}
        onSubmit={onSubmit}
        errors={errors}
        setGender={setGender}
        isLoading={isLoading}
      />
    </main>
  );
}

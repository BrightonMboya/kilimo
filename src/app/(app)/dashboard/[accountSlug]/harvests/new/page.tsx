"use client";
import React, { type ReactElement } from "react";

import Layout from "~/components/Layout/Layout";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NewHarvestForm from "~/components/harvests/NewHarvestForm";
import { api } from "~/trpc/react";
import { useToast } from "~/utils/hooks/useToast";
import {
  harvestsSchema,
  type HarvestSchemaType,
} from "~/app/(app)/dashboard/harvests/_components/schema";

export default function Page() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HarvestSchemaType>({
    resolver: zodResolver(harvestsSchema),
  });

  const { toast } = useToast();
  const utils = api.useUtils();
  const router = useRouter();

  const { mutateAsync, isLoading } = api.harvests.create.useMutation({
    onSuccess: () => {
      toast({
        description: "Succesfully added a new harvest",
      });
      reset();
    },
    onSettled: () => {
      utils.harvests.fetchByOrganization.invalidate();
       router.push(`/dashboard/harvests`);
    },
    // onMutate: (data) => {
    //   utils.harvests.fetchByOrganization.cancel();
    //   const prevData = utils.harvests.fetchByOrganization.getData();
    //   utils.harvests.fetchByOrganization.setData(undefined, (old) => [
    //     // @ts-ignore
    //     ...old,
    //     data,
    //   ]);

    //   return { prevData };
    // },
    onError: (cause, data, ctx) => {
      // utils.harvests.fetchByOrganization.setData(undefined, ctx?.prevData);
      toast({
        variant: "destructive",
        description: "Failed to create a new harvest",
      });
    },
  });

  const onSubmit: SubmitHandler<HarvestSchemaType> = async (data) => {
   
    try {
      mutateAsync({
        ...data,
      });
    } catch (cause) {
      console.log(cause);
      toast({
        variant: "destructive",
        description: "Failed to create a new harvest",
      });
    }
  };

  return (
    <main className="pt-[40px]">
      <h3 className="text-2xl font-medium ">Untitled Harvest</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NewHarvestForm
          register={register}
          control={control}
          errors={errors}
          isLoading={isLoading}
        />
      </form>
    </main>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

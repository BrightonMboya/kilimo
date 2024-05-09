"use client"
import React, { type ReactElement } from "react";
import Button from "~/components/ui/Button";
import Layout from "~/components/Layout/Layout";
import z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NewHarvestForm from "~/components/harvests/NewHarvestForm";
import { api } from "~/trpc/react";
import { useToast } from "~/utils/hooks/useToast";
import { harvestsSchema, type HarvestSchemaType } from "~/app/(app)/dashboard/harvests/_components/schema";



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

  const { mutateAsync, isLoading } = api.harvests.create.useMutation({
    onSuccess: () => {
      toast({
        description: "Succesfully added a new harvest",
      });
      reset();
    },
    onError: () => {
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
        organizationEmail: ""
      });
    } catch (cause) {
      console.log(cause);
      toast({
        variant: "destructive",
        description: "Failed to create a new harvest",
      });
    }
  };

  console.log(errors);

  return (
    <main className="mt-[40px] pl-[30px]">
     
      <h3 className="text-2xl font-medium ">Untitled Harvest</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NewHarvestForm register={register} control={control} errors={errors} />
        <Button
          className="mt-[50px] w-[100px]"
          type="submit"
          disabled={isLoading}
        >
          Save
        </Button>
      </form>
    </main>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { api } from "~/trpc/react";
import {
  harvestsSchema,
  type HarvestSchemaType,
} from "~/app/(app)/dashboard/harvests/_components/schema";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "~/utils/hooks/useToast";
import LoadingSkeleton from "~/components/ui/LoadingSkeleton";
import NewHarvestForm from "~/components/harvests/NewHarvestForm";

import { Toaster } from "~/components/ui/Toaster";
export default function Page() {
  const searchParams = useSearchParams();
  const harvestId = searchParams.get("harvestId");
  const { data, isLoading } = api.harvests.fetchById.useQuery({
    harvestId: harvestId as unknown as string,
  });
  const { toast } = useToast();
  const router = useRouter();
  console.log(data);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<HarvestSchemaType>({
    resolver: zodResolver(harvestsSchema),
    defaultValues: {
      name: data?.name,
      date: data?.date,
      crop: data?.crop,
      unit: data?.unit,
      inputsUsed: data?.inputsUsed,
      size: data?.size,
    },
  });

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("date", data.date);
      setValue("crop", data.crop);
      setValue("unit", data.unit);
      setValue("inputsUsed", data.inputsUsed);
      setValue("size", data.size);
      setValue("farmerId", data.farmersId);
    }
  }, [data, setValue]);

  const editHarvestRouter = api.harvests.editHarvest.useMutation({
    onSuccess: () => {
      console.log("success");
      toast({
        title: "Harvest updated",
        duration: 9000,
      });
    },
    onSettled: () => {
      toast({
        title: "Harvest updated",
        duration: 9000,
      });
      router.push("/dashboard/harvests");
    },
  });
  const onSubmit: SubmitHandler<HarvestSchemaType> = (data) => {
    try {
      editHarvestRouter.mutateAsync({
        id: harvestId as unknown as string,
        ...data,
      });
    } catch (cause) {
      console.log(cause);
      toast({ title: "Failed to edit harvest", duration: 9000 });
    }
  };

  return (
    <>
      {isLoading && <LoadingSkeleton />}
      <Toaster />
      {!isLoading && (
        <main className="mt-[40px] pl-[30px]">
          <h3 className="text-2xl font-medium ">Editing harvest detail</h3>
          <Toaster />
          <form onSubmit={handleSubmit(onSubmit)}>
            <NewHarvestForm
              register={register}
              errors={errors}
              control={control}
              isLoading={editHarvestRouter.isLoading}
            />
          </form>
        </main>
      )}
    </>
  );
}

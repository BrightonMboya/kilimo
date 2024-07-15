"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { api } from "~/trpc/react";

import { Toaster } from "~/components/ui/Toaster";

import {
  FarmersValidationSchema as ValidationSchema,
  farmersSchema,
} from "../_components/schema";
import EditFarmerForm from "./_components/edit-farmer-form";
import { useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useToast } from "~/utils/hooks/useToast";
import LoadingSkeleton from "~/components/ui/LoadingSkeleton";

export default function Page({ params }: { params: { farmersId: string } }) {
  const searchParams = useSearchParams();
  const param = useParams();
  const farmerId = searchParams.get("id");
  const { data, isLoading } = api.farmers.fetchFarmerById.useQuery({
    id: farmerId as unknown as string,
    workspaceSlug: param.accountSlug as unknown as string,
  });
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(farmersSchema),
    defaultValues: {
      fullName: data?.fullName,
      phoneNumber: data?.phoneNumber!,
      farmSize: data?.farmSize,
      province: data?.province,
      country: data?.country,
      crops: data?.crops,
      quantityCanSupply: data?.quantityCanSupply,
    },
  });

  useEffect(() => {
    if (data) {
      setValue("fullName", data.fullName);
      setValue("phoneNumber", data.phoneNumber!);
      setValue("farmSize", data.farmSize);
      setValue("province", data.province);
      setValue("country", data.country);
      setValue("crops", data.crops);
      setValue("quantityCanSupply", data.quantityCanSupply);
    }
  }, [data, setValue]);

  const editFarmerRouter = api.farmers.editFarmer.useMutation({
    onSuccess: () => {
      console.log("success");
      toast({
        title: "Farmer updated",
        duration: 9000,
      });
    },
    onSettled: () => {
      toast({
        title: "Farmer updated",
        duration: 9000,
      });
      router.push(`/dashboard/${param.accountSlug}/farmers`);
    },
  });
  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    try {
      editFarmerRouter.mutateAsync({
        id: farmerId as unknown as string,
        workspaceSlug: param.accountSlug as unknown as string,
        ...data,
      });
    } catch (cause) {
      console.log(cause);
      toast({
        title: "Failed to edit farmer",

        duration: 9000,
      });
    }
  };

  return (
    <>
      {isLoading && <LoadingSkeleton />}
      <Toaster />
      {!isLoading && (
        <main className="mt-[40px] pl-[30px]">
          <h3 className="text-2xl font-medium ">New Farmer</h3>
          <Toaster />
          <EditFarmerForm
            register={register}
            errors={errors}
            onSubmit={onSubmit}
            handleSubmit={handleSubmit}
            isLoading={editFarmerRouter.isLoading}
          />
        </main>
      )}
    </>
  );
}

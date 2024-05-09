"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useToast } from "~/utils/hooks/useToast";
import { api } from "~/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "~/components/ui/Button";
import NewEquipmentForm from "../_components/NewEquipmentForm";
import {
  type EquipmentSchemaType,
  equipmentSchema,
} from "../_components/schema";

export default function Index() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EquipmentSchemaType>({
    resolver: zodResolver(equipmentSchema),
  });

  const { isLoading, mutateAsync } = api.equipments.create.useMutation({
    onSuccess: () => {
      toast({
        description: "New Equipment Added Succesfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Failed to add new equipment",
      });
    },
  });
  const { toast } = useToast();

  const onSubmit: SubmitHandler<EquipmentSchemaType> = (data) => {
    console.log(data);
  };

  return (
    <main className="pl-5">
      <h3 className="text-2xl font-medium ">New Equipment</h3>
      <form
        className="relative mt-[50px] flex flex-col space-y-[30px] "
        onSubmit={handleSubmit(onSubmit)}
      >
        <NewEquipmentForm
          control={control}
          register={register}
          errors={errors}
        />
        <Button disabled={isLoading}>Save</Button>
      </form>
    </main>
  );
}

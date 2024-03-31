import type { ReactElement } from "react";

import Layout from "~/components/Layout/Layout";
import { Header, NoAsset } from "~/components/harvests";
import z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useToast } from "~/hooks/useToast";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "~/components/ui/Button";
import NewEquipmentForm from "~/components/equipments/NewEquipmentForm";

export const equipmentSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  leased: z.boolean(),
  dateAcquired: z.date(),
  purchasePrice: z.string().min(1),
  estimatedValue: z.string().min(1),
  brand: z.string().min(1),
  status: z.string().min(1),
});

export type EquipmentSchemaType = z.infer<typeof equipmentSchema>;

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
  const { user } = useUser();
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

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

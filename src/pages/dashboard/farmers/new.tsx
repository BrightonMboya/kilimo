import React, { type ReactElement } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppRouter } from "~/server/api/root";
import { inferProcedureInput } from "@trpc/server";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "~/utils/api";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import { Textarea } from "~/components/ui/TextArea";
import { ToastAction } from "~/components/ui/Toast";
import { Toaster } from "~/components/ui/Toaster";
import { Icons } from "~/components/ui/icons";
import Layout from "~/components/Layout/Layout";
import { GenderDropDown } from "~/components/farmers/GenderDropDown";
import { useToast } from "~/hooks/useToast";

export const schema = z.object({
  fullName: z.string(),
  phoneNumber: z.string(),
  farmSize: z.number(),
  quantityCanSupply: z.number(),
  province: z.string(),
  cropTheySell: z.string(),
  description: z.string(),
});

export type ValidationSchema = z.infer<typeof schema>;

export function AssetLabel({
  label,
  caption,
}: {
  label: string;
  caption?: string;
}) {
  return (
    <div className="max-w-[400px] ">
      <h3 className="text-base font-medium">{label}</h3>
      <h3 className="text-sm">{caption}</h3>
    </div>
  );
}

export function ItemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 items-center gap-[50px]">{children}</div>
  );
}

export default function Page() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({ resolver: zodResolver(schema) });

  const { isLoading, mutateAsync } = api.organization.addFarmer.useMutation({
    onSuccess: () => {
      router.push("/agri/dashboard/farmers");
    },
    onError: (error) => {
      console.log("I have started toooh");
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
  const { user } = useUser();

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    type Input = inferProcedureInput<AppRouter["organization"]["addFarmer"]>;
    const input: Input = {
      ...data,
      gender,
      email: user?.primaryEmailAddress?.emailAddress as unknown as string,
    };

    try {
      console.log("I have started mutating");
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
    <main className="mt-[40px] pl-[30px]">
      <h3 className="text-2xl font-medium ">New Farmer</h3>
      <Toaster />
      <form
        className="relative mt-[50px] flex flex-col space-y-[30px] "
        onSubmit={handleSubmit(onSubmit)}
      >
        <ItemLayout>
          <AssetLabel label="Full Name" />
          <Input placeholder="John Doe" {...register("fullName")} />
        </ItemLayout>

        <ItemLayout>
          <AssetLabel label="Phone Number" />
          <Input placeholder="+260 780348912" {...register("phoneNumber")} />
        </ItemLayout>

        <ItemLayout>
          <AssetLabel label="Gender" caption="Gender of the farmer " />
          <GenderDropDown setGender={setGender} />
        </ItemLayout>

        <ItemLayout>
          <AssetLabel
            label="Crops Produce"
            caption="What crops does this farmer produce"
          />
          <Input placeholder="Pineapples" {...register("cropTheySell")} />
        </ItemLayout>

        <ItemLayout>
          <AssetLabel
            label="Quantity"
            caption="Quantity in kg this farmer produce on a single harvest"
          />
          <Input
            placeholder="50"
            {...register("quantityCanSupply", { valueAsNumber: true })}
            type="number"
          />
          {errors?.quantityCanSupply?.message && (
            <span className="text-sm text-red-500">
              `${errors.quantityCanSupply.message}`
            </span>
          )}
        </ItemLayout>

        <ItemLayout>
          <AssetLabel
            label="Farm Size"
            caption="What is the farm size of this farmer in Acres"
          />
          <Input
            placeholder="30"
            {...register("farmSize", { valueAsNumber: true })}
            type="number"
          />
          {errors?.farmSize?.message && (
            <span className="text-sm text-red-500">
              `${errors.farmSize.message}`
            </span>
          )}
        </ItemLayout>

        {/* <ItemLayout>
          <AssetLabel label="Country" caption="" />
          <Input placeholder="Zambia" />
        </ItemLayout> */}

        <ItemLayout>
          <AssetLabel
            label="Province"
            caption="Which province is this farmer from"
          />
          <Input placeholder="Kasumbalesa" {...register("province")} />
        </ItemLayout>

        <ItemLayout>
          <AssetLabel
            label="Notes"
            caption="Enter additional details about this farmer"
          />

          <Textarea
            placeholder="Add short notes about this farmer"
            {...register("description")}
          />
        </ItemLayout>
        <Button className="mt-[50px] w-full" type="submit">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </form>
    </main>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

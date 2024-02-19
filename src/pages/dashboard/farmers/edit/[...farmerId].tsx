import { useState, type ReactElement } from "react";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { api } from "~/utils/api";
import { Button, Input } from "~/components/UI";
import { Textarea } from "~/components/UI/TextArea";
import { ToastAction } from "~/components/UI/Toast";
import { Toaster } from "~/components/UI/Toaster";
import { Icons } from "~/components/UI/icons";
import Layout from "~/components/Layout/HomeLayout";
import { GenderDropDown } from "~/components/farmers/GenderDropDown";
import { AssetLabel, ItemLayout, ValidationSchema, schema } from "../new";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({ resolver: zodResolver(schema) });

  const [gender, setGender] = useState("");
  const router = useRouter();
  const { data, isLoading } = api.organization.fetchFarmerById.useQuery({
    id: router.query.farmerId as unknown as number,
  });
  console.log(typeof router.query.farmerId, "router id");

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {};
  return (
    <>
      {!isLoading && (
        <main className="mt-[40px] pl-[30px]">
          <h3 className="text-2xl font-medium ">New Farmer</h3>
          <Toaster />
          <form
            className="relative mt-[50px] flex flex-col space-y-[30px] "
            onSubmit={handleSubmit(onSubmit)}
          >
            <ItemLayout>
              <AssetLabel label="Full Name" />
              <Input
                placeholder="John Doe"
                {...register("fullName")}
                // value={data?.fullName}
              />
            </ItemLayout>

            <ItemLayout>
              <AssetLabel label="Phone Number" />
              <Input
                placeholder="+260 780348912"
                {...register("phoneNumber")}
              />
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
              {/* {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />} */}
              Save
            </Button>
          </form>
        </main>
      )}
    </>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

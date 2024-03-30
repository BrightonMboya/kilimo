import React, { type ReactElement } from "react";

import Button from "~/components/ui/Button";
import { DatePicker } from "~/components/ui/DatePicker";
import Input from "~/components/ui/Input";
import { Textarea } from "~/components/ui/TextArea";
import Layout from "~/components/Layout/Layout";
import z from "zod";
import FarmerPicker from "~/components/harvests/FarmersPicker";
import { AssetLabel, ItemLayout } from "~/components/Layout/ItemLayout";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const harvestsSchema = z.object({
  date: z.date(),
  farmerId: z.string().min(1),
  name: z.string().min(1),
  crop: z.string().min(1),
  size: z.string().min(1),
  unit: z.string().min(1),
});

export type HarvestSchemaType = z.infer<typeof harvestsSchema>;

export default function Page() {
  const {
    control,
    register,
    handleSubmit,
    formState: errors,
  } = useForm<HarvestSchemaType>({
    resolver: zodResolver(harvestsSchema),
  });

  const onSubmit: SubmitHandler<HarvestSchemaType> = async (data) => {
    console.log(data);
  };
  return (
    <main className="mt-[40px] pl-[30px]">
      <h3 className="text-2xl font-medium ">Untitled Harvest</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="relative mt-[50px] flex flex-col space-y-[30px] ">
          <ItemLayout>
            <AssetLabel
              label="Farmer Name"
              caption="Choose the name of the farmer from the drop down list"
            />
            <Controller
              control={control}
              name="farmerId"
              render={({ field }) => <FarmerPicker field={field} />}
            />
          </ItemLayout>

          <ItemLayout>
            <AssetLabel
              label="Crop Name"
              caption="What is the name of the crop harvested?"
            />
            <Input placeholder="Kapenta Siavonga" />
          </ItemLayout>

          <ItemLayout>
            <AssetLabel
              label="Date of Harvest"
              caption="When was this harvested"
            />
            <DatePicker />
          </ItemLayout>

          <ItemLayout>
            <AssetLabel
              label="Quantity"
              caption="What was the quantity of the harvest, the measurement unit can be specified in the description below"
            />

            <Input placeholder="100" />
          </ItemLayout>

          <ItemLayout>
            <AssetLabel
              label="Inputs Used"
              caption="List of the inputs used in this harvest"
            />
            <Input placeholder="npk fertilizer, potassium fertilizer" />
          </ItemLayout>

          <ItemLayout>
            <AssetLabel
              label="Description"
              caption="Add additional details of the harvest like unit of measurement"
            />

            <Textarea placeholder="Add a description of the harvest" />
          </ItemLayout>
        </section>
        <Button className="mt-[50px] w-[100px]">Save</Button>
      </form>
    </main>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

import React, { type ReactElement } from "react";

import Button from "~/components/UI/Button";
import { DatePicker } from "~/components/UI/DatePicker";
import Input from "~/components/UI/Input";
import { Textarea } from "~/components/UI/TextArea";
import Layout from "~/components/Layout/Layout"
import CategoryDropDown from "~/components/harvests/CategoryDropDown";

function AssetLabel({ label, caption }: { label: string; caption?: string }) {
  return (
    <div className="max-w-[400px] ">
      <h3 className="text-base font-medium">{label}</h3>
      <h3 className="text-sm">{caption}</h3>
    </div>
  );
}

function ItemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 items-center gap-[50px]">{children}</div>
  );
}

export default function Page() {
  return (
    <main className="mt-[40px] pl-[30px]">
      <h3 className="text-2xl font-medium ">Untitled Harvest</h3>
      <section className="relative mt-[50px] flex flex-col space-y-[30px] ">
        <ItemLayout>
          <AssetLabel
            label="Farmer Name"
            caption="Choose the name of the farmer from the drop down list"
          />
          <CategoryDropDown />
        </ItemLayout>

        <ItemLayout>
          <AssetLabel
            label="Crop Name"
            caption="What is the name of the crop harvested?"
          />
          <Input placeholder="Kapenta Siavonga"/>
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
          <Input placeholder="npk fertilizer, potassium fertilizer"/>
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
    </main>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

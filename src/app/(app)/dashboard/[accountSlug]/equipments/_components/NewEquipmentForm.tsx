"use client";
import {
  Controller,
  UseFormRegister,
  Control,
  FieldErrors,
} from "react-hook-form";
import { AssetLabel, ItemLayout } from "~/components/Layout/ItemLayout";
import { Input } from "~/components/ui";
import { EquipmentSchemaType } from "./schema";

interface Props {
  errors: FieldErrors<EquipmentSchemaType>;
  register: UseFormRegister<EquipmentSchemaType>;
  control: Control<EquipmentSchemaType>;
}

export default function NewEquipmentForm({}: Props) {
  return (
    <section className="relative mt-[50px] flex flex-col space-y-[30px] ">
      <ItemLayout>
        <AssetLabel
          label="Harvest Name"
          caption="Give this harvest a descriptive name"
        />
      </ItemLayout>
    </section>
  );
}

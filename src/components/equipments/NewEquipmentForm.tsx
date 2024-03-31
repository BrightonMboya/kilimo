import {
  Controller,
  UseFormRegister,
  Control,
  FieldErrors,
} from "react-hook-form";
import { AssetLabel, ItemLayout } from "../Layout/ItemLayout";
import { Input } from "../ui";
import { EquipmentSchemaType } from "~/pages/dashboard/equipments/new";

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

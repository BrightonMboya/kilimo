import {
  Controller,
  UseFormRegister,
  Control,
  FieldErrors,
} from "react-hook-form";
import { AssetLabel, ItemLayout } from "../Layout/ItemLayout";
import { Input } from "../ui";
import { HarvestDatePicker } from "./HarvestDatePicker";
import { HarvestSchemaType } from "~/app/(app)/dashboard/harvests/new/page";
import FarmersPicker from "./FarmersPicker";

interface Props {
  register: UseFormRegister<HarvestSchemaType>;
  control: Control<HarvestSchemaType>;
  errors: FieldErrors<HarvestSchemaType>;
}

export default function NewHarvestForm({ register, errors, control }: Props) {
  return (
    <section className="relative mt-[50px] flex flex-col space-y-[30px] ">
      <ItemLayout>
        <AssetLabel
          label="Harvest Name"
          caption="Give this harvest a descriptive name"
        />
        <div>
          <Input
            placeholder="2023 Mbeya Avocado Harvest"
            {...register("name")}
          />
          {errors?.name && (
            <p className="text-sm text-red-500">Harvest Name is required</p>
          )}
        </div>
      </ItemLayout>
      <ItemLayout>
        <AssetLabel
          label="Farmer Name"
          caption="Choose the name of the farmer from the drop down list"
        />
        <div>
          <Controller
            control={control}
            name="farmerId"
            render={({ field }) => <FarmersPicker field={field} />}
          />
          {errors?.farmerId && (
            <p className="text-sm text-red-500">Farmers Name is required</p>
          )}
        </div>
      </ItemLayout>

      <ItemLayout>
        <AssetLabel
          label="Crop Name"
          caption="What is the name of the crop harvested?"
        />
        <div>
          <Input placeholder="Kapenta Siavonga" {...register("crop")} />
          {errors?.crop && (
            <p className="text-sm text-red-500">Crop Name is required</p>
          )}
        </div>
      </ItemLayout>

      <ItemLayout>
        <AssetLabel label="Date of Harvest" caption="When was this harvested" />
        <div>
          <Controller
            control={control}
            name="date"
            render={({ field }) => <HarvestDatePicker field={field} />}
          />

          {errors?.date && (
            <p className="text-sm text-red-500">
              When was this harvest happen?
            </p>
          )}
        </div>
      </ItemLayout>

      <ItemLayout>
        <AssetLabel
          label="Quantity"
          caption="What was the quantity of the harvest, the measurement unit can be specified in the description below"
        />
        <div>
          <Input
            placeholder="100"
            type="number"
            {...register("size", { valueAsNumber: true })}
          />
          {errors?.size && (
            <p className="text-sm text-red-500">
              What is the size of this harvest
            </p>
          )}
        </div>
      </ItemLayout>

      <ItemLayout>
        <AssetLabel
          label="Units"
          caption="Is this harvest recorded in tonnes, kg, or sacks"
        />
        <div>
          <Input placeholder="Kg" {...register("unit")} />
          {errors?.unit && (
            <p className="text-sm text-red-500">
              Enter the units used in the harvest
            </p>
          )}
        </div>
      </ItemLayout>

      <ItemLayout>
        <AssetLabel
          label="Inputs Used"
          caption="List of the inputs used in this harvest"
        />
        <div>
          <Input
            placeholder="npk fertilizer, potassium fertilizer"
            {...register("inputsUsed")}
          />
          {errors?.inputsUsed && (
            <p className="text-sm text-red-500">
              Enter the units used in the harvest
            </p>
          )}
        </div>
      </ItemLayout>
    </section>
  );
}

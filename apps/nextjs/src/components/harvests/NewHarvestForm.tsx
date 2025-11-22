"use client";
import {
  Controller,
  UseFormRegister,
  Control,
  FieldErrors,
} from "react-hook-form";
import Input from "~/components/shared/Input";
import { DatePicker } from "../ui/DatePicker";
import { type HarvestSchemaType } from "@kilimo/api/schemas/harvests";
import FarmersPicker from "./FarmersPicker";
import { Card } from "../shared/empty/Card";
import Button from "../ui/Button";
import FormRow from "../shared/FormRow";

interface Props {
  register: UseFormRegister<HarvestSchemaType>;
  control: Control<HarvestSchemaType>;
  errors: FieldErrors<HarvestSchemaType>;
  isLoading: boolean;
}

export default function NewHarvestForm({
  register,
  errors,
  control,
  isLoading,
}: Props) {
  return (
    <Card className="w-full md:w-min">
      <section className=" ">
        <FormRow
          rowLabel="Harvest Name"
          className="border-b-0 pb-[10px]"
          subHeading={<p>Give this harvest a descriptive name</p>}
        >
          <Input
            label="Harvest Name"
            className="w-full"
            hideLabel
            {...register("name")}
            error={errors?.name?.message}
          />
        </FormRow>

        <FormRow
          rowLabel="Farmer's Name"
          subHeading={
            <p>Choose the name of the farmer from the drop down list</p>
          }
          className="border-b-0 pb-[10px]"
        >
          <Controller
            control={control}
            name="farmerId"
            render={({ field }) => <FarmersPicker field={field} />}
          />
          {errors?.farmerId && (
            <p className="text-sm text-red-500">Farmers Name is required</p>
          )}
        </FormRow>

        <FormRow
          subHeading={<p>What is the name of the crop harvested?</p>}
          className="border-b-0 pb-[10px]"
          rowLabel="Crop Name"
        >
          <Input
            error={errors?.crop?.message}
            label="Crop Name"
            hideLabel
            {...register("crop")}
            className="w-full"
          />
        </FormRow>

        <FormRow
          subHeading={<p>When was this harvested</p>}
          className="border-b-0 pb-[10px]"
          rowLabel="Harvest Date"
        >
          <Controller
            control={control}
            name="date"
            render={({ field }) => <DatePicker field={field} />}
          />

          {errors?.date && (
            <p className="text-sm text-red-500">
              When was this harvest happen?
            </p>
          )}
        </FormRow>

        <FormRow
          subHeading={
            <p>
              What was the quantity of the harvest, the measurement unit can be
              specified in the description below
            </p>
          }
          className="border-b-0 pb-[10px]"
          rowLabel="Quantity"
        >
          <Input
            type="number"
            error={errors?.size?.message}
            label="Quantity"
            hideLabel
            className="w-full"
            {...register("size", { valueAsNumber: true })}
          />
        </FormRow>

        <FormRow
          subHeading={<p>Is this harvest recorded in tonnes, kg, or sack</p>}
          className="border-b-0 pb-[10px]"
          rowLabel="Units"
        >
          <Input
            label="Units"
            hideLabel
            className="w-full"
            error={errors?.unit?.message}
            {...register("unit")}
          />
        </FormRow>

        <FormRow
          subHeading={<p>List of the inputs used in this harvest</p>}
          className="border-b-0 pb-[10px]"
          rowLabel="Inputs Used"
        >
          <Input
            className="w-full"
            error={errors?.inputsUsed?.message}
            label="Inputs Used"
            hideLabel
            {...register("inputsUsed")}
          />
        </FormRow>
      </section>
      <Button
        className="mt-[50px] w-[300px] text-base"
        type="submit"
        disabled={isLoading}
      >
        Save
      </Button>
    </Card>
  );
}

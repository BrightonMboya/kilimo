"use client";
import { Card } from "~/components/shared/empty/Card";
import FormRow from "~/components/shared/FormRow";
import Input from "~/components/shared/Input";
import {
  Controller,
  UseFormRegister,
  Control,
  FieldErrors,
} from "react-hook-form";
import { reportSchema, type IReportSchema } from "./schema";

interface Props {
  register: UseFormRegister<IReportSchema>;
  control: Control<IReportSchema>;
  errors: FieldErrors<IReportSchema>;
  isLoading: boolean;
}

export default function NewReportForm({
  register,
  errors,
  control,
  isLoading,
}: Props) {
  return (
    <Card className="w-full md:w-min">
      <section className=" ">
        <FormRow
          rowLabel="Report Name"
          className="border-b-0 pb-[10px]"
          subHeading={<p>Give this report a descriptive name</p>}
        >
          <Input
            label="Report Name"
            className="w-full"
            hideLabel
            {...register("name")}
            error={errors?.name?.message}
          />
        </FormRow>

        <FormRow></FormRow>
      </section>
    </Card>
  );
}

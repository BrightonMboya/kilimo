"use client";
import { Card } from "~/components/shared/empty/Card";
import FormRow from "~/components/shared/FormRow";
import Input from "~/components/shared/Input";
import {
  Controller,
  UseFormRegister,
  Control,
  FieldErrors,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { reportSchema, type IReportSchema } from "./schema";
import { HarvestDatePicker } from "~/components/harvests/HarvestDatePicker";
import TrackingEventsForm from "./TrackingEventsForm";

interface Props {
  register: UseFormRegister<IReportSchema>;
  control: Control<IReportSchema>;
  errors: FieldErrors<IReportSchema>;
  isLoading: boolean;
}

export default function NewReportForm({ isLoading }: Props) {
  const {
    register,
    formState: { errors },
    control,
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "trackingEvents",
  });

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

        <FormRow
          rowLabel="Harvest Name"
          subHeading={<p>Each treaceability report should include a harvest</p>}
          className="border-b-0 pb-[10px]"
        >
          <Controller
            control={control}
            name="harvestId"
            render={({ field }) => <p>some harvest picker component</p>}
          />
        </FormRow>
        <FormRow
          subHeading={<p>Let's begin the traceability with a date</p>}
          className="pb-[10px]"
          rowLabel="Date"
        >
          <Controller
            control={control}
            name="dateCreated"
            render={({ field }) => <HarvestDatePicker field={field} />}
          />

          {errors?.dateCreated && (
            <p className="text-sm text-red-500">
              When was this report created?
            </p>
          )}
        </FormRow>

        <FormRow
          children={null}
          rowLabel="Tracking Events"
          subHeading={
            <p>
              Tracking events are helps you to track the different processes
              that occurs your supply chain
            </p>
          }
          className="border-b-0"
        />

        <TrackingEventsForm />
      </section>
    </Card>
  );
}

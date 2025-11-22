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
} from "react-hook-form";
import { defaultReportEventsObjects, type IReportSchema } from "@kilimo/api/schemas/reports";
import { DatePicker } from "~/components/ui/DatePicker";
import TrackingEventsForm from "./TrackingEventsForm";
import Button from "~/components/ui/Button";
import HarvestPicker from "./HarvestPicker";

interface Props {
  register: UseFormRegister<IReportSchema>;
  control: Control<IReportSchema>;
  errors: FieldErrors<IReportSchema>;
  isLoading: boolean;
}

export default function NewReportForm(props: Props) {
  const { control, register, errors, isLoading } = props;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "trackingEvents",
  });

  return (
    <Card className="w-full md:w-min">
      <section className="">
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
            render={({ field }) => <HarvestPicker field={field} />}
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
            render={({ field }) => <DatePicker field={field} />}
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

        <TrackingEventsForm
          fields={fields}
          append={append}
          remove={remove}
          register={register}
          control={control}
          errors={errors}
        />

        <Button className="mt-10 w-full" type="submit" disabled={isLoading}>
          Create Report
        </Button>
      </section>
    </Card>
  );
}

"use client";
import {
  Controller,
  useFieldArray,
  type UseFormRegister,
  type Control,
  type FieldErrors,
  type SubmitHandler,
  UseFormSetValue,
} from "react-hook-form";
import { type IReportSchema } from "@kilimo/api/schemas/reports";
import { Card } from "~/components/shared/empty/Card";
import FormRow from "~/components/shared/FormRow";
import Input from "~/components/shared/Input";
import { DatePicker } from "~/components/ui/DatePicker";
// import TrackingEventsForm from "./TrackingEventsForm";
import EditTrackingEvents from "./EditTrackingEvents";
import Button from "~/components/ui/Button";
import HarvestPicker from "./HarvestPicker";
import { useEffect } from "react";
import { api } from "~/trpc/react";
import LoadingSkeleton, { Spinner } from "~/components/ui/LoadingSkeleton";
import { useParams } from "next/navigation";

interface Props {
  register: UseFormRegister<IReportSchema>;
  control: Control<IReportSchema>;
  setValue: UseFormSetValue<IReportSchema>;
  reportId: string;
  errors: FieldErrors<IReportSchema>;
  onSubmit: SubmitHandler<IReportSchema>;
  isMutating: boolean;
}

const EditReportForm = (props: Props) => {
  const { control, register, setValue, errors, reportId, isMutating } = props;
  const params = useParams();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "trackingEvents",
  });
  const { data, isLoading, isError } = api.reports.fetchById.useQuery({
    reportId: reportId,
    workspaceSlug: params.accountSlug as unknown as string,
  });

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("harvestId", data.harvestsId);
      setValue("dateCreated", new Date(data.dateCreated));
      setValue(
        "trackingEvents",
        data.ReportTrackingEvents.map((event) => ({
          eventName: event.eventName,
          dateCreated: new Date(event.dateCreated),
          description: event.description,
          eventId: event.id,
          id: event.id,
        })),
      );
    }
  }, [data, setValue]);

  return (
    <>
      {isLoading && <LoadingSkeleton />}
      {!isLoading && !isError && data?.ReportTrackingEvents && (
        <Card className="w-full md:w-min">
          <h3 className="text-lg">{`Editing the ${data?.name} Report`}</h3>
          <section>
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
              />
            </FormRow>

            <FormRow
              rowLabel="Harvest Name"
              subHeading={
                <p>Each traceability report should include a harvest</p>
              }
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
                render={({ field }) => (
                  <DatePicker
                    field={field}
                    defaultDate={new Date(field.value)}
                  />
                )}
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
                  Tracking events help you to track the different processes that
                  occur in your supply chain
                </p>
              }
              className="border-b-0"
            />

            <EditTrackingEvents
              fields={fields}
              append={append}
              remove={remove}
              register={register}
              control={control}
              errors={errors}
            />
            <Button
              className="mt-10 w-full"
              type="submit"
              disabled={isMutating}
            >
              {isMutating && <Spinner />}
              Save Changes
            </Button>
          </section>
        </Card>
      )}
    </>
  );
};

export default EditReportForm;

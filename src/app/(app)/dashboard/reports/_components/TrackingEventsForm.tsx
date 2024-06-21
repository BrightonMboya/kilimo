"use client";
import {
  Controller,
  type FieldErrors,
  type UseFormRegister,
  type UseFieldArrayRemove,
  type Control,
  UseFieldArrayAppend,
} from "react-hook-form";
import FormRow from "~/components/shared/FormRow";
import Input from "~/components/shared/Input";
import { defaultReportEventsObjects, type IReportSchema } from "./schema";
import Button from "~/components/ui/Button";
import { Trash2 } from "lucide-react";
import { DatePicker } from "~/components/ui/DatePicker";

interface TrackingEventsFormProps {
  remove: UseFieldArrayRemove;
  fields: any;
  append: UseFieldArrayAppend<IReportSchema>;
  register: UseFormRegister<IReportSchema>;
  control: Control<IReportSchema>;
  errors: FieldErrors<IReportSchema>;
}

export default function TrackingEventsForm(props: TrackingEventsFormProps) {
  const { remove, fields, append, register, control, errors } = props;
  

  let eventIndex: number;
  const fieldSections = fields.map((field: { id: any }, idx: number) => {
    const { id } = field;
    eventIndex = idx;
    return (
      <EventsForm
        idx={idx}
        key={id}
        control={control}
        register={register}
        errors={errors}
        remove={remove}
      />
    );
  });
  return (
    <>
      <section>
        {fieldSections}
        <div>
          <Button
            className="mt-10 w-[200px]"
            type="button"
            onClick={() => {
              append({ ...defaultReportEventsObjects });
            }}
          >
            Add Tracking Event
          </Button>
        </div>
      </section>
    </>
  );
}

interface EventFormProps {
  idx: number;
  control: Control<IReportSchema>;
  register: UseFormRegister<IReportSchema>;
  errors: FieldErrors<IReportSchema>;
  remove: UseFieldArrayRemove;
}

function EventsForm(props: EventFormProps) {
  const { idx, control, register, errors, remove } = props;
  return (
    <section className="mt-5">
      <FormRow
        rowLabel="Tracking Event Name"
        subHeading={<p>A tracking event can be "Received at the warehouse"</p>}
        className="border-b-0 pb-[10px]"
      >
        <Input
          label="name"
          className="w-full"
          hideLabel
          {...register(`trackingEvents.${idx}.eventName`)}
        />
      </FormRow>

      <FormRow
        rowLabel="Tracking Event Date"
        className="border-b-0 pb-[10px]"
        subHeading={<p>When did this event happen?</p>}
      >
        <Controller
          control={control}
          name={`trackingEvents.${idx}.dateCreated`}
          render={({ field }) => (
            <div className="w-full">
              <DatePicker field={field} />
            </div>
          )}
        />
      </FormRow>

      <FormRow
        rowLabel="Tracking Event Description"
        subHeading={
          <p>
            A description of this event, it can include details like warehouse
            location, etc.
          </p>
        }
        className=""
      >
        <div className="flex w-full flex-col items-end">
          <Input
            label="description"
            className="w-full"
            hideLabel
            {...register(`trackingEvents.${idx}.description`)}
          />
          <button
            type="button"
            className="pt-5"
            onClick={() => {
              remove(idx);
            }}
          >
            <Trash2 className="h-5 w-5 text-gray-400 hover:text-gray-500" />
          </button>
        </div>
      </FormRow>
    </section>
  );
}

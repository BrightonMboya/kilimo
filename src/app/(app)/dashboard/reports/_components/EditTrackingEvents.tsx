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
import DeleteTrackingEventButton from "./DeleteTrackingEventButton";
import { v4 as uuidv4 } from "uuid";

interface TrackingEventsFormProps {
  remove: UseFieldArrayRemove;
  fields: any;
  append: UseFieldArrayAppend<IReportSchema>;
  register: UseFormRegister<IReportSchema>;
  control: Control<IReportSchema>;
  errors: FieldErrors<IReportSchema>;
}

export default function EditTrackingEvents(props: TrackingEventsFormProps) {
  const { remove, fields, append, register, control, errors } = props;

  let eventIndex: number;
  const fieldSections = fields.map(
    (field: { id: string; eventId: string }, idx: number) => {
      const { id, eventId } = field;
      eventIndex = idx;

      return (
        <EventsForm
          idx={idx}
          key={id}
          control={control}
          register={register}
          errors={errors}
          remove={remove}
          eventId={field.eventId || field.id}
        />
      );
    },
  );
  return (
    <>
      <section>
        {fieldSections}
        <div>
          <Button
            className="mt-10 w-[200px]"
            type="button"
            onClick={() => {
              append({
                ...defaultReportEventsObjects,
                id: uuidv4(),
                isItNew: true,
              });
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
  eventId: string;
}

function EventsForm(props: EventFormProps) {
  const { idx, control, register, errors, remove, eventId } = props;
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
              <DatePicker field={field} defaultDate={new Date(field.value)} />
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
          <DeleteTrackingEventButton
            remove={remove}
            idx={idx}
            eventId={eventId}
          />
        </div>
      </FormRow>
    </section>
  );
}

import {
  Controller,
  type FieldErrors,
  type UseFormRegister,
  useFieldArray,
  type UseFieldArrayRemove,
  useForm,
  type Control,
} from "react-hook-form";
import { HarvestDatePicker } from "~/components/harvests/HarvestDatePicker";
import FormRow from "~/components/shared/FormRow";
import Input from "~/components/shared/Input";
import {
  type ITrackingEventsSchema,
  trackingEventsSchema,
  defaultReportEventsObjects,
} from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "~/components/ui/Button";
import { Trash2 } from "lucide-react";

export default function TrackingEventsForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ITrackingEventsSchema>({
    resolver: zodResolver(trackingEventsSchema),
    defaultValues: {
      trackingEvents: [{ ...defaultReportEventsObjects }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    //^?
    control,
    name: "trackingEvents",
  });

  let eventIndex: number;
  const fieldSections = fields.map((field, idx) => {
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
      <form>
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

          {/* <Button
            className="mt-10 w-[200px]"
            type="button"
            onClick={() => {
              remove(eventIndex);
            }}
          >
            Remove
          </Button> */}
        </div>

        <Button className="mt-10 w-full" type="submit">
          Save & Next
        </Button>
      </form>
    </>
  );
}

interface EventFormProps {
  idx: number;
  control: Control<ITrackingEventsSchema>;
  register: UseFormRegister<ITrackingEventsSchema>;
  errors: FieldErrors<ITrackingEventsSchema>;
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
              <HarvestDatePicker field={field} />
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

"use client";

import EditReportForm from "../_components/EditReportForm";
import {
  useForm,
  Controller,
  useFieldArray,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type IReportSchema, reportSchema } from "../_components/schema";

export default function Page() {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IReportSchema>({
    resolver: zodResolver(reportSchema),
  });
  console.log(errors);
  const onSubmit: SubmitHandler<IReportSchema> = (data) => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <EditReportForm
        register={register}
        control={control}
        setValue={setValue}
        errors={errors}
        reportId="clxo9vo3p0001qfyxmjv4o5xu"
        onSubmit={onSubmit}
      />
    </form>
  );
}

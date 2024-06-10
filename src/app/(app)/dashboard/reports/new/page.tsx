"use client";
import NewReportForm from "../_components/NewReportForm";
import { reportSchema, type IReportSchema } from "../_components/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "~/utils/hooks/useToast";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function Page() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IReportSchema>({
    resolver: zodResolver(reportSchema),
  });

  const { toast } = useToast();
  const utils = api.useUtils();
  const router = useRouter();
  return (
    <NewReportForm
      register={register}
      control={control}
      errors={errors}
      isLoading={false}
    />
  );
}

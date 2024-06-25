"use client";
import EditReportForm from "../_components/EditReportForm";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type IReportSchema, reportSchema } from "../_components/schema";
import { api } from "~/trpc/react";
import { useRouter, useSearchParams } from "next/navigation";
import { inferProcedureInput } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import { useToast } from "~/utils/hooks/useToast";

export default function Page() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get("reportId");
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IReportSchema>({
    resolver: zodResolver(reportSchema),
  });
  const utils = api.useUtils();
  const router = useRouter();
  const { toast } = useToast();
  console.log(errors);

  const { isLoading, mutateAsync } = api.reports.edit.useMutation({
    onSuccess: () => {
       toast({
         description: "Report edited succesfully",
         // title: "Succesfully edited the report"
       });
    },
    onSettled: (report) => {
      toast({
        description: "Report edited succesfully",
        // title: "Succesfully edited the report"
      })
      utils.reports.fetchByOrganization.invalidate();
      reset();
      router.push(`/dashboard/reports/view/?reportId=${report?.id}`);
    },
    // onMutate: (report) => {
    //   utils.reports.fetchByOrganization.invalidate();
    //   const prevData = utils.reports.fetchByOrganization.getData();
    // },
    onError: (err) => {
      console.log(err);
      toast({
        title: "Failed to edit the report",
        description: "Check the all the required fields and try again",
        variant: "destructive"
      });
    },
  });

  const onSubmit: SubmitHandler<IReportSchema> = (data) => {
    try {
      // const existingEvents = data?.trackingEvents.filter((event) => !event.id);
      // const newEvents = data?.trackingEvents.filter((event) => event.id);
      // console.log(newEvents)
      type Input = inferProcedureInput<AppRouter["reports"]["edit"]>;
      const input: Input = {
        ...data,
        id: reportId!,
      };
      mutateAsync(input);
    } catch (cause) {
      console.log(cause);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <EditReportForm
        register={register}
        control={control}
        setValue={setValue}
        errors={errors}
        reportId={reportId!}
        onSubmit={onSubmit}
        isMutating={isLoading}
      />
    </form>
  );
}

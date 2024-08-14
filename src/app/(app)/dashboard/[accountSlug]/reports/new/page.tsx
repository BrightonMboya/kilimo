"use client";
import NewReportForm from "../_components/NewReportForm";
import { reportSchema, type IReportSchema } from "../_components/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useToast } from "~/utils/hooks/useToast";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Toaster } from "~/components/ui/Toaster";
import { useParams } from "next/navigation";

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
  const params = useParams();
  const { mutateAsync, isPending, isError } = api.reports.add.useMutation({
    onSuccess: () => {
      toast({
        title: "Report added",
        description: "Your report has been added",
        duration: 9000,
      });
      reset();
    },
    onError: (err) => {
      console.log(err);
      toast({
        title: "Error",
        description: "Something went wrong",
        duration: 9000,
      });
    },
    onSettled: () => {
      utils.reports.fetchByOrganization.invalidate();
      router.push(`/dashboard/${params.accountSlug}/reports`);
    },
  });

  const onSubmit: SubmitHandler<IReportSchema> = async (
    data: IReportSchema,
  ) => {
    console.log("I am submitting the report");
    try {
      mutateAsync({
        ...data,
        workspaceSlug: params.accountSlug as unknown as string,
      });
    } catch (cause) {
      console.log(cause);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Toaster />
      <NewReportForm
        register={register}
        control={control}
        errors={errors}
        isLoading={isPending}
      />
    </form>
  );
}

import { z } from "zod";

export const reportSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  harvestId: z.string().min(1),
  createdAt: z.date(),
});

export type IReportSchema = z.infer<typeof reportSchema>;

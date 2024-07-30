import z from "zod";
export const harvestsSchema = z.object({
  date: z.date(),
  farmerId: z.string().min(1),
  name: z.string().min(1),
  crop: z.string().min(1),
  size: z.number(),
  unit: z.string().min(1),
  inputsUsed: z.string().min(1),
  farmerName: z.string().optional(),
});

export type HarvestSchemaType = z.infer<typeof harvestsSchema>;

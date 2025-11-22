import { z } from "zod";
export const equipmentSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  leased: z.boolean(),
  dateAcquired: z.date(),
  purchasePrice: z.string().min(1),
  estimatedValue: z.string().min(1),
  brand: z.string().min(1),
  status: z.string().min(1),
});

export type EquipmentSchemaType = z.infer<typeof equipmentSchema>;

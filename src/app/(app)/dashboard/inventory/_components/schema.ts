import z from "zod"

export const inventorySchema = z.object({
  name: z.string().min(1),
  inventoryType: z.string().min(1),
  inventoryUnit: z.string().min(1),
  description: z.string(),
  estimatedValuePerUnit: z.string().min(1),
  warehouseId: z.string().min(1),
});

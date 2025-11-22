import z from 'zod'

export const warehouseSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  maxCapacity: z.number(),
  unit: z.string().min(1),
});

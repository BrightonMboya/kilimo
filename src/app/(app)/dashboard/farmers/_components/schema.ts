import { z } from "zod";
export const farmersSchema = z.object({
  fullName: z.string().min(1),
  phoneNumber: z.string().optional(),
  gender: z.string(),
  country: z.string().min(1),
  farmSize: z.number(),
  quantityCanSupply: z.number(),
  province: z.string().min(1),
  description: z.string().min(1),
});

export type ValidationSchema = z.infer<typeof farmersSchema>;

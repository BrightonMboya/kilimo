import { z } from "zod";
export const farmersSchema = z.object({
  fullName: z.string().min(1, "Farmer's full name is required"),
  // gender: z.string(),
  phoneNumber: z.string().optional(),
  farmSize: z.number().min(
    1,
    "What is the estimated farm size of this farmer in acres",
  ),
  province: z.string().min(1, "What is the province or region of this farmer"),
  country: z.string().min(1, "What is the country of this farmer"),
  crops: z.string().min(1, "What are the crops this farmer is growing"),
  quantityCanSupply: z.number(),
});

export type FarmersValidationSchema = z.infer<typeof farmersSchema>;

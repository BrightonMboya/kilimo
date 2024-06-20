import { z } from "zod";

export const reportSchema = z.object({
  name: z.string().min(1),
  // description: z.string().min(1),
  // harvestId: z.string().min(1),
  dateCreated: z.date(),
  trackingEvents: z.array(
    z.object({
      eventName: z.string().min(1),
      dateCreated: z.date(),
      description: z.string().min(1),
    }),
  ),
});


export const defaultReportEventsObjects = {
  eventName: "",
  description: "",
  harvestId: "",
  dateCreated: new Date(),
  
}

export const trackingEventsSchema = z.object({
  trackingEvents: z.array(
    z.object({
      eventName: z.string().min(1),
      dateCreated: z.date(),
      description: z.string().min(1),
    }),
  ),
})

export type ITrackingEventsSchema = z.infer<typeof trackingEventsSchema>;
export type IReportSchema = z.infer<typeof reportSchema>;

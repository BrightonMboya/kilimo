import { z } from "zod";

export const reportSchema = z.object({
  name: z.string().min(1),
  // description: z.string().min(1),
  harvestId: z.string().min(1),
  dateCreated: z.date(),
  trackingEvents: z.array(
    z.object({
      eventName: z.string().min(1),
      dateCreated: z.date(),
      description: z.string().min(1),
      id: z.string().optional(),
      isItNew: z.boolean().optional(),
    }),
  ),
});

export const defaultReportEventsObjects = {
  eventName: "",
  description: "",
  harvestId: "",
  dateCreated: new Date(),
  isItNew: "",
};

export const trackingEventsSchema = z.object({
  trackingEvents: z.array(
    z.object({
      eventName: z.string().min(1),
      dateCreated: z.date(),
      description: z.string().min(1),
    }),
  ),
});

export type ReportsTableData = {
  id: string;
  name: string;
  dateCreated: Date;
  finishedTracking: false;
  Harvests: {
    name: string;
  };
  harvestId: string;
  organization_id: string;
};

export type ITrackingEventsSchema = z.infer<typeof trackingEventsSchema>;
export type IReportSchema = z.infer<typeof reportSchema>;

import { Resend } from "resend";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export default createTRPCRouter({
  send: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        message: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        throw new Error("Missing RESEND_API_KEY");
      }

      const resend = new Resend(apiKey);

      await resend.emails.send({
        from: "enquiries@jani-ai.com",
        to: "enquiries@jani-ai.com",
        subject: `Contact form: ${input.name}`,
        html: `<p><strong>Name:</strong> ${input.name}</p><p><strong>Email:</strong> ${input.email}</p><p>${input.message}</p>`,
        replyTo: input.email,
      });

      return { ok: true };
    }),
});

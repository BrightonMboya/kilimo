import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

// System prompt for the farming assistant
const SYSTEM_PROMPT = `You are Jani, a helpful AI farming assistant for smallholder farmers in Morocco.

Your expertise includes:
- Crop management (coffee, tea, maize, beans, vegetables)
- Pest and disease identification and treatment
- Weather-based farming advice
- Soil health and fertilization
- Irrigation and water management
- Harvest timing and post-harvest handling
- Sustainable farming practices
- EUDR compliance and certification

Guidelines:
- Keep responses concise and practical (farmers are busy)
- Use simple language, avoid technical jargon
- When identifying pests/diseases, ask clarifying questions if needed
- Provide actionable advice with specific product names when relevant
- Consider local conditions (tropical climate, rainy/dry seasons)
- Be encouraging and supportive
- If you're unsure, say so and recommend consulting local agricultural extension officers

IMPORTANT: Always respond in English by default. Only respond in other language if the user writes to you in the other language first.`;

// Groq API configuration
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant"; // Fast, capable, free tier friendly

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error?: {
    message: string;
  };
}

async function callGroq(messages: GroqMessage[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "GROQ_API_KEY is not configured",
    });
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Groq API error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get AI response",
    });
  }

  const data = (await response.json()) as GroqResponse;

  if (data.error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: data.error.message,
    });
  }

  return data.choices[0]?.message?.content ?? "Sorry, I could not generate a response.";
}

const chat = createTRPCRouter({
  // Get all conversations for the current user
  getConversations: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.chatConversation.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { updatedAt: "desc" },
        take: input.limit,
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1, // Get last message for preview
          },
        },
      });
    }),

  // Get a single conversation with all messages
  getConversation: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.db.chatConversation.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found",
        });
      }

      return conversation;
    }),

  // Create a new conversation
  createConversation: protectedProcedure
    .mutation(async ({ ctx }) => {
      return ctx.db.chatConversation.create({
        data: {
          userId: ctx.session.user.id,
        },
      });
    }),

  // Send a message and get AI response
  sendMessage: protectedProcedure
    .input(z.object({
      conversationId: z.string().optional(), // If not provided, creates new conversation
      message: z.string().min(1).max(2000),
    }))
    .mutation(async ({ ctx, input }) => {
      let conversationId = input.conversationId;

      // Create new conversation if needed
      if (!conversationId) {
        const conversation = await ctx.db.chatConversation.create({
          data: {
            userId: ctx.session.user.id,
            title: input.message.slice(0, 50) + (input.message.length > 50 ? "..." : ""),
          },
        });
        conversationId = conversation.id;
      } else {
        // Verify ownership
        const conversation = await ctx.db.chatConversation.findFirst({
          where: { id: conversationId, userId: ctx.session.user.id },
        });
        if (!conversation) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Conversation not found",
          });
        }

        // Update title if it's the first message
        if (!conversation.title) {
          await ctx.db.chatConversation.update({
            where: { id: conversationId },
            data: { title: input.message.slice(0, 50) + (input.message.length > 50 ? "..." : "") },
          });
        }
      }

      // Save user message
      const userMessage = await ctx.db.chatMessage.create({
        data: {
          conversationId,
          role: "user",
          content: input.message,
        },
      });

      // Get conversation history for context (last 10 messages)
      const history = await ctx.db.chatMessage.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
        take: 10,
      });

      // Build messages for Groq
      const groqMessages: GroqMessage[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      ];

      // Get AI response
      const aiResponse = await callGroq(groqMessages);

      // Save AI response
      const assistantMessage = await ctx.db.chatMessage.create({
        data: {
          conversationId,
          role: "assistant",
          content: aiResponse,
        },
      });

      // Update conversation timestamp
      await ctx.db.chatConversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      return {
        conversationId,
        userMessage,
        assistantMessage,
      };
    }),

  // Delete a conversation
  deleteConversation: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const conversation = await ctx.db.chatConversation.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found",
        });
      }

      return ctx.db.chatConversation.delete({
        where: { id: input.id },
      });
    }),

  // Clear all conversations for user
  clearHistory: protectedProcedure
    .mutation(async ({ ctx }) => {
      return ctx.db.chatConversation.deleteMany({
        where: { userId: ctx.session.user.id },
      });
    }),
});

export default chat;

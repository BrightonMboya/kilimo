import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { db } from '@kilimo/db';
import { verifyToken } from '@clerk/backend';

// System prompt for the farming assistant
const SYSTEM_PROMPT = `You are Jani, a helpful AI farming assistant for smallholder farmers in East Africa.

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

IMPORTANT: Always respond in English by default. Only respond in Swahili if the user writes to you in Swahili first.`;

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Get auth token from header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Verify the token with Clerk
    let userId: string;
    try {
      const token = await verifyToken(authHeader, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      userId = token.sub;
    } catch {
      return new Response('Invalid token', { status: 401 });
    }

    const { message, conversationId } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response('Message is required', { status: 400 });
    }

    // Get or create conversation
    let convId = conversationId;
    if (!convId) {
      const conversation = await db.chatConversation.create({
        data: {
          userId,
          title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
        },
      });
      convId = conversation.id;
    } else {
      // Verify ownership
      const conversation = await db.chatConversation.findFirst({
        where: { id: convId, userId },
      });
      if (!conversation) {
        return new Response('Conversation not found', { status: 404 });
      }
    }

    // Save user message
    await db.chatMessage.create({
      data: {
        conversationId: convId,
        role: 'user',
        content: message,
      },
    });

    // Get conversation history for context (last 10 messages)
    const history = await db.chatMessage.findMany({
      where: { conversationId: convId },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });

    // Build messages for the model
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...history.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    // Stream the response
    const result = streamText({
      model: groq('llama-3.1-8b-instant'),
      messages,
      maxTokens: 1024,
      temperature: 0.7,
      async onFinish({ text }) {
        // Save the complete assistant response to DB
        await db.chatMessage.create({
          data: {
            conversationId: convId,
            role: 'assistant',
            content: text,
          },
        });

        // Update conversation timestamp
        await db.chatConversation.update({
          where: { id: convId },
          data: { updatedAt: new Date() },
        });
      },
    });

    // Return streaming response with conversation ID in header
    const response = result.toDataStreamResponse();
    response.headers.set('X-Conversation-Id', convId);
    return response;
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

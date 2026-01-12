import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { db } from '@kilimo/db';

// System prompt for the farming assistant
const SYSTEM_PROMPT = `You are Jani, a helpful AI farming assistant for smallholder farmers in East Africa.

Your expertise is STRICTLY LIMITED to:
- Crop management (coffee, tea, maize, beans, vegetables, fruits)
- Pest and disease identification and treatment
- Weather-based farming advice
- Soil health and fertilization
- Irrigation and water management
- Harvest timing and post-harvest handling
- Sustainable farming practices
- Livestock and poultry basics
- Farm equipment and tools
- Agricultural market information
- EUDR compliance and certification

STRICT RULES:
1. ONLY answer questions related to farming, agriculture, and rural livelihoods
2. If someone asks about non-farming topics (politics, entertainment, coding, general knowledge, etc.), politely decline and redirect them to farming topics
3. Example response for off-topic questions: "I'm Jani, your farming assistant. I can only help with agricultural questions. Is there anything about your crops, livestock, or farm I can help with?"

Response Guidelines:
- Keep responses concise and practical (farmers are busy)
- Use simple language, avoid technical jargon
- When identifying pests/diseases, ask clarifying questions if needed
- Provide actionable advice with specific product names when relevant
- Consider local conditions (tropical climate, rainy/dry seasons)
- Be encouraging and supportive
- If you're unsure, recommend consulting local agricultural extension officers
- Do NOT use markdown formatting (no **, ##, etc.) - use plain text only

IMPORTANT: Always respond in English by default. Only respond in Swahili if the user writes to you in Swahili first.`;

// Initialize Groq provider
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Expose-Headers': 'X-Conversation-Id',
    },
  });
}

export async function POST(req: Request) {
  try {
    // Get auth token from header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized - no token', { status: 401 });
    }

    // Decode JWT to get user ID
    let userId: string;
    try {
      const tokenParts = authHeader.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }
      const payload = JSON.parse(
        Buffer.from(tokenParts[1], 'base64').toString('utf-8')
      );
      userId = payload.sub;
      if (!userId) {
        throw new Error('No user ID in token');
      }
    } catch (tokenError) {
      console.error('Chat API: Token error:', tokenError);
      return new Response('Invalid token', { status: 401 });
    }

    const body = await req.json();
    const { message, conversationId } = body;

    if (!message || typeof message !== 'string') {
      return new Response('Message is required', { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('Chat API: GROQ_API_KEY is not set');
      return new Response('AI service not configured', { status: 500 });
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

    // Get conversation history
    const history = await db.chatMessage.findMany({
      where: { conversationId: convId },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });

    // Build messages array
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
        // Save assistant response to DB
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

    // Get the text stream response and add custom headers
    const response = result.toTextStreamResponse();

    // Create new response with custom headers including CORS
    const headers = new Headers(response.headers);
    headers.set('X-Conversation-Id', convId);
    headers.set('Access-Control-Expose-Headers', 'X-Conversation-Id');
    headers.set('Access-Control-Allow-Origin', '*');

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

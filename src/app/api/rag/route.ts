import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, UIMessage } from 'ai';
import { findRelevantChunks } from '@/lib/ai/rag'; // Importamos nuestra nueva función
import { z } from 'zod';

export const maxDuration = 30;
const PostBodySchema = z.object({
  messages: z.array(z.any()), // Por ahora, aceptamos cualquier objeto de mensaje
});


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = PostBodySchema.safeParse(body);

    if (!validation.success) {
      return new Response(JSON.stringify(validation.error.flatten()), { status: 400 });
    }

    
    const { messages }: { messages: UIMessage[] } = validation.data;
    const lastUserMessage = messages[messages.length - 1];
    const lastUserMessageText = lastUserMessage.parts.map(part => part.type === 'text' ? part.text : '').join('');


    // 1. Realizar la búsqueda de similitud para obtener contexto
    const relevantChunks = await findRelevantChunks(lastUserMessageText);


    // 2. Construir el contexto para el prompt
    const context = relevantChunks.map(chunk => chunk.content).join('\n---\n');


    // 3. Crear el prompt aumentado
    const systemPrompt = `
      Eres un asistente experto en el Vercel AI SDK. Responde a la pregunta del usuario
      basándote únicamente en el siguiente contexto. Si la respuesta no se encuentra en el
      contexto, responde "No tengo suficiente información en mi base de conocimientos para responder a esa pregunta".

      Contexto:
      ---
      ${context}
      ---
    `;

    // 4. Llamar al LLM con el prompt aumentado
    const result = await streamText({
      model: google('gemini-2.5-pro'),
      system: systemPrompt,
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error("Error en la API de chat con RAG:", error);
    return new Response("Un error inesperado ha ocurrido.", { status: 500 });
  }
}
import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are the PortaGen Portfolio Assistant - a friendly, helpful AI that ONLY assists with portfolio-related tasks.

## What You CAN Help With:
1. **Writing & Improving Portfolio Content**
   - Bios and "About Me" sections
   - Project descriptions and case studies
   - Professional taglines and headers
   - Skills and achievements to highlight

2. **Portfolio Best Practices**
   - Tips for making portfolios stand out
   - What recruiters and clients look for
   - How to showcase work effectively

3. **PortaGen Editor Help**
   - How to use features (adding windows, changing wallpapers, icons, etc.)
   - Customization tips for the desktop theme

## IMPORTANT RULES:
- Keep responses concise and actionable (2-4 paragraphs max)
- Match the user's tone (professional, casual, creative)
- Use bullet points and formatting for clarity
- If asked about ANYTHING unrelated to portfolios or PortaGen, politely redirect with: "I'm specialized in helping with your portfolio! Is there anything about your bio, projects, or PortaGen setup I can help with?"

## You CANNOT:
- Generate code or programming solutions
- Answer general knowledge questions
- Do math or calculations
- Provide advice on topics outside portfolios

Be encouraging and helpful. You're here to help users create amazing portfolios!`;

export async function POST(req: Request) {
    try {
        const { messages }: { messages: UIMessage[] } = await req.json();

        // Validate request
        if (!messages || !Array.isArray(messages)) {
            return new Response('Invalid request: messages array required', { status: 400 });
        }

        const result = streamText({
            model: google('gemini-2.5-flash'),
            system: SYSTEM_PROMPT,
            messages: await convertToModelMessages(messages),
            maxOutputTokens: 1024,
            temperature: 0.7,
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error('AI Chat Error:', error);
        return new Response('An error occurred while processing your request', { status: 500 });
    }
}

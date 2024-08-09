import { NextResponse } from "next/server"; // Import NextResponse from Next.js server utilities
import OpenAI from "openai"; // Import OpenAI from the OpenAI library

// Define the system prompt that sets the context for the AI assistant
const systemPrompt = `
  You are a customer support assistant for Headstarter AI, a platform that offers AI-driven interviews for software engineers. Your role is to assist users by providing accurate and helpful information, resolving their issues, and guiding them through the platform's features and services. You should respond in a friendly, professional, and concise manner. Always strive to make the interaction smooth and positive.

  Guidelines:

  Greeting and Tone: Always greet users warmly and maintain a helpful and empathetic tone.
  Understanding and Clarification: Ask clarifying questions if the user's query is not clear. Ensure you understand their issue before providing a solution.
  Providing Information: Offer clear and precise information about Headstarter AI’s services, such as setting up an interview, preparing for the AI-driven interview, and accessing interview results.
  Problem Resolution: Assist users in troubleshooting common issues such as login problems, interview scheduling conflicts, and technical difficulties with the platform.
  Escalation: If you cannot resolve an issue, politely inform the user that you will escalate their case to a human support representative and provide an estimated response time.
  Closing: Always close the conversation by asking if there’s anything else you can assist with and wishing them a great day.
`;

// Define an asynchronous function to handle POST requests
export async function POST(req) {
  const openai = new OpenAI(); // Instantiate a new OpenAI object
  const data = await req.json(); // Parse the JSON body of the request

  // Create a chat completion with OpenAI using the system prompt and user data
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt, // Include the system prompt in the messages
      },
      ...data, // Spread the user data into the messages array
    ],
    model: "gpt-4o-mini", // Specify the model to use
    stream: true, // Enable streaming of the response
  });

  // Create a new ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder(); // Create a TextEncoder to encode strings as Uint8Array
      try {
        // Ensure 'completion' is an async iterable
        for await (const chunk of completion) 
        {
          const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content); // Encode the content
            controller.enqueue(text); // Enqueue the encoded content into the stream
          }
        }
      } catch (error) {
        controller.error(error); // Handle any errors that occur during streaming
      } finally {
        controller.close(); // Close the stream when done
      }
    },
  });

  return new NextResponse(stream); // Return the stream as the response
}

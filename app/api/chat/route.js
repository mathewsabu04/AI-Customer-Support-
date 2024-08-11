import { NextResponse } from "next/server";
import OpenAI from "openai";
import { PineconeClient } from "@pinecone-database/client"; // Make sure to install and use the correct module

// Initialize Pinecone Client
const pinecone = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY, // Use your Pinecone API key
  environment: process.env.PINECONE_ENVIRONMENT, // Use your Pinecone environment
});

const indexName = "your-index-name"; // Replace with your Pinecone index name

// Define the system prompt
const systemPrompt = `
  You are a customer support assistant for Headstarter AI...
  // (Rest of the system prompt remains unchanged)
`;

// Function to fetch relevant context from Pinecone
async function fetchContext(query) {
  const response = await pinecone.query(indexName, query, { topK: 5 });
  return response.matches.map((match) => match.metadata.text).join("\n");
}

// Define an asynchronous function to handle POST requests
export async function POST(req) {
  const openai = new OpenAI(); // Instantiate a new OpenAI object
  const data = await req.json(); // Parse the JSON body of the request

  // Fetch relevant context from Pinecone based on the user's message
  const context = await fetchContext(data[data.length - 1].content);

  // Create a chat completion with OpenAI using the system prompt, context, and user data
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "system", content: `Relevant context: ${context}` },
      ...data,
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
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content); // Encode the content
            controller.enqueue(text); // Enqueue the encoded content into the stream
          }
        }
      } catch (error) {
        controller.error(error); // Handle any errors that occur during streaming
      } finally 
      {
        controller.close(); // Close the stream when done
      }
    },
  });

  return new NextResponse(stream); // Return the stream as the response
}

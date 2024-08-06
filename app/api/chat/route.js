import { NextResponse } from "next/server";

export async function POST(req) {
  const openai = new OpenAI();
  const data = await req.json();

  console.log(data);
  return NextResponse.json({ message: "Hello from the server" });
}

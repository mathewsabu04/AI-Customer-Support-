import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  const openai = new OpenAI();
  const data = await req.json();
  console.log(data);
  return NextResponse.json({ message: "Hello from the server" });
}

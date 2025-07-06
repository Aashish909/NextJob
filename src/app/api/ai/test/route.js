import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try to list available models
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("Hello, this is a test message.");
      const response = await result.response;
      
      return NextResponse.json({
        success: true,
        message: "API key is working",
        testResponse: response.text()
      });
    } catch (error) {
      return NextResponse.json({
        error: "Model access error",
        details: error.message
      }, { status: 500 });
    }
    
  } catch (error) {
    return NextResponse.json({
      error: "API test failed",
      details: error.message
    }, { status: 500 });
  }
} 
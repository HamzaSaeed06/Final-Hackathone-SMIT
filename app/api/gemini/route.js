import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { action, text, skills, requestObj } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured. Add NEXT_PUBLIC_GEMINI_API_KEY to .env.local" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    if (action === 'analyze_request') {
      const prompt = `
      Analyze the following help request description for a community platform.
      Return ONLY a valid JSON object matching this exact structure, with no markdown formatting or backticks:
      {
        "category": "One of: Web Development, Design, Math, Language, Career, Data Science, Other",
        "urgency": "One of: High, Medium, Low",
        "tags": ["tag1", "tag2", "tag3", "tag4"],
        "rewrite": "A single sentence suggesting what specific details to add to improve this description."
      }
      
      Description: "${text}"
      `;
      
      const result = await model.generateContent(prompt);
      let textRes = result.response.text();
      textRes = textRes.replace(/```json/g, '').replace(/```/g, '').trim();
      
      return NextResponse.json(JSON.parse(textRes));
    }
    
    if (action === 'generate_summary') {
      const prompt = `
      Write a concise 2-sentence summary for the following help request. Do not use markdown.
      Title: ${requestObj.title}
      Description: ${requestObj.description}
      Category: ${requestObj.category}
      Urgency: ${requestObj.urgency}
      `;
      const result = await model.generateContent(prompt);
      return NextResponse.json({ summary: result.response.text().trim() });
    }

    if (action === 'suggest_skills') {
      const prompt = `
      The user currently has these skills: ${skills.join(', ')}. 
      Return ONLY a valid stringified JSON array of strings containing 4 highly related but distinct skills they should also consider adding. No markdown formatting.
      Example: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js"]
      `;
      const result = await model.generateContent(prompt);
      let textRes = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      return NextResponse.json({ skills: JSON.parse(textRes) });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to generate AI response", details: error.message }, { status: 500 });
  }
}

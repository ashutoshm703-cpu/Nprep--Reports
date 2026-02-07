
import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentData } from "../types";

export const generateNextPlan = async (data: AssessmentData): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const weakSubject = data.subjects.find(s => s.status === 'weak') || data.subjects[0];
  
  const prompt = `
    Student Report for Tier-2/3 background student:
    - Name: ${data.studentName}
    - Weak Subject: ${weakSubject.name}
    - Weak Topics: ${weakSubject.weakTopics.join(", ")}
    
    Create a highly specific 3-step improvement plan.
    1. Step 1: "Conceptual Revision". Suggest how to revise the weak topics (e.g. read NCERT, watch video) over 2 days.
    2. Step 2: "Practice". Suggest a specific number of easy questions (e.g. 20 questions) to build confidence.
    3. Step 3: "Exam Strategy". A tip on how to handle these questions in exam (e.g. skip if tough).

    Return ONLY the 3 strings in an array. Keep language simple and encouraging.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plan: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text);
    return result.plan || [
      `Spend 2 days revising ${weakSubject.weakTopics[0]} concepts thoroughly.`,
      "Solve 20 basic level questions to gain confidence.",
      "If a question looks hard, skip it and come back later."
    ];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      `Read the chapter on ${weakSubject.name} again carefully.`,
      "Practice 15 simple questions without a timer.",
      "Focus on accuracy first, speed will come later."
    ];
  }
};

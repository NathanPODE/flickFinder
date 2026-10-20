import * as dotenv from 'dotenv'
import { GoogleGenAI, Type } from '@google/genai'

dotenv.config()

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function getMovieSuggestions(prompt) {
    const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Suggest exactly 3 movies based on this request: ${prompt}`,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        reason: { type: Type.STRING }
                    },
                    propertyOrdering: ['title', 'reason']
                }
            }
        }
    })
    return JSON.parse(response.text)
}
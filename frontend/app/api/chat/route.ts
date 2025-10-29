// /app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json()

        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "Message is required" }, { status: 400 })
        }

        console.log("Received message:", message)

        // --- STEP 1: Get RAG context from backend ---
        let context = "";
        let sources: string[] = [];

        try {
            const ragContextRes = await fetch("http://localhost:8000/rag", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ query: message }),
            })

            if (!ragContextRes.ok) {
                throw new Error(`RAG backend responded with status: ${ragContextRes.status}`)
            }

            const ragData = await ragContextRes.json()
            context = ragData.context || ""
            sources = ragData.sources || []

            console.log("RAG context received, sources:", sources.length)
        } catch (ragError) {
            console.error("RAG backend error:", ragError)
            // Continue without context if RAG fails
            context = "No legal context available. Please provide general legal guidance based on your knowledge."
        }

        // --- STEP 2: Create prompt for LLM ---
        const apiKey = process.env.OPENROUTER_API_KEY || "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"

        const body = {
            model: "deepcogito/cogito-v2-preview-llama-405b",
            messages: [
                {
                    role: "system",
                    content: `You are a knowledgeable and helpful Indian legal assistant. ${context ?
                        "Use the following context from Indian case law to answer the user. Reference the information, but do not make anything up.\n\n" + context :
                        "Provide general legal guidance based on your knowledge of Indian law."
                        }`
                },
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 1000,
            temperature: 0.3
        }

        console.log("Calling OpenRouter API...")

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter
                "X-Title": "Legal Assistant" // Required by OpenRouter
            },
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error("OpenRouter API error:", errorText)
            return NextResponse.json({
                error: `OpenRouter API error: ${res.status} ${res.statusText}`,
                details: errorText
            }, { status: res.status })
        }

        const data = await res.json()
        const aiReply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response."

        console.log("AI response generated successfully")

        return NextResponse.json({
            message: aiReply,
            sources: sources,
            timestamp: new Date().toISOString(),
        })

    } catch (error) {
        console.error("General error in chat route:", error)
        return NextResponse.json({
            error: "Failed to process message",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 })
    }
}
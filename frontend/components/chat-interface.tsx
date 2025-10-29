"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Menu, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatMessage from "@/components/chat-message"
import WelcomeScreen from "@/components/welcome-screen"


interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  sources?: Array<{ title: string; type: string }>
}

interface ChatInterfaceProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
  conversationId: string
  messages: Message[]
  onUpdateMessages: (messages: Message[]) => void
  onUpdateTitle: (conversationId: string, title: string) => void
}

const LEGAL_RESPONSES: Record<string, { response: string; sources: Array<{ title: string; type: string }> }> = {
  property: {
    response:
      "Under Indian property law, property rights are governed by the Transfer of Property Act, 1882. Key points include: (1) Property can be transferred by deed or will, (2) The transferor must have the right to transfer, (3) The transferee must be capable of taking the property. For residential property, you may also need to comply with local municipal regulations and obtain necessary approvals from the local authority.",
    sources: [
      { title: "Transfer of Property Act, 1882", type: "Statute" },
      { title: "Indian Contract Act, 1872", type: "Statute" },
    ],
  },
  succession: {
    response:
      "Succession in India is governed by the Indian Succession Act, 1925. Key provisions include: (1) Intestate succession follows the order of heirs as per the Act, (2) Testamentary succession is through a valid will, (3) The succession certificate is required for claiming assets. For Hindu succession, the Hindu Succession Act, 1956 applies. The order of succession typically follows: spouse, children, parents, and then other relatives.",
    sources: [
      { title: "Indian Succession Act, 1925", type: "Statute" },
      { title: "Hindu Succession Act, 1956", type: "Statute" },
    ],
  },
  will: {
    response:
      "A valid will under Indian law must satisfy: (1) The testator must be of sound mind, (2) The will must be in writing, (3) It must be signed by the testator, (4) It must be witnessed by at least two competent witnesses. The will should clearly state the testator's intentions regarding property distribution. You can revoke or modify a will at any time before death through a codicil or a new will.",
    sources: [
      { title: "Indian Succession Act, 1925 - Sections 58-63", type: "Statute" },
      { title: "Wills and Testamentary Succession", type: "Legal Concept" },
    ],
  },
  poa: {
    response:
      "A Power of Attorney (POA) is a legal document that authorizes someone to act on your behalf. Types include: (1) General POA - for all matters, (2) Special POA - for specific matters, (3) Durable POA - continues even if you become incapacitated. The POA must be executed by a competent person, signed, and typically notarized. It can be revoked at any time by the principal.",
    sources: [
      { title: "Indian Contract Act, 1872 - Sections 182-238", type: "Statute" },
      { title: "Power of Attorney Guidelines", type: "Legal Concept" },
    ],
  },
  inheritance: {
    response:
      "Inheritance rights in India depend on the religion and personal law of the deceased. For Hindus, the Hindu Succession Act, 1956 applies. For Muslims, the Muslim Personal Law applies. For Christians, the Indian Succession Act applies. The order of succession typically includes: spouse, children, parents, and siblings. Adopted children have equal rights as biological children under Hindu law.",
    sources: [
      { title: "Hindu Succession Act, 1956", type: "Statute" },
      { title: "Muslim Personal Law", type: "Statute" },
      { title: "Indian Succession Act, 1925", type: "Statute" },
    ],
  },
}

function findRelevantResponse(query: string): { response: string; sources: Array<{ title: string; type: string }> } {
  const lowerQuery = query.toLowerCase()

  // Check for keywords in the query
  for (const [key, value] of Object.entries(LEGAL_RESPONSES)) {
    if (lowerQuery.includes(key)) {
      return value
    }
  }

  // Default response if no specific match
  return {
    response:
      "I can help you with questions about Indian property law, succession, wills, power of attorney, and inheritance. Please ask a specific question related to these topics, and I'll provide relevant legal information. Remember, this is general legal information and not a substitute for professional legal advice.",
    sources: [{ title: "General Legal Information", type: "Reference" }],
  }
}

export default function ChatInterface({
  sidebarOpen,
  onToggleSidebar,
  conversationId,
  messages,
  onUpdateMessages,
  onUpdateTitle,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleExportChat = () => {
    const exportData = {
      conversationId,
      timestamp: new Date().toISOString(),
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
      })),
    }
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `legal-chat-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear this conversation?")) {
      onUpdateMessages([])
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    const newMessages = [...messages, userMessage]
    onUpdateMessages(newMessages)
    setInput("")
    setIsLoading(true)

    if (messages.length === 0) {
      const title = input.substring(0, 50) + (input.length > 50 ? "..." : "")
      onUpdateTitle(conversationId, title)
    }

    // --- Send to backend API ---
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })
      const data = await res.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
        // sources: [] if you get references from API, add here
      }
      onUpdateMessages([...newMessages, assistantMessage])
    } catch (err) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, there was an error with the AI service.",
        timestamp: new Date(),
      }
      onUpdateMessages([...newMessages, assistantMessage])
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="text-foreground hover:bg-muted">
            <Menu size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Legal AI Advisor</h1>
            <p className="text-xs text-muted-foreground">Indian Law Expert</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExportChat}
                title="Export conversation"
                className="text-foreground hover:bg-muted"
              >
                <Download size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearChat}
                title="Clear conversation"
                className="text-foreground hover:bg-muted"
              >
                <Trash2 size={18} />
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card rounded-lg px-4 py-3 max-w-md">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background p-6">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Indian law, property, succession..."
              className="flex-1 bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-4 py-3"
            >
              <Send size={20} />
            </Button>
          </div>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-3">
          This AI provides general legal information. Always consult a qualified lawyer for specific legal advice.
        </p>
      </div>
    </div>
  )
}

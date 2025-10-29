"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import ReactMarkdown from "react-markdown"

interface ChatMessageProps {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
    sources?: Array<{ title: string; type: string }>
  }
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-2xl rounded-lg px-4 py-3 ${isUser
          ? "bg-primary text-primary-foreground"
          : "bg-card text-card-foreground border border-border"
          }`}
      >
        {/* Display markdown for all messages instantly */}
        <ReactMarkdown>
          {message.content}
        </ReactMarkdown>

        {/* Sources for assistant responses */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
            <p className="text-xs font-semibold opacity-70">Sources:</p>
            {message.sources.map((source, idx) => (
              <p key={idx} className="text-xs opacity-60">
                • {source.title} ({source.type})
              </p>
            ))}
          </div>
        )}

        {/* Copy button only for assistant messages */}
        {!isUser && (
          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="text-xs opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
              title="Copy response"
            >
              {copied ? (
                <>
                  <Check size={14} /> Copied
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState, useCallback } from "react"
import ChatInterface from "@/components/chat-interface"
import Sidebar from "@/components/sidebar"

interface Conversation {
  id: string
  title: string
  date: string
  messages: Array<{
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
    sources?: Array<{ title: string; type: string }>
  }>
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Property Rights Discussion",
      date: "Today",
      messages: [],
    },
    {
      id: "2",
      title: "Succession Law Query",
      date: "Yesterday",
      messages: [],
    },
    {
      id: "3",
      title: "Constitutional Rights",
      date: "Last week",
      messages: [],
    },
  ])
  const [activeConversation, setActiveConversation] = useState("1")

  const handleNewChat = useCallback(() => {
    const newId = Date.now().toString()
    const newConversation: Conversation = {
      id: newId,
      title: "New Conversation",
      date: "Today",
      messages: [],
    }
    setConversations((prev) => [newConversation, ...prev])
    setActiveConversation(newId)
  }, [])

  const handleUpdateConversationTitle = useCallback((conversationId: string, title: string) => {
    setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, title } : conv)))
  }, [])

  const handleDeleteConversation = useCallback(
    (conversationId: string) => {
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId))
      if (activeConversation === conversationId) {
        setActiveConversation(conversations[0]?.id || "1")
      }
    },
    [activeConversation, conversations],
  )

  const currentConversation = conversations.find((c) => c.id === activeConversation)

  return (
    <div className="flex h-screen bg-background text-foreground dark">
      <Sidebar
        isOpen={sidebarOpen}
        conversations={conversations}
        activeConversation={activeConversation}
        onSelectConversation={setActiveConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
      />
      <ChatInterface
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        conversationId={activeConversation}
        messages={currentConversation?.messages || []}
        onUpdateMessages={(messages) => {
          setConversations((prev) =>
            prev.map((conv) => (conv.id === activeConversation ? { ...conv, messages } : conv)),
          )
        }}
        onUpdateTitle={handleUpdateConversationTitle}
      />
    </div>
  )
}

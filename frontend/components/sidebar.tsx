"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SidebarProps {
  isOpen: boolean
  conversations: Array<{ id: string; title: string; date: string }>
  activeConversation: string
  onSelectConversation: (id: string) => void
  onNewChat: () => void
  onDeleteConversation: (id: string) => void
}

export default function Sidebar({
  isOpen,
  conversations,
  activeConversation,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
}: SidebarProps) {
  const [hoveredConv, setHoveredConv] = useState<string | null>(null)

  if (!isOpen) return null

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <Button
          onClick={onNewChat}
          className="w-full bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-accent-foreground rounded-lg flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onMouseEnter={() => setHoveredConv(conv.id)}
            onMouseLeave={() => setHoveredConv(null)}
            className="group"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectConversation(conv.id)}
                className={`flex-1 text-left px-3 py-2 rounded-lg transition-colors text-sm truncate ${
                  activeConversation === conv.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/20"
                }`}
              >
                {conv.title}
              </button>
              {hoveredConv === conv.id && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteConversation(conv.id)}
                  className="h-8 w-8 text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              )}
            </div>
            <p className="text-xs text-sidebar-foreground/50 px-3 py-1">{conv.date}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/20 transition-colors">
          Settings
        </button>
        <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/20 transition-colors">
          Help & FAQ
        </button>
        <p className="text-xs text-sidebar-foreground/40 px-3 py-2">v2.0 - Enhanced Legal AI</p>
      </div>
    </aside>
  )
}

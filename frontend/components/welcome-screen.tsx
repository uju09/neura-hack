"use client"

import { Zap, Lightbulb, MessageSquare, Sparkles, BookOpen } from "lucide-react"

export default function WelcomeScreen() {
  const features = [
    {
      icon: Zap,
      title: "Property Law",
      description: "What is the process for house registration after parents' demise?",
    },
    {
      icon: Lightbulb,
      title: "Succession",
      description: "How does Muslim succession law work in India?",
    },
    {
      icon: MessageSquare,
      title: "Legal Procedures",
      description: "What documents are needed for property mutation?",
    },
    {
      icon: Sparkles,
      title: "Constitutional Rights",
      description: "What are my rights under the Indian Constitution?",
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 px-4">
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
          <h2 className="text-4xl font-bold text-foreground">Legal AI Advisor</h2>
        </div>
        <p className="text-muted-foreground text-lg">
          Ask me about Indian law, property, succession, and constitutional matters
        </p>
        <p className="text-xs text-muted-foreground/60 pt-2">v2.0 - Enhanced with export & conversation management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <button
              key={index}
              className="bg-card border border-border rounded-lg p-4 text-left hover:border-primary transition-colors group"
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                  <p className="text-muted-foreground text-xs mt-1">{feature.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="bg-card border border-border rounded-lg p-4 max-w-2xl w-full">
        <p className="text-xs font-semibold text-foreground mb-2">Tips for better results:</p>
        <ul className="text-xs text-muted-foreground space-y-1 text-left">
          <li>• Be specific about your legal query</li>
          <li>• Mention relevant laws or acts if applicable</li>
          <li>• Export conversations for future reference</li>
          <li>• Always consult a qualified lawyer for specific cases</li>
        </ul>
      </div>
    </div>
  )
}

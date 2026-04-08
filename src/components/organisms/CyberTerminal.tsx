import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTerminal } from '@contexts/TerminalContext'
import { Button } from '@components/atoms/Button'
import { Send, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

export const CyberTerminal: React.FC = () => {
  const { t } = useTranslation()
  const { messages, isLoading, addMessage, clearMessages } = useTerminal()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = {
      id: Math.random().toString(),
      role: 'user' as const,
      content: input,
      timestamp: new Date(),
    }

    addMessage(userMessage)
    setInput('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full flex flex-col bg-gradient-to-b from-cyber-black via-[#0a0e27] to-cyber-black border border-cyber-blue/20 rounded-lg overflow-hidden shadow-2xl"
    >
      {/* Terminal Header */}
      <div className="bg-cyber-navy/50 backdrop-blur border-b border-cyber-blue/20 px-4 py-3 flex justify-between items-center">
        <div>
          <h2 className="text-cyber-blue font-mono font-bold text-sm">
            AI-Terminal v1.0 &gt;
          </h2>
          <p className="text-gray-500 text-xs font-mono">
            bash@cyberlms:~$ Connected to Claude API
          </p>
        </div>
        <button
          onClick={clearMessages}
          className="text-gray-400 hover:text-cyber-blue transition-colors p-2 hover:bg-cyber-navy rounded"
          title="Clear terminal"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="mb-2">Welcome to Cyber Terminal</p>
              <p className="text-xs">Ask questions about Bash, PowerShell, Python, or cybersecurity</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${message.role === 'user' ? 'text-right' : ''}`}
          >
            <div
              className={`inline-block max-w-xs lg:max-w-md xl:max-w-xl px-4 py-2 rounded ${
                message.role === 'user'
                  ? 'bg-cyber-blue/20 text-cyber-electric border border-cyber-blue/50'
                  : 'bg-cyber-navy/30 text-gray-300 border border-cyber-blue/20'
              }`}
            >
              {message.role === 'user' && <span className="text-cyber-blue">$ </span>}
              {message.role === 'assistant' && <span className="text-green-500">→ </span>}
              <span className="break-words whitespace-pre-wrap">{message.content}</span>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-cyber-electric font-mono text-sm"
          >
            → Processing...
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-cyber-blue/20 bg-cyber-navy/30 backdrop-blur p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('terminal.placeholder')}
            disabled={isLoading}
            className="flex-1 bg-cyber-black/50 border border-cyber-blue/30 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyber-blue/70 transition-colors disabled:opacity-50 placeholder-gray-600"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="sm"
            className="gap-2"
          >
            <Send size={16} />
            <span className="hidden sm:inline">{t('terminal.send')}</span>
          </Button>
        </form>
      </div>
    </motion.div>
  )
}

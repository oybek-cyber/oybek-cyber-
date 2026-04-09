import React, { useState, useRef, useEffect } from 'react'
import { useTerminal } from '@contexts/TerminalContext'
import { Send, Trash2, Bot, User, Copy, Check, Zap, Code2, Bug, Lightbulb, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Markdown-like code block renderer ───────────────────────────────────────
const MessageContent: React.FC<{ content: string; role: 'user' | 'assistant' }> = ({ content, role }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  if (role === 'user') {
    return <span className="break-words whitespace-pre-wrap">{content}</span>
  }

  // Parse code blocks for assistant messages
  const parts = content.split(/(```[\w]*\n[\s\S]*?```)/g)
  let codeBlockIndex = 0

  return (
    <div className="space-y-2 break-words">
      {parts.map((part, i) => {
        const codeMatch = part.match(/```([\w]*)\n([\s\S]*?)```/)
        if (codeMatch) {
          const lang = codeMatch[1] || 'code'
          const code = codeMatch[2].trim()
          const idx = codeBlockIndex++
          return (
            <div key={i} className="relative group">
              <div className="flex items-center justify-between bg-[#0d1117] border border-cyber-blue/20 rounded-t-lg px-3 py-1.5">
                <span className="text-xs text-cyber-blue font-mono font-semibold">{lang}</span>
                <button
                  onClick={() => copyCode(code, idx)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"
                >
                  {copiedIndex === idx ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  {copiedIndex === idx ? 'Nusxalandi!' : 'Nusxa'}
                </button>
              </div>
              <pre className="bg-[#0d1117] border border-t-0 border-cyber-blue/20 rounded-b-lg px-4 py-3 overflow-x-auto">
                <code className="text-green-300 font-mono text-xs leading-relaxed">{code}</code>
              </pre>
            </div>
          )
        }
        // Regular text — render with basic formatting
        return (
          <p key={i} className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
            {part.split(/(`[^`]+`)/g).map((segment, j) => {
              const inlineCode = segment.match(/^`([^`]+)`$/)
              if (inlineCode) {
                return (
                  <code key={j} className="bg-cyber-blue/20 text-cyber-electric px-1.5 py-0.5 rounded text-xs font-mono">
                    {inlineCode[1]}
                  </code>
                )
              }
              return <span key={j}>{segment}</span>
            })}
          </p>
        )
      })}
    </div>
  )
}

// ─── Quick Action Buttons ─────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { icon: <Code2 size={13} />, label: 'Kodni tushuntir', prompt: 'Ushbu kodni tushuntir:\n```\n\n```' },
  { icon: <Bug size={13} />, label: 'Xato top', prompt: 'Ushbu kodda xato bormi, topib ber:\n```\n\n```' },
  { icon: <Lightbulb size={13} />, label: 'Kod yaz', prompt: 'Menga Python da ... yozib ber' },
  { icon: <BookOpen size={13} />, label: 'Tushuntir', prompt: 'Nima bu va qanday ishlaydi: ' },
  { icon: <Zap size={13} />, label: 'Yaxshila', prompt: 'Ushbu kodni optimallashtir:\n```\n\n```' },
]

// ─── Main Terminal Component ──────────────────────────────────────────────────
export const CyberTerminal: React.FC = () => {
  const { messages, isLoading, addMessage, clearMessages } = useTerminal()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
    }
  }, [input])

  const send = () => {
    if (!input.trim() || isLoading) return
    addMessage({ id: Math.random().toString(), role: 'user', content: input.trim(), timestamp: new Date() })
    setInput('')
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const applyQuickAction = (prompt: string) => {
    setInput(prompt)
    textareaRef.current?.focus()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full flex flex-col bg-[#070b18] border border-cyber-blue/25 rounded-xl overflow-hidden shadow-2xl shadow-black/60"
    >
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-cyber-navy/80 to-[#0a0e27]/80 backdrop-blur border-b border-cyber-blue/20 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Bot size={14} className="text-cyber-blue" />
              <span className="text-white font-semibold text-sm">AI Coding Mentor</span>
              <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded-full font-medium">Gemini</span>
            </div>
            <p className="text-gray-500 text-xs mt-0.5">Kod yozishni, tushunishni va o'rganishni tezlashtiradi</p>
          </div>
        </div>
        <button
          onClick={clearMessages}
          className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-red-400/10 rounded-lg"
          title="Tozalash"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* ── Quick Actions ── */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide border-b border-cyber-blue/10 flex-shrink-0 bg-[#070b18]">
        {QUICK_ACTIONS.map((action, i) => (
          <button
            key={i}
            onClick={() => applyQuickAction(action.prompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyber-blue/8 border border-cyber-blue/20 text-gray-400 hover:text-cyber-blue hover:border-cyber-blue/40 hover:bg-cyber-blue/15 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0"
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center gap-4 py-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-cyber-blue/10 border border-cyber-blue/20 flex items-center justify-center">
              <Bot size={28} className="text-cyber-blue" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Salom! Men AI Mentor'man 👋</h3>
              <p className="text-gray-500 text-sm max-w-sm">
                Kod yozishga yordam beraman, tushuntiraman, xatolarni topaman. Savol bering yoki yuqoridagi tugmalardan birini bosing!
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-w-sm w-full">
              {[
                { emoji: '🐍', text: '"Python da for loop qanday ishlaydi?"' },
                { emoji: '🔐', text: '"SSH nima va nima uchun kerak?"' },
                { emoji: '💻', text: '"Bash da fayl yaratish komandasi?"' },
                { emoji: '🐛', text: '"Bu kodda nima xato bor?"' },
              ].map((ex, i) => (
                <button
                  key={i}
                  onClick={() => applyQuickAction(ex.text.replace(/"/g, ''))}
                  className="text-left text-xs text-gray-500 hover:text-gray-300 bg-cyber-black/30 border border-cyber-blue/10 hover:border-cyber-blue/30 rounded-lg px-3 py-2 transition-all"
                >
                  {ex.emoji} {ex.text}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                msg.role === 'user'
                  ? 'bg-cyber-blue/20 border border-cyber-blue/40'
                  : 'bg-purple-500/20 border border-purple-500/40'
              }`}>
                {msg.role === 'user'
                  ? <User size={14} className="text-cyber-blue" />
                  : <Bot size={14} className="text-purple-400" />
                }
              </div>

              {/* Bubble */}
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-cyber-blue/15 border border-cyber-blue/30 rounded-tr-sm'
                  : 'bg-[#0d1523] border border-white/8 rounded-tl-sm'
              }`}>
                <MessageContent content={msg.content} role={msg.role} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-purple-400" />
            </div>
            <div className="bg-[#0d1523] border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    className="w-2 h-2 bg-cyber-blue rounded-full"
                  />
                ))}
                <span className="text-gray-500 text-xs ml-2">Javob tayyorlanmoqda...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div className="border-t border-cyber-blue/15 bg-[#070b18] px-4 py-3 flex-shrink-0">
        <div className="flex gap-2 items-end bg-cyber-black/50 border border-cyber-blue/25 rounded-xl px-3 py-2 focus-within:border-cyber-blue/60 transition-colors">
          <Code2 size={15} className="text-gray-600 flex-shrink-0 mb-1" />
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Savol yozing, kod joylashtiring... (Enter = yuborish, Shift+Enter = yangi qator)"
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-transparent text-white text-sm resize-none focus:outline-none placeholder-gray-600 font-mono leading-relaxed disabled:opacity-50 min-h-[24px]"
            style={{ maxHeight: '160px' }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={send}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-8 h-8 bg-cyber-blue hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors mb-0.5"
          >
            <Send size={14} className="text-white" />
          </motion.button>
        </div>
        <p className="text-gray-700 text-xs mt-1.5 text-center">
          Shift+Enter — yangi qator · Enter — yuborish
        </p>
      </div>
    </motion.div>
  )
}

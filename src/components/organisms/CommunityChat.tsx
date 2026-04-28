import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User, Bot, Trash2, MessageSquare, Loader2, ShieldCheck } from 'lucide-react'

interface Message {
  id: string
  content: string
  userId: string
  user: {
    username: string
    avatar?: string
    role: string
  }
  createdAt: string
}

export const CommunityChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/community/messages', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      const json = await res.json()
      if (json.success) {
        setMessages(json.data.reverse())
      }
    } catch (error) {
      console.error('Failed to fetch messages', error)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000) // Poll every 5s
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/community/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ content: input })
      })
      const json = await res.json()
      if (json.success) {
        setMessages([...messages, json.data])
        setInput('')
      }
    } catch (error) {
      console.error('Failed to send message', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[500px] bg-cyber-navy/40 border border-cyber-blue/20 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
      {/* Header */}
      <div className="bg-cyber-blue/10 border-b border-cyber-blue/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-cyber-blue" />
          <h3 className="text-white font-bold text-sm tracking-wide">JAMOATCHILIK CHATI</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-tighter">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyber-blue/20 scrollbar-track-transparent">
        {fetching ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-cyber-blue" size={24} />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-xs italic">Hali xabarlar yo'q. Birinchi bo'lib yozing!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.userId === user.id ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                {msg.user.role === 'ADMIN' && <ShieldCheck size={10} className="text-red-400" />}
                <span className={`text-[10px] font-bold ${msg.user.role === 'ADMIN' ? 'text-red-400' : 'text-gray-500'}`}>
                  {msg.user.username}
                </span>
                <span className="text-[8px] text-gray-600">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                msg.userId === user.id 
                  ? 'bg-cyber-blue/20 border border-cyber-blue/30 text-white rounded-tr-none' 
                  : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-cyber-blue/10 bg-black/20">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Xabar yozing..."
            className="flex-1 bg-cyber-navy/60 border border-cyber-blue/20 text-white rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyber-blue/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-2 bg-cyber-blue hover:bg-blue-500 text-white rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { TerminalMessage, AITerminalContextType } from '@app-types/index'

// ─── AI Coding Mentor System Prompt ──────────────────────────────────────────
const CODING_MENTOR_PROMPT = `Siz "CyberLMS AI Mentor" — boshlaydiganlar uchun kiberxavfsizlik va dasturlash o'qituvchisisiz.

ASOSIY MAQSAD:
Yangi boshlovchi o'quvchilarga kod yozishni, tushunishni va tezroq o'rganishni yordam berish.

QOBILIYATLARINGIZ:
1. 📖 KOD TUSHUNTIRISH — Har qanday kodni oddiy so'zlar bilan tushuntirish
2. ✍️ KOD YOZISH — Tasvirdan kod yaratish (Bash, Python, PowerShell, JavaScript)
3. 🐛 XATO TOPISH — Kodni tekshirish va xatolarni aniqlash
4. 💡 YAXSHILASH — Kodni optimallashtirish va yaxshilash
5. 📚 O'QITISH — Tushunchalarni bosqichma-bosqich tushuntirish
6. 🔐 XAVFSIZLIK — Kiberxavfsizlik asoslarini o'rgatish

JAVOB FORMATI (MUHIM):
- Har doim O'zbek tilida javob bering (agar boshqa tilda yozsa, o'sha tilda ham javob bering)
- Kod bloklarini \`\`\` bilan o'rang, masalan:
  \`\`\`bash
  echo "Salom dunyo"
  \`\`\`
- Qadamlarga bo'ling: 1️⃣ 2️⃣ 3️⃣
- Murakkab tushunchalarni oddiy misol bilan tushuntiring
- ✅ Yaxshi amaliyotlarni ko'rsating
- ⚠️ Xatolar haqida ogohlantiring

BOSHLAYDIGANLAR UCHUN MAXSUS:
- Texnik atamalarni oddiy so'zlar bilan ham tushuntiring
- "Nima uchun?" savolini ham javoblang
- Har qadam oxirida "Savollaringiz bormi?" deb so'rang

MAVZULAR:
✓ Bash/Linux komandalar
✓ Python dasturlash
✓ PowerShell (Windows)
✓ JavaScript/HTML/CSS
✓ Tarmoq (IP, DNS, HTTP protokollari)
✓ Kiberxavfsizlik asoslari
✓ Git va versiya nazorat
✓ Docker va konteynerlar`

// ─── Gemini API ───────────────────────────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

async function callGemini(history: { role: string; content: string }[]): Promise<string> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-gemini-api-key-here') {
    return [
      '⚠️ **Gemini API key sozlanmagan!**',
      '',
      'Bepul API key olish uchun:',
      '1. https://aistudio.google.com ga kiring',
      '2. **"Get API key"** tugmasini bosing',
      '3. Kalitni nusxa olib, `.env` fayliga qo\'ying:',
      '   `VITE_GEMINI_API_KEY=AIza...`',
      '4. Serverni qayta ishga tushiring (Ctrl+C, so\'ng npm run dev)',
    ].join('\n')
  }

  const contents = history.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }))

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: CODING_MENTOR_PROMPT }] },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
        topP: 0.9,
      }
    })
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error((err as any)?.error?.message || `HTTP ${response.status}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Javob olinmadi'
}

// ─── Context ──────────────────────────────────────────────────────────────────
const TerminalContext = createContext<AITerminalContextType | undefined>(undefined)

export const TerminalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<TerminalMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentCourse, setCurrentCourse] = useState<string>('General')
  const [currentLevel, setCurrentLevel] = useState<string>('beginner')

  useEffect(() => {
    try {
      const user = localStorage.getItem('user')
      if (user) {
        const userData = JSON.parse(user)
        if (userData.enrolledCourses?.length > 0) {
          setCurrentCourse(userData.enrolledCourses[0].title || 'General')
        }
      }
    } catch { /* ignore */ }
  }, [])

  const addMessage = async (message: TerminalMessage) => {
    const updated = [...messages, message]
    setMessages(updated)

    if (message.role === 'user') {
      setIsLoading(true)
      try {
        const contextNote = currentCourse !== 'General'
          ? ` [O'quvchi ${currentCourse} kursini o'qiyapti, daraja: ${currentLevel}]`
          : ''

        const history = updated.map((m, i) => ({
          role: m.role,
          content: i === updated.length - 1 && m.role === 'user'
            ? m.content + contextNote
            : m.content
        }))

        const aiText = await callGemini(history)

        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          role: 'assistant',
          content: aiText,
          timestamp: new Date(),
        }])
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Noma\'lum xato'
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          role: 'assistant',
          content: `❌ **Xato yuz berdi:** ${errMsg}\n\nAPI key to'g'ri kiritilganligini tekshiring.`,
          timestamp: new Date(),
        }])
      }
      setIsLoading(false)
    }
  }

  const clearMessages = () => setMessages([])
  const updateCourseContext = (course: string) => setCurrentCourse(course)
  const updateLevelContext = (level: string) => setCurrentLevel(level)

  return (
    <TerminalContext.Provider value={{
      messages, isLoading, addMessage, clearMessages,
      updateCourseContext, updateLevelContext, currentCourse, currentLevel,
    }}>
      {children}
    </TerminalContext.Provider>
  )
}

export const useTerminal = () => {
  const context = useContext(TerminalContext)
  if (!context) throw new Error('useTerminal must be used within TerminalProvider')
  return context
}

import React from 'react'
import { motion } from 'framer-motion'
import { CyberTerminal } from '@components/organisms/CyberTerminal'
import { Bot, Code2, Bug, Lightbulb, Zap, BookOpen } from 'lucide-react'

const FEATURES = [
  {
    icon: <Code2 size={20} />,
    title: 'Kod tushuntirish',
    desc: 'Istalgan kodni joylashtiring — AI oddiy so\'zlar bilan tushuntiradi',
    color: 'text-cyber-blue',
    bg: 'bg-cyber-blue/10 border-cyber-blue/20',
  },
  {
    icon: <Lightbulb size={20} />,
    title: 'Kod yaratish',
    desc: 'Nima kerakligini yozing — AI siz uchun kod yozib beradi',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/20',
  },
  {
    icon: <Bug size={20} />,
    title: 'Xato topish',
    desc: 'Ishlamayotgan kodni joylashtiring — AI xatoni topib tuzatadi',
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/20',
  },
  {
    icon: <BookOpen size={20} />,
    title: 'Bosqichma-bosqich o\'rgatish',
    desc: 'Yangi mavzu? AI tuchuncheni oddiy misollar bilan o\'rgatadi',
    color: 'text-green-400',
    bg: 'bg-green-400/10 border-green-400/20',
  },
  {
    icon: <Zap size={20} />,
    title: 'Kodni yaxshilash',
    desc: 'Yozgan kodingizni AI optimallashtiradi va tezlashtiradi',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10 border-purple-400/20',
  },
  {
    icon: <Bot size={20} />,
    title: 'Ko\'p til qo\'llab-quvvatlash',
    desc: 'O\'zbek, Rus va Ingliz tillarida savollar bering',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10 border-cyan-400/20',
  },
]

export const TerminalPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-black via-[#060b1a] to-cyber-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Bot size={13} />
            Gemini AI bilan ishlaydi
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            AI Coding{' '}
            <span className="bg-gradient-to-r from-cyber-blue to-cyan-400 bg-clip-text text-transparent">
              Mentor
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Boshlaydiganlar uchun eng yaxshi hamkor — har qanday savolingizga javob beradi,
            kod yozishga va tushunishga yordam beradi
          </p>
        </motion.div>

        {/* Features Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className={`border rounded-xl p-3 text-center ${f.bg}`}
            >
              <div className={`inline-flex mb-2 ${f.color}`}>{f.icon}</div>
              <p className="text-white text-xs font-semibold mb-1">{f.title}</p>
              <p className="text-gray-500 text-xs leading-relaxed hidden md:block">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="h-[600px] lg:h-[700px]"
        >
          <CyberTerminal />
        </motion.div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-700 text-xs mt-4"
        >
          💡 Maslahat: Kodingizni to'g'ridan-to'g'ri chatga joylashtaring va "bu nima qilyapti?" deb so'rang
        </motion.p>

      </div>
    </div>
  )
}

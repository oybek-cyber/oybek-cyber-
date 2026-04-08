import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  title: string
  description: string
  image: string
  level?: string
  duration?: string
  onClick?: () => void
  children?: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  level,
  duration,
  onClick,
  children,
}) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="bg-cyber-navy/40 backdrop-blur border border-cyber-blue/20 rounded-lg overflow-hidden cursor-pointer group hover:border-cyber-blue/50 transition-all"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
        {level && (
          <div className="absolute top-4 right-4 bg-cyber-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
            {level}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        {duration && <p className="text-cyber-blue text-xs font-semibold">{duration}</p>}
        {children}
      </div>
    </motion.div>
  )
}

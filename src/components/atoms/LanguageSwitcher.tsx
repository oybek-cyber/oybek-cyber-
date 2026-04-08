import React from 'react'
import { useTranslation } from 'react-i18next'
import { Language } from '@types/index'

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()

  const languages: { code: Language; label: string }[] = [
    { code: 'uz', label: 'O\'zbek' },
    { code: 'ru', label: 'Русский' },
    { code: 'en', label: 'English' },
  ]

  return (
    <div className="flex gap-2 bg-cyber-navy/50 backdrop-blur rounded-lg p-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`px-3 py-1 rounded text-sm font-medium transition-all ${
            i18n.language === lang.code
              ? 'bg-cyber-blue text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}

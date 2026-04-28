import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User, Shield, Clock, AlertCircle } from 'lucide-react';
import axiosInstance from '@api/axiosInstance';
import { useAuth } from '@contexts/AuthContext';

interface Discussion {
  id: string;
  userName: string;
  question: string;
  answer: string | null;
  isAdminReplied: boolean;
  createdAt: string;
  user?: {
    avatar?: string;
  };
}

interface LessonDiscussionProps {
  lessonId: string;
}

export const LessonDiscussion: React.FC<LessonDiscussionProps> = ({ lessonId }) => {
  const { user, isAuthenticated } = useAuth();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscussions = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/discussions/lesson/${lessonId}`);
      if (response.data.success) {
        setDiscussions(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch discussions:', err);
      setError('Munozaralarni yuklashda xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (lessonId && isAuthenticated) {
      fetchDiscussions();
    } else if (!isAuthenticated) {
      setDiscussions([]);
      setIsLoading(false);
    }
  }, [lessonId, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    if (!question.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/discussions', {
        lessonId,
        question: question.trim(),
      });

      if (response.data.success) {
        setQuestion('');
        // Add new question to list locally or re-fetch
        setDiscussions([response.data.data, ...discussions]);
      }
    } catch (err) {
      console.error('Failed to post question:', err);
      alert('Savol yuborishda xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-2 border-b border-cyber-blue/20 pb-3">
        <MessageSquare size={20} className="text-cyber-blue" />
        <h3 className="text-xl font-bold text-white">Savol-javoblar</h3>
        <span className="text-xs text-gray-500 ml-auto">
          {discussions.length} ta muhokama
        </span>
      </div>

      {/* Ask Question Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="bg-cyber-navy/40 border border-cyber-blue/20 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-cyber-blue/20 flex items-center justify-center text-cyber-blue font-bold text-xs border border-cyber-blue/30">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="text-sm font-medium text-gray-300">{user?.name}</span>
          </div>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Dars yuzasidan savolingiz bormi? Bu yerga yozing..."
            className="w-full bg-cyber-black/60 border border-cyber-blue/10 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyber-blue transition-colors placeholder-gray-600 resize-none"
            rows={3}
          />
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting || !question.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-cyber-blue text-white text-sm font-semibold rounded-lg hover:bg-cyan-500 disabled:opacity-50 transition-all shadow-lg shadow-cyber-blue/20"
            >
              <Send size={14} />
              {isSubmitting ? 'Yuborilmoqda...' : 'Savol yuborish'}
            </motion.button>
          </div>
        </form>
      ) : (
        <div className="bg-cyber-navy/20 border border-yellow-500/20 rounded-xl p-6 text-center">
          <AlertCircle size={32} className="text-yellow-500/50 mx-auto mb-3" />
          <p className="text-gray-400 text-sm mb-4">Savol berish uchun tizimga kirishingiz kerak</p>
          <motion.a
            href="/login" // Or trigger login modal
            whileHover={{ scale: 1.05 }}
            className="inline-block px-6 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 rounded-lg text-sm font-semibold hover:bg-yellow-500/20 transition-all"
          >
            Kirish
          </motion.a>
        </div>
      )}

      {/* Discussions List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-10">
            <div className="w-8 h-8 border-2 border-cyber-blue/20 border-t-cyber-blue rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500">Yuklanmoqda...</p>
          </div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-cyber-blue/10 rounded-xl">
            <p className="text-gray-600 text-sm">Hali savollar yo'q. Birinchilardan bo'lib savol bering!</p>
          </div>
        ) : (
          <AnimatePresence>
            {discussions.map((disc) => (
              <motion.div
                key={disc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-cyber-navy/20 border border-cyber-blue/10 rounded-xl overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyber-blue/20 to-purple-500/20 flex items-center justify-center text-cyber-blue border border-cyber-blue/20 shadow-inner">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{disc.userName}</p>
                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(disc.createdAt).toLocaleString('uz-UZ', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed ml-1">{disc.question}</p>

                  {/* Admin Reply Section */}
                  {disc.isAdminReplied ? (
                    <div className="mt-4 pl-4 border-l-2 border-cyber-blue/30 bg-cyber-blue/5 p-4 rounded-r-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield size={14} className="text-cyber-blue" />
                        <span className="text-xs font-bold text-cyber-blue uppercase tracking-wider">Admin Javobi</span>
                      </div>
                      <p className="text-sm text-gray-400 italic font-medium leading-relaxed">
                        "{disc.answer}"
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center gap-2 text-[11px] text-gray-600 italic">
                      <Clock size={12} />
                      Admin javobini kutmoqda...
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

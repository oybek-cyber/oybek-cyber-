import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@contexts/AuthContext';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, loginWithGoogle, isLoading, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // If already logged in, redirect to intended page or home
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/courses';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.phone || !formData.email || !formData.password) {
      setError('Barcha maydonlarni to\'ldirish shart.');
      return;
    }

    try {
      await signup(formData.email, formData.password, formData.name, formData.phone);
      // AuthContext will automatically redirect or update state on success
    } catch (err: any) {
      setError(err.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi.');
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black pt-24 pb-12 flex flex-col justify-center items-center px-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-blue/10 rounded-full blur-3xl mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl mix-blend-screen" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-cyber-navy/50 backdrop-blur-md border border-cyber-blue/20 rounded-2xl p-8 shadow-2xl shadow-cyber-blue/5 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyber-blue to-purple-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-cyber-blue/20">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Platformaga qo'shilish</h1>
          <p className="text-gray-400 text-sm">Kiberxavfsizlik olamiga birinchi qadamni qo'ying</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 px-1 uppercase tracking-wider">To'liq ism</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-cyber-black/60 border border-cyber-blue/20 text-white rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all"
                placeholder="Falonchi Pistonchiyev"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 px-1 uppercase tracking-wider">Telefon raqam</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={18} className="text-gray-500" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-cyber-black/60 border border-cyber-blue/20 text-white rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all"
                placeholder="+998 90 123 45 67"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 px-1 uppercase tracking-wider">Gmail / Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-500" />
              </div>
              <input
                type="email"
                name="email"
                autoComplete="new-email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-cyber-black/60 border border-cyber-blue/20 text-white rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all"
                placeholder="email@gmail.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 px-1 uppercase tracking-wider">Parol</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500" />
              </div>
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-cyber-black/60 border border-cyber-blue/20 text-white rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all"
                placeholder="••••••••"
              />
            </div>
            <p className="text-[10px] text-gray-500 px-1 mt-1">Kamida 8 ta belgi, bosh harf, raqam va maxsus belgi (Masalan: Cyber@2026)</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 px-4 bg-cyber-blue hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyber-blue/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>Ro'yxatdan o'tish <ArrowRight size={18} /></>
            )}
          </motion.button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-px bg-cyber-blue/20 flex-1" />
          <span className="text-xs text-gray-500 font-semibold uppercase">Yoki</span>
          <div className="h-px bg-cyber-blue/20 flex-1" />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={loginWithGoogle}
          disabled={isLoading}
          className="w-full mt-6 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-3 disabled:opacity-70"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google orqali kiring
        </motion.button>

        <p className="text-center text-sm text-gray-400 mt-8">
          Allaqachon hisobingiz bormi?{' '}
          <Link to="/login" className="text-cyber-blue hover:text-blue-400 font-bold hover:underline">
            Tizimga kiring
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

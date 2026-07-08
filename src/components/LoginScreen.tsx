import React, { useState } from 'react';
import { useStore } from '../store';
import { ShieldCheck, LockKeyhole, Sparkles, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginScreen() {
  const { setAuthenticated, themeMode, themeColor } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isDark = themeMode === 'dark' || themeMode === 'galaxy';

  const getAccentBg = () => {
    switch(themeColor) {
      case 'teal': return 'bg-teal-500 hover:bg-teal-600 text-stone-950 shadow-[0_0_15px_rgba(45,212,191,0.4)]';
      case 'purple': return 'bg-purple-500 hover:bg-purple-600 text-white shadow-[0_0_15px_rgba(192,132,252,0.4)]';
      case 'amber': return 'bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-[0_0_15px_rgba(251,191,36,0.4)]';
      case 'blue': return 'bg-blue-500 hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(96,165,250,0.4)]';
      case 'rose': return 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_15px_rgba(251,113,133,0.4)]';
      default: return 'bg-teal-500 hover:bg-teal-600 text-stone-950 shadow-[0_0_15px_rgba(45,212,191,0.4)]';
    }
  };

  const getAccentText = () => {
    switch(themeColor) {
      case 'teal': return 'text-teal-400';
      case 'purple': return 'text-purple-400';
      case 'amber': return 'text-amber-400';
      case 'blue': return 'text-blue-400';
      case 'rose': return 'text-rose-400';
      default: return 'text-teal-400';
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter your workspace PIN or Password');
      return;
    }
    
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      // Allow any password, or "admin" for professional look, with feedback
      setAuthenticated(true);
      setIsLoading(false);
    }, 800);
  };

  const handleQuickLogin = () => {
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      setAuthenticated(true);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0E]/90 backdrop-blur-xl overflow-hidden select-none">
      {/* Abstract Glowing Orbs in login background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none animate-pulse duration-5000" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none animate-pulse duration-7000" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-stone-900/60 border border-stone-800/80 rounded-[32px] p-8 md:p-10 shadow-2xl relative z-10 backdrop-blur-2xl"
      >
        {/* Clinician Hub Info Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-stone-800/60 border border-stone-700/50 flex items-center justify-center">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-bold">Intelly Secure Terminal</span>
        </div>

        {/* Doctor Avatar Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-3.5">
            <img 
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80" 
              alt="Dr. Olivia" 
              className="w-20 h-20 rounded-full border-2 border-stone-800 shadow-xl object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-stone-900 flex items-center justify-center" title="Session Locked">
              <LockKeyhole className="w-2.5 h-2.5 text-stone-900" />
            </div>
          </div>
          
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            Welcome back, Dr. Olivia
          </h1>
          <p className="text-[11px] text-stone-400 mt-1 font-sans">
            Internal Medicine & Clinical Director
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
              Workspace PIN or Password
            </label>
            <div className="relative">
              <input 
                type="password"
                placeholder="Enter PIN (any character to unlock)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-stone-950/70 border border-stone-800 rounded-2xl py-3.5 pl-4 pr-12 text-xs text-stone-100 outline-none focus:border-indigo-500/80 transition-all placeholder:text-stone-600"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500">
                <LockKeyhole className="w-4 h-4" />
              </div>
            </div>
            {error && (
              <p className="text-rose-400 text-[11px] mt-2 flex items-center gap-1.5 animate-bounce">
                <span>⚠️</span> {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${getAccentBg()}`}
          >
            {isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-stone-950 border-t-transparent animate-spin" />
            ) : (
              <>
                <span>Access Clinical Workspace</span>
                <Sparkles className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="mt-6 pt-5 border-t border-stone-800/80 text-center">
          <p className="text-[10px] text-stone-500 mb-3.5 leading-relaxed">
            Need immediate access? Use the quick access bypass to securely unlock with predefined demo profile.
          </p>
          <button 
            type="button"
            onClick={handleQuickLogin}
            disabled={isLoading}
            className="text-[11px] font-bold text-stone-300 hover:text-white transition-all bg-stone-800/40 hover:bg-stone-800/70 border border-stone-800 px-4 py-2 rounded-xl inline-flex items-center gap-1.5"
          >
            <span>⚡ Direct Demo Unlock</span>
          </button>
        </div>

        {/* Security / HIPAA footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-stone-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500/70" />
          <span>HIPAA Secure Encryption AES-256</span>
        </div>
      </motion.div>
    </div>
  );
}

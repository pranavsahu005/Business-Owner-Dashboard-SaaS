import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  User,
  Bell,
  Settings,
  StickyNote,
  CheckCheck,
  Sun,
  Moon,
} from 'lucide-react';
import DateRangePicker from './DateRangePicker';

export default function TopNavigation() {
  const {
    searchQuery,
    setSearchQuery,
    searchFilter,
    setSearchFilter,
    doctorName,
    doctorSpecialty,
    themeMode,
    setThemeMode,
    setActiveTab,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setQuickDrawerOpen,
    setQuickDrawerTab,
    tasks,
    showToast,
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const isDark = themeMode === 'dark' || themeMode === 'galaxy';
  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNotifOpen(false);
    };
    if (notifOpen) {
      document.addEventListener('mousedown', handleOutside);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [notifOpen]);

  const filters: { id: 'all' | 'patients' | 'education' | 'prescriptions' | 'results'; label: string }[] = [
    { id: 'patients', label: 'Patients' },
    { id: 'education', label: 'Education' },
    { id: 'prescriptions', label: 'Prescriptions' },
    { id: 'results', label: 'Test results' },
  ];

  const handleToggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setThemeMode(next);
    showToast(next === 'dark' ? 'Switched to Warm Obsidian Dark Mode' : 'Switched to Warm Pastel Light Mode', 'info');
  };

  const searchBarSurface =
    themeMode === 'galaxy'
      ? 'bg-[#14122B]/90 border-indigo-900/60 text-stone-100'
      : themeMode === 'dark'
      ? 'bg-[#1A1918] border-[#2C2A27] text-stone-100'
      : 'bg-[#FFFEFC] border-[#E7E0D5] text-stone-800';

  const pillControlSurface =
    themeMode === 'galaxy'
      ? 'bg-[#14122B]/90 border-indigo-900/60 text-stone-100 hover:border-indigo-500/50'
      : themeMode === 'dark'
      ? 'bg-[#1A1918] border-[#2C2A27] text-stone-100 hover:border-[#423E39]'
      : 'bg-[#FFFEFC] border-[#E7E0D5] text-stone-700 hover:border-[#D5CBBF]';

  return (
    <header className="relative w-full flex flex-wrap items-center justify-between gap-3.5 pb-6 z-30">
      {/* LEFT: Search Bar with inline categories */}
      <div className="flex-1 min-w-[230px] max-w-xl">
        <motion.div
          animate={{
            boxShadow: isSearchFocused ? '0 6px 24px rgba(24,20,16,0.06)' : 'none',
          }}
          className={`flex items-center gap-3 w-full border rounded-full py-2 px-4 transition-all duration-200 ${searchBarSurface} ${
            isSearchFocused ? (isDark ? 'border-[#524D46]' : 'border-[#C87D55]/50') : ''
          }`}
        >
          <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search patients, files, bills..."
            className={`flex-1 bg-transparent border-none text-xs outline-none font-sans font-medium placeholder-stone-400 ${
              isDark ? 'text-stone-100' : 'text-stone-800'
            }`}
          />

          {/* Inline filters */}
          <div className={`hidden 2xl:flex items-center gap-1 text-[11px] font-sans font-medium text-stone-400 ml-2 border-l pl-3 ${isDark ? 'border-white/10' : 'border-[#EDE7DD]'}`}>
            <span className="text-stone-400 font-semibold mr-1">In:</span>
            {filters.map((f, i) => (
              <div key={f.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setSearchFilter(searchFilter === f.id ? 'all' : f.id)}
                  className={`px-1.5 py-0.5 rounded transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    searchFilter === f.id
                      ? isDark
                        ? 'text-[#8FB5A3] font-semibold bg-white/10'
                        : 'text-[#B06F4B] font-semibold bg-[#F6EFE6]'
                      : isDark
                      ? 'hover:text-stone-200 hover:bg-white/5'
                      : 'hover:text-stone-700 hover:bg-[#FAF6F0]'
                  }`}
                >
                  {f.label}
                </button>
                {i < filters.length - 1 && (
                  <span className={`mx-1 ${isDark ? 'text-white/15' : 'text-[#E5DED3]'}`}>|</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* RIGHT: Date Range Picker + Quick Notes + Light/Dark Switch + Profile Capsule */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Dynamic Date Range Picker */}
        <DateRangePicker />

        {/* Quick Notes & Companion Drawer trigger */}
        <button
          type="button"
          onClick={() => {
            setQuickDrawerTab('notes');
            setQuickDrawerOpen(true);
          }}
          title="Open Quick Notes, Tasks & Mini Calendar"
          className={`flex items-center gap-2 h-9 px-3.5 rounded-full border text-xs font-sans font-medium transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${pillControlSurface}`}
        >
          <StickyNote className="w-3.5 h-3.5 text-[#C87D55]" />
          <span className="hidden md:inline font-semibold">Notes</span>
          {pendingTasks > 0 && (
            <span className="text-[10px] font-mono tabular-nums text-stone-400">
              · {pendingTasks}
            </span>
          )}
        </button>

        {/* Direct Light / Dark Mode Switch */}
        <button
          type="button"
          onClick={handleToggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 shrink-0 cursor-pointer ${pillControlSurface}`}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-[#E8C46A]" />
          ) : (
            <Moon className="w-4 h-4 text-[#5C534A]" />
          )}
        </button>

        {/* Active Doctor profile text */}
        <div className="hidden sm:flex flex-col items-end leading-none mx-1">
          <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#221F1D]'}`}>
            Dr. {doctorName}
          </span>
          <span className="text-[9px] text-[#9E8B7B] font-medium mt-0.5">{doctorSpecialty}</span>
        </div>

        {/* Triple circle obsidian action capsule */}
        <div className="relative flex items-center gap-1.5 bg-[#171614] py-1 px-1.5 rounded-full shadow-sm border border-white/10">
          {/* User Profile */}
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white bg-transparent hover:bg-white/12 transition-colors cursor-pointer"
            title="Doctor Profile & Account"
          >
            <User className="w-4 h-4 stroke-[2]" />
          </button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen((prev) => !prev)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white bg-transparent hover:bg-white/12 transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4 stroke-[2]" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#DF9CA9]" />
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.16 }}
                  data-lenis-prevent
                  className={`absolute right-0 mt-3 w-80 rounded-[20px] border p-3 z-50 ${
                    themeMode === 'galaxy'
                      ? 'bg-[#100E24] border-indigo-900/70 text-stone-100 shadow-2xl'
                      : themeMode === 'dark'
                      ? 'bg-[#1B1A18] border-[#2D2A26] text-stone-100 shadow-2xl'
                      : 'bg-[#FFFEFC] border-[#E6DFD4] text-stone-800 shadow-[0_20px_50px_rgba(24,20,16,0.12)]'
                  }`}
                >
                  <div className={`flex items-center justify-between px-2 pb-2.5 mb-2 border-b ${isDark ? 'border-white/10' : 'border-[#F0E9DF]'}`}>
                    <span className="text-xs font-serif font-semibold">Clinical Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        className="text-[10px] font-semibold text-[#C87D55] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCheck className="w-3 h-3" /> Mark all read
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5 max-h-64 overflow-y-auto no-scrollbar">
                    {notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => markNotificationRead(n.id)}
                        className={`w-full text-left p-2.5 rounded-xl transition-colors cursor-pointer ${
                          n.read
                            ? isDark
                              ? 'opacity-65 hover:bg-white/5'
                              : 'opacity-70 hover:bg-[#FAF6F0]'
                            : isDark
                            ? 'bg-white/8 hover:bg-white/12'
                            : 'bg-[#F8F3EC] hover:bg-[#F2EAE0]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold truncate">{n.title}</span>
                          <span className="text-[10px] font-mono text-stone-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">{n.detail}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings */}
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white bg-transparent hover:bg-white/12 transition-colors cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </div>
    </header>
  );
}

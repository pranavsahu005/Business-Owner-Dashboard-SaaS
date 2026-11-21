import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  StickyNote,
  CheckSquare,
  Calendar as CalendarIcon,
  Plus,
  Check,
  ArrowUpRight,
  Pin,
} from 'lucide-react';
import { useStore } from '../store';

export default function QuickToolsDrawer() {
  const {
    quickDrawerOpen,
    setQuickDrawerOpen,
    quickDrawerTab,
    setQuickDrawerTab,
    notes,
    addNote,
    tasks,
    addTask,
    toggleTask,
    calendarEvents,
    setActiveTab,
    themeMode,
    showToast,
  } = useStore();

  const isDark = themeMode === 'dark' || themeMode === 'galaxy';

  const [quickNoteTitle, setQuickNoteTitle] = useState('');
  const [quickNoteBody, setQuickNoteBody] = useState('');
  const [quickTaskText, setQuickTaskText] = useState('');

  const handleQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNoteBody.trim()) return;
    addNote({
      title: quickNoteTitle.trim() || 'Quick Clinical Note',
      content: quickNoteBody.trim(),
      category: 'Clinical',
      color: 'ivory',
      pinned: false,
      tags: ['Quick'],
    });
    setQuickNoteTitle('');
    setQuickNoteBody('');
    showToast('Quick note saved', 'success');
  };

  const handleQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskText.trim()) return;
    addTask(quickTaskText.trim(), 'Medium', '2026-11-21');
    setQuickTaskText('');
    showToast('Task added', 'info');
  };

  const drawerBg =
    themeMode === 'galaxy'
      ? 'bg-[#0E0C22] border-indigo-900/70 text-stone-100'
      : themeMode === 'dark'
      ? 'bg-[#161619] border-zinc-800 text-stone-100'
      : 'bg-white border-stone-200 text-stone-800';

  const inputClass =
    themeMode === 'galaxy'
      ? 'bg-[#15122E] border-indigo-900/60 text-stone-100 placeholder-indigo-300/50'
      : themeMode === 'dark'
      ? 'bg-[#111113] border-zinc-800 text-stone-100 placeholder-stone-500'
      : 'bg-[#FAF8F5] border-stone-200 text-stone-800 placeholder-stone-400';

  return (
    <AnimatePresence>
      {quickDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setQuickDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
            className={`fixed right-0 top-0 bottom-0 w-full max-w-[400px] z-50 border-l shadow-2xl flex flex-col ${drawerBg}`}
          >
            {/* Header */}
            <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-white/10' : 'border-stone-100'}`}>
              <div>
                <h2 className="text-lg font-serif font-semibold">Workspace Companion</h2>
                <p className="text-[11px] text-stone-400 mt-0.5">Quick notes, tasks & upcoming schedule</p>
              </div>
              <button
                type="button"
                onClick={() => setQuickDrawerOpen(false)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-white/10 text-stone-300' : 'hover:bg-stone-100 text-stone-500'
                }`}
                aria-label="Close workspace companion"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Tab Control */}
            <div className="px-5 pt-4">
              <div className={`grid grid-cols-3 gap-1 p-1 rounded-xl ${isDark ? 'bg-white/5' : 'bg-stone-100'}`}>
                {[
                  { id: 'notes' as const, label: 'Notes', icon: StickyNote },
                  { id: 'tasks' as const, label: 'Tasks', icon: CheckSquare },
                  { id: 'calendar' as const, label: 'Calendar', icon: CalendarIcon },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = quickDrawerTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setQuickDrawerTab(tab.id)}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        active
                          ? isDark
                            ? 'bg-white text-stone-950 font-semibold shadow-xs'
                            : 'bg-white text-stone-900 font-semibold shadow-xs'
                          : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
              {quickDrawerTab === 'notes' && (
                <>
                  <form onSubmit={handleQuickNote} className="space-y-2">
                    <input
                      type="text"
                      value={quickNoteTitle}
                      onChange={(e) => setQuickNoteTitle(e.target.value)}
                      placeholder="Quick note title (optional)"
                      className={`w-full text-xs font-semibold px-3 py-2 rounded-xl border outline-none ${inputClass}`}
                    />
                    <textarea
                      rows={3}
                      value={quickNoteBody}
                      onChange={(e) => setQuickNoteBody(e.target.value)}
                      placeholder="Jot down a clinical observation or reminder..."
                      className={`w-full text-xs px-3 py-2 rounded-xl border outline-none resize-none ${inputClass}`}
                    />
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('notes');
                          setQuickDrawerOpen(false);
                        }}
                        className="text-[11px] font-semibold text-[#B06F4B] inline-flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        Open full Notes <ArrowUpRight className="w-3 h-3" />
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#121212] text-white dark:bg-[#80CBC4] dark:text-stone-950 cursor-pointer"
                      >
                        Save Note
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2.5 pt-2">
                    {notes.slice(0, 5).map((note) => (
                      <div
                        key={note.id}
                        className={`p-3.5 rounded-2xl border ${
                          isDark ? 'bg-white/[0.03] border-white/10' : 'bg-[#FAF8F5] border-stone-200/70'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-semibold text-[#B06F4B]">{note.category}</span>
                          {note.pinned && <Pin className="w-3 h-3 text-[#B06F4B]" />}
                        </div>
                        <h4 className="text-xs font-serif font-semibold">{note.title}</h4>
                        <p className="text-[11px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                          {note.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {quickDrawerTab === 'tasks' && (
                <>
                  <form onSubmit={handleQuickTask} className="flex gap-2">
                    <input
                      type="text"
                      value={quickTaskText}
                      onChange={(e) => setQuickTaskText(e.target.value)}
                      placeholder="Add a quick task..."
                      className={`flex-1 text-xs px-3 py-2 rounded-xl border outline-none ${inputClass}`}
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-xl bg-[#121212] text-white dark:bg-[#80CBC4] dark:text-stone-950 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        className={`w-full flex items-start gap-2.5 p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                          isDark ? 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]' : 'bg-[#FAF8F5] border-stone-200/70 hover:bg-white'
                        }`}
                      >
                        <span
                          className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            task.completed ? 'bg-[#117A65] border-[#117A65] text-white' : 'border-stone-400'
                          }`}
                        >
                          {task.completed && <Check className="w-3 h-3" />}
                        </span>
                        <span className={`text-xs leading-snug ${task.completed ? 'line-through text-stone-400' : ''}`}>
                          {task.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {quickDrawerTab === 'calendar' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-400">Upcoming Schedule</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('calendar');
                        setQuickDrawerOpen(false);
                      }}
                      className="text-[11px] font-semibold text-[#B06F4B] inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      Full Calendar <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {calendarEvents
                      .slice()
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .map((ev) => (
                        <div
                          key={ev.id}
                          className={`p-3.5 rounded-2xl border ${
                            isDark ? 'bg-white/[0.03] border-white/10' : 'bg-[#FAF8F5] border-stone-200/70'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono tabular-nums">
                            <span>{ev.date}</span>
                            <span>{ev.time}</span>
                          </div>
                          <h4 className={`text-xs font-semibold mt-1 ${ev.completed ? 'line-through opacity-60' : ''}`}>
                            {ev.title}
                          </h4>
                          <div className="text-[10px] text-[#B06F4B] font-medium mt-1">
                            {ev.category} · {ev.location}
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

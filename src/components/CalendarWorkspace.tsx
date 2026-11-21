import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Check,
  Trash2,
  Calendar as CalendarIcon,
  X,
} from 'lucide-react';
import { useStore } from '../store';
import { CalendarEvent } from '../types';
import DownloadReportMenu from './DownloadReportMenu';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CATEGORIES: ('All' | CalendarEvent['category'])[] = ['All', 'Clinical', 'Billing', 'Follow-up', 'Personal'];

function toIso(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatReadableDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getCategoryAccent(category: CalendarEvent['category'], isDark: boolean) {
  switch (category) {
    case 'Clinical':
      return {
        dot: 'bg-teal-500',
        chip: isDark ? 'bg-teal-500/15 text-teal-300 border-teal-500/30' : 'bg-[#E8F8F5] text-[#117A65] border-[#B2DFDB]',
        text: isDark ? 'text-teal-300' : 'text-[#117A65]',
      };
    case 'Billing':
      return {
        dot: 'bg-amber-500',
        chip: isDark ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-[#FEF9E7] text-[#9A6700] border-[#F5E0A3]',
        text: isDark ? 'text-amber-300' : 'text-[#9A6700]',
      };
    case 'Follow-up':
      return {
        dot: 'bg-rose-400',
        chip: isDark ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' : 'bg-[#FCE4EC] text-[#AD1457] border-[#F8BBD0]',
        text: isDark ? 'text-rose-300' : 'text-[#AD1457]',
      };
    case 'Personal':
    default:
      return {
        dot: 'bg-indigo-400',
        chip: isDark ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' : 'bg-[#EEF2FF] text-[#4338CA] border-[#C7D2FE]',
        text: isDark ? 'text-indigo-300' : 'text-[#4338CA]',
      };
  }
}

export default function CalendarWorkspace() {
  const {
    calendarEvents,
    addCalendarEvent,
    toggleCalendarEvent,
    deleteCalendarEvent,
    themeMode,
    showToast,
  } = useStore();

  const isDark = themeMode === 'dark' || themeMode === 'galaxy';

  const [viewMonth, setViewMonth] = useState({ year: 2026, month: 10 }); // Nov 2026
  const [selectedDate, setSelectedDate] = useState('2026-11-21');
  const [categoryFilter, setCategoryFilter] = useState<'All' | CalendarEvent['category']>('All');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [category, setCategory] = useState<CalendarEvent['category']>('Clinical');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const filteredEvents = useMemo(() => {
    if (categoryFilter === 'All') return calendarEvents;
    return calendarEvents.filter((ev) => ev.category === categoryFilter);
  }, [calendarEvents, categoryFilter]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    filteredEvents.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [filteredEvents]);

  const selectedDayEvents = eventsByDate[selectedDate] || [];

  const daysInMonth = new Date(viewMonth.year, viewMonth.month + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewMonth.year, viewMonth.month, 1).getDay();
  const monthLabel = new Date(viewMonth.year, viewMonth.month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const shiftMonth = (delta: number) => {
    const d = new Date(viewMonth.year, viewMonth.month + delta, 1);
    setViewMonth({ year: d.getFullYear(), month: d.getMonth() });
  };

  const jumpToToday = () => {
    setViewMonth({ year: 2026, month: 10 });
    setSelectedDate('2026-11-21');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addCalendarEvent({
      title: title.trim(),
      date: selectedDate,
      time: time.trim() || '09:00 AM',
      category,
      location: location.trim() || 'Intelly Clinic',
      description: description.trim(),
      completed: false,
    });
    setTitle('');
    setLocation('');
    setDescription('');
    setIsAddOpen(false);
    showToast(`Added "${title.trim()}" to ${selectedDate}`, 'success');
  };

  const surfaceClass =
    themeMode === 'galaxy'
      ? 'bg-[#0E0C22]/85 border-indigo-950/70 text-stone-100'
      : themeMode === 'dark'
      ? 'bg-[#18181B]/95 border-zinc-800/80 text-stone-100'
      : 'bg-white border-stone-200/70 text-stone-800 shadow-[0_4px_24px_rgba(0,0,0,0.015)]';

  const inputClass =
    themeMode === 'galaxy'
      ? 'bg-[#15122E] border-indigo-900/60 text-stone-100 placeholder-indigo-300/50'
      : themeMode === 'dark'
      ? 'bg-[#121214] border-zinc-800 text-stone-100 placeholder-stone-500'
      : 'bg-[#FAF8F5] border-stone-200 text-stone-800 placeholder-stone-400';

  return (
    <motion.div
      key="calendar-workspace"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-serif font-semibold tracking-tight ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
            Clinical Calendar & Milestones
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Coordinate outpatient consultations, billing deadlines, and follow-up reviews in one smooth monthly planner.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <DownloadReportMenu viewTitle="Clinical Calendar & Schedule Overview" />
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 py-2.5 px-4 rounded-full text-xs font-sans font-semibold bg-[#B06F4B] hover:bg-[#9B5E3D] text-white shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Event</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className={`flex items-center gap-1 p-1 rounded-full border ${isDark ? 'bg-white/5 border-white/10' : 'bg-stone-100/90 border-stone-200/70'}`}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all cursor-pointer ${
                categoryFilter === cat
                  ? isDark
                    ? 'bg-white text-stone-950 font-semibold shadow-xs'
                    : 'bg-stone-950 text-white font-semibold shadow-xs'
                  : isDark
                  ? 'text-stone-400 hover:text-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-400 font-sans">
          <span>{filteredEvents.length} scheduled items</span>
          <span aria-hidden="true">·</span>
          <span>{filteredEvents.filter((e) => !e.completed).length} upcoming</span>
        </div>
      </div>

      {/* Main Split Grid: Full Month Calendar (8 cols) + Selected Day Agenda (4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Monthly Grid */}
        <div className={`xl:col-span-8 rounded-[24px] border p-6 ${surfaceClass}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-serif font-semibold tracking-tight">{monthLabel}</h2>
              <button
                type="button"
                onClick={jumpToToday}
                className={`text-[11px] font-sans font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                  isDark
                    ? 'border-white/15 text-stone-300 hover:bg-white/10'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                Today
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isDark ? 'border-white/10 hover:bg-white/10 text-stone-300' : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isDark ? 'border-white/10 hover:bg-white/10 text-stone-300' : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {WEEKDAYS.map((wd) => (
              <div key={wd} className="text-center text-[11px] font-sans font-semibold text-stone-400 py-1.5">
                {wd}
              </div>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`pad-${idx}`} className="min-h-[86px] rounded-2xl opacity-30" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const iso = toIso(viewMonth.year, viewMonth.month, day);
              const dayEvents = eventsByDate[iso] || [];
              const isSelected = iso === selectedDate;
              const isToday = iso === '2026-11-21';

              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelectedDate(iso)}
                  className={`min-h-[86px] p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? isDark
                        ? 'bg-[#B06F4B]/20 border-[#B06F4B] ring-1 ring-[#B06F4B]/50'
                        : 'bg-[#FAF3ED] border-[#B06F4B] shadow-xs'
                      : isDark
                      ? 'bg-white/[0.02] border-white/8 hover:bg-white/[0.06]'
                      : 'bg-[#FAF8F5]/60 border-stone-200/60 hover:bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-mono tabular-nums font-semibold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-[#121212] text-white dark:bg-[#80CBC4] dark:text-stone-950'
                          : isSelected
                          ? 'text-[#B06F4B]'
                          : isDark
                          ? 'text-stone-200'
                          : 'text-stone-700'
                      }`}
                    >
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-mono tabular-nums text-stone-400">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Event markers inside cell */}
                  <div className="space-y-1 mt-1.5 w-full overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => {
                      const style = getCategoryAccent(ev.category, isDark);
                      return (
                        <div
                          key={ev.id}
                          className={`text-[10px] leading-tight truncate px-1.5 py-0.5 rounded-md border ${style.chip} ${
                            ev.completed ? 'line-through opacity-60' : ''
                          }`}
                        >
                          {ev.title}
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] text-stone-400 px-1 font-medium">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Day Agenda + Upcoming */}
        <div className="xl:col-span-4 space-y-6">
          <div className={`rounded-[24px] border p-6 ${surfaceClass}`}>
            <div className="flex items-start justify-between gap-2 pb-4 border-b border-stone-200/20">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#B06F4B]">
                  Selected Day
                </p>
                <h3 className="text-base font-serif font-semibold mt-1 leading-snug">
                  {formatReadableDate(selectedDate)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(true)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isDark ? 'border-white/10 hover:bg-white/10 text-stone-200' : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
                title="Add event on this day"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {selectedDayEvents.length === 0 ? (
                <div className={`rounded-2xl border border-dashed p-6 text-center ${isDark ? 'border-white/10 text-stone-400' : 'border-stone-200 text-stone-500'}`}>
                  <CalendarIcon className="w-6 h-6 mx-auto mb-2 text-stone-400" />
                  <p className="text-xs font-medium">No events scheduled for this day.</p>
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(true)}
                    className="mt-3 text-xs font-semibold text-[#B06F4B] hover:underline cursor-pointer"
                  >
                    + Schedule an event
                  </button>
                </div>
              ) : (
                selectedDayEvents.map((ev) => {
                  const accent = getCategoryAccent(ev.category, isDark);
                  return (
                    <div
                      key={ev.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isDark
                          ? 'bg-white/[0.03] border-white/10 hover:border-white/20'
                          : 'bg-[#FAF8F5] border-stone-200/70 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <button
                            type="button"
                            onClick={() => toggleCalendarEvent(ev.id)}
                            className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                              ev.completed
                                ? 'bg-teal-500 border-teal-500 text-white'
                                : isDark
                                ? 'border-stone-600 hover:border-stone-400'
                                : 'border-stone-300 hover:border-stone-500'
                            }`}
                            aria-label="Toggle completed"
                          >
                            {ev.completed && <Check className="w-3 h-3" />}
                          </button>
                          <div className="min-w-0">
                            <h4 className={`text-xs font-bold leading-snug ${ev.completed ? 'line-through opacity-55' : ''}`}>
                              {ev.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-1 flex-wrap">
                              <span className={`font-semibold ${accent.text}`}>{ev.category}</span>
                              <span aria-hidden="true">·</span>
                              <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                                <Clock className="w-3 h-3" /> {ev.time}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            deleteCalendarEvent(ev.id);
                            showToast('Event removed from calendar', 'info');
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                          aria-label="Delete event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {ev.location && (
                        <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-2 pl-6">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span>{ev.location}</span>
                        </div>
                      )}
                      {ev.description && (
                        <p className="text-[11px] text-stone-400 mt-1.5 pl-6 leading-relaxed">
                          {ev.description}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Upcoming Timeline Summary */}
          <div className={`rounded-[24px] border p-5 ${surfaceClass}`}>
            <h3 className="text-sm font-serif font-semibold mb-3">Upcoming This Month</h3>
            <div className="space-y-2.5">
              {filteredEvents
                .filter((e) => !e.completed)
                .sort((a, b) => a.date.localeCompare(b.date))
                .slice(0, 4)
                .map((ev) => {
                  const accent = getCategoryAccent(ev.category, isDark);
                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => setSelectedDate(ev.date)}
                      className={`w-full flex items-center justify-between gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                        isDark ? 'hover:bg-white/5' : 'hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">{ev.title}</div>
                        <div className="text-[10px] text-stone-400 font-mono tabular-nums mt-0.5">
                          {ev.date} · {ev.time}
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold shrink-0 ${accent.text}`}>{ev.category}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Calendar Event Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setIsAddOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-[24px] border p-6 shadow-2xl ${
                themeMode === 'galaxy'
                  ? 'bg-[#0F0D24] border-indigo-900 text-stone-100'
                  : themeMode === 'dark'
                  ? 'bg-[#18181B] border-zinc-800 text-stone-100'
                  : 'bg-white border-stone-200 text-stone-800'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-serif font-semibold">Schedule Calendar Event</h3>
                  <p className="text-[11px] font-mono tabular-nums text-stone-400 mt-0.5">
                    Date: {selectedDate}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="p-1.5 rounded-xl text-stone-400 hover:bg-stone-500/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Cardiology Follow-up or Insurance Audit"
                    className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none ${inputClass}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className={`w-full text-xs font-mono tabular-nums px-3 py-2.5 rounded-xl border outline-none ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Time</label>
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="10:30 AM"
                      className={`w-full text-xs font-mono tabular-nums px-3 py-2.5 rounded-xl border outline-none ${inputClass}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CalendarEvent['category'])}
                      className={`w-full text-xs px-3 py-2.5 rounded-xl border outline-none ${inputClass}`}
                    >
                      <option value="Clinical">Clinical</option>
                      <option value="Billing">Billing</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Location / Room</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Room 302 / Video Suite"
                      className={`w-full text-xs px-3 py-2.5 rounded-xl border outline-none ${inputClass}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Notes</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Key preparation notes or billing context..."
                    className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none resize-none ${inputClass}`}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-medium text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full text-xs font-semibold bg-[#121212] text-white hover:bg-stone-800 dark:bg-[#80CBC4] dark:text-stone-950 transition-colors cursor-pointer"
                  >
                    Save Event
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

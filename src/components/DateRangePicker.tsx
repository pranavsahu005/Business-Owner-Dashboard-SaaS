import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useStore } from '../store';
import { DateRangePreset } from '../types';
import { getPresetDateRange } from '../utils/analyticsData';

const PRESETS: { id: DateRangePreset; label: string; hint: string }[] = [
  { id: '7d', label: 'Last 7 Days', hint: 'Daily view' },
  { id: '30d', label: 'Last 30 Days', hint: 'Rolling month' },
  { id: '90d', label: 'This Quarter (90d)', hint: 'Quarterly + forecast' },
  { id: 'ytd', label: 'Year to Date', hint: 'Jan – Nov 2026' },
  { id: 'all', label: 'All Time & Forecast', hint: 'Full horizon' },
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function formatShortDate(iso: string): string {
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
}

function toIsoDate(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export default function DateRangePicker() {
  const { dateRange, setDateRange, themeMode, showToast } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customStart, setCustomStart] = useState(dateRange.startDate);
  const [customEnd, setCustomEnd] = useState(dateRange.endDate);
  const [viewMonth, setViewMonth] = useState<{ year: number; month: number }>({ year: 2026, month: 10 }); // Nov 2026
  const [selectingStep, setSelectingStep] = useState<'start' | 'end'>('start');

  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = themeMode === 'dark' || themeMode === 'galaxy';

  useEffect(() => {
    setCustomStart(dateRange.startDate);
    setCustomEnd(dateRange.endDate);
  }, [dateRange]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectPreset = (presetId: DateRangePreset) => {
    const nextRange = getPresetDateRange(presetId);
    setDateRange(nextRange);
    setIsOpen(false);
    showToast(`Analytics filtered to ${nextRange.label}`, 'info');
  };

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) return;
    const [s, e] = customStart <= customEnd ? [customStart, customEnd] : [customEnd, customStart];
    setDateRange({
      preset: 'custom',
      startDate: s,
      endDate: e,
      label: `${formatShortDate(s)} – ${formatShortDate(e)}`,
    });
    setIsOpen(false);
    showToast(`Applied custom interval: ${formatShortDate(s)} to ${formatShortDate(e)}`, 'info');
  };

  const handleCalendarDayClick = (iso: string) => {
    if (selectingStep === 'start') {
      setCustomStart(iso);
      if (iso > customEnd) setCustomEnd(iso);
      setSelectingStep('end');
    } else {
      if (iso < customStart) {
        setCustomEnd(customStart);
        setCustomStart(iso);
      } else {
        setCustomEnd(iso);
      }
      setSelectingStep('start');
    }
  };

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

  const triggerClasses =
    themeMode === 'galaxy'
      ? 'bg-[#121028]/90 border-indigo-900/70 text-stone-100 hover:border-indigo-500/60'
      : themeMode === 'dark'
      ? 'bg-[#18181B] border-zinc-800 text-stone-100 hover:border-zinc-600'
      : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)]';

  const popoverClasses =
    themeMode === 'galaxy'
      ? 'bg-[#0F0D24] border-indigo-900/80 text-stone-100 shadow-[0_24px_60px_rgba(0,0,0,0.65)]'
      : themeMode === 'dark'
      ? 'bg-[#18181B] border-zinc-800 text-stone-100 shadow-[0_24px_60px_rgba(0,0,0,0.55)]'
      : 'bg-white border-stone-200/90 text-stone-800 shadow-[0_24px_60px_rgba(24,20,16,0.12)]';

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`flex items-center gap-2.5 h-9 px-3.5 rounded-full border text-xs font-sans font-medium transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${triggerClasses}`}
      >
        <Calendar className="w-3.5 h-3.5 text-[#B06F4B] shrink-0" />
        <span className="font-semibold tracking-tight">{dateRange.label}</span>
        <span className={`hidden xl:inline text-[10px] font-mono tabular-nums ${isDark ? 'text-stone-400' : 'text-stone-400'}`}>
          · {formatShortDate(dateRange.startDate)} – {formatShortDate(dateRange.endDate)}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${isDark ? 'text-stone-400' : 'text-stone-400'}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute right-0 mt-2.5 w-[540px] max-w-[92vw] rounded-[22px] border p-4 z-50 ${popoverClasses}`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Left Column: Quick Presets */}
              <div className={`sm:col-span-5 sm:pr-4 sm:border-r ${isDark ? 'border-white/10' : 'border-stone-100'}`}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2.5 px-2">
                  Time Interval
                </p>
                <div className="space-y-1">
                  {PRESETS.map((preset) => {
                    const active = dateRange.preset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all duration-150 ${
                          active
                            ? isDark
                              ? 'bg-white/10 text-white'
                              : 'bg-stone-900 text-white'
                            : isDark
                            ? 'text-stone-300 hover:bg-white/5'
                            : 'text-stone-700 hover:bg-stone-100/80'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold leading-tight">{preset.label}</div>
                          <div className={`text-[10px] mt-0.5 ${active ? 'text-stone-300' : 'text-stone-400'}`}>
                            {preset.hint}
                          </div>
                        </div>
                        {active && <Check className="w-3.5 h-3.5 text-[#80CBC4] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Interactive Mini Calendar + Custom Inputs */}
              <div className="sm:col-span-7 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <button
                      type="button"
                      onClick={() => shiftMonth(-1)}
                      className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-stone-300' : 'hover:bg-stone-100 text-stone-600'}`}
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-serif font-semibold tracking-tight">{monthLabel}</span>
                    <button
                      type="button"
                      onClick={() => shiftMonth(1)}
                      className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-stone-300' : 'hover:bg-stone-100 text-stone-600'}`}
                      aria-label="Next month"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-0.5 mb-1">
                    {WEEKDAYS.map((wd) => (
                      <div key={wd} className="text-center text-[10px] font-semibold text-stone-400 py-1">
                        {wd}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-0.5">
                    {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="h-7" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, idx) => {
                      const day = idx + 1;
                      const iso = toIsoDate(viewMonth.year, viewMonth.month, day);
                      const isStart = iso === customStart;
                      const isEnd = iso === customEnd;
                      const inRange = iso > customStart && iso < customEnd;

                      return (
                        <button
                          key={iso}
                          type="button"
                          onClick={() => handleCalendarDayClick(iso)}
                          className={`h-7 rounded-lg text-[11px] font-mono tabular-nums transition-all duration-150 ${
                            isStart || isEnd
                              ? 'bg-[#B06F4B] text-white font-bold shadow-xs'
                              : inRange
                              ? isDark
                                ? 'bg-[#B06F4B]/25 text-stone-100'
                                : 'bg-[#F8EFE9] text-[#8B5232] font-medium'
                              : isDark
                              ? 'text-stone-300 hover:bg-white/10'
                              : 'text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Date Inputs & Apply */}
                <div className={`pt-3 border-t space-y-2.5 ${isDark ? 'border-white/10' : 'border-stone-100'}`}>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block">
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        From
                      </span>
                      <input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        className={`w-full text-[11px] font-mono tabular-nums px-2.5 py-1.5 rounded-lg border outline-none ${
                          isDark
                            ? 'bg-white/5 border-white/15 text-stone-100'
                            : 'bg-[#FAF8F5] border-stone-200 text-stone-800'
                        }`}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        To
                      </span>
                      <input
                        type="date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        className={`w-full text-[11px] font-mono tabular-nums px-2.5 py-1.5 rounded-lg border outline-none ${
                          isDark
                            ? 'bg-white/5 border-white/15 text-stone-100'
                            : 'bg-[#FAF8F5] border-stone-200 text-stone-800'
                        }`}
                      />
                    </label>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-stone-400">
                      {selectingStep === 'start' ? 'Click start date on calendar' : 'Click end date to finish'}
                    </span>
                    <button
                      type="button"
                      onClick={handleApplyCustom}
                      className="px-3.5 py-1.5 rounded-full text-[11px] font-sans font-semibold bg-stone-950 text-white hover:bg-stone-800 dark:bg-[#80CBC4] dark:text-stone-950 transition-colors cursor-pointer"
                    >
                      Apply Range
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

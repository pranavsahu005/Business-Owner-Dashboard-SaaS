import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, FileText, FileSpreadsheet, ChevronDown, Check } from 'lucide-react';
import { useStore } from '../store';
import { computeFilteredAnalytics } from '../utils/analyticsData';
import { exportAnalyticsCSV, exportAnalyticsPDF } from '../utils/reportExporter';

interface DownloadReportMenuProps {
  viewTitle: string;
}

export default function DownloadReportMenu({ viewTitle }: DownloadReportMenuProps) {
  const { dateRange, patientBills, invoices, doctorName, doctorSpecialty, themeMode, showToast } = useStore();
  const [open, setOpen] = useState(false);
  const [recentExport, setRecentExport] = useState<'pdf' | 'csv' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isDark = themeMode === 'dark' || themeMode === 'galaxy';

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.addEventListener('mousedown', onOutside);
      document.addEventListener('keydown', onEsc);
    }
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const handleExport = (format: 'pdf' | 'csv') => {
    const analytics = computeFilteredAnalytics(dateRange, patientBills);
    const payload = {
      viewTitle,
      doctorName,
      doctorSpecialty,
      dateRange,
      analytics,
      bills: analytics.filteredBills,
      invoices,
    };

    try {
      const filename = format === 'pdf' ? exportAnalyticsPDF(payload) : exportAnalyticsCSV(payload);
      setRecentExport(format);
      showToast(`Downloaded ${format.toUpperCase()} report: ${filename}`, 'success');
      setTimeout(() => {
        setRecentExport(null);
        setOpen(false);
      }, 600);
    } catch (err) {
      console.error('Report export error:', err);
      showToast('Could not generate report. Please try again.', 'warning');
    }
  };

  return (
    <div ref={menuRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-2 py-2.5 px-4 rounded-full text-xs font-sans font-semibold transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer border ${
          isDark
            ? 'bg-white text-stone-950 border-white/20 hover:bg-stone-200 shadow-lg'
            : 'bg-[#121212] text-white border-stone-900 hover:bg-stone-800 shadow-md'
        }`}
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span>Download Report</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute right-0 mt-2 w-72 rounded-[20px] border p-2 z-50 ${
              themeMode === 'galaxy'
                ? 'bg-[#0F0D24] border-indigo-900/80 text-stone-100 shadow-2xl'
                : themeMode === 'dark'
                ? 'bg-[#18181B] border-zinc-800 text-stone-100 shadow-2xl'
                : 'bg-white border-stone-200 text-stone-800 shadow-[0_20px_50px_rgba(24,20,16,0.14)]'
            }`}
          >
            <div className={`px-3 py-2 mb-1 border-b ${isDark ? 'border-white/10' : 'border-stone-100'}`}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Export Active View
              </p>
              <p className="text-xs font-serif font-semibold truncate mt-0.5">{viewTitle}</p>
              <p className="text-[10px] font-mono tabular-nums text-stone-400 mt-0.5">
                {dateRange.label} · {dateRange.startDate} to {dateRange.endDate}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleExport('pdf')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-[#FAF8F5]'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-rose-500/12 text-rose-500 flex items-center justify-center shrink-0">
                {recentExport === 'pdf' ? <Check className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold">Structured PDF Report</div>
                <div className="text-[10px] text-stone-400">Executive summary, forecast & tables</div>
              </div>
              <span className="text-[10px] font-mono font-semibold text-stone-400">.PDF</span>
            </button>

            <button
              type="button"
              onClick={() => handleExport('csv')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer mt-0.5 ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-[#FAF8F5]'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/12 text-emerald-600 flex items-center justify-center shrink-0">
                {recentExport === 'csv' ? <Check className="w-4 h-4" /> : <FileSpreadsheet className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold">Structured CSV Data</div>
                <div className="text-[10px] text-stone-400">Excel-ready metrics & billing rows</div>
              </div>
              <span className="text-[10px] font-mono font-semibold text-stone-400">.CSV</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

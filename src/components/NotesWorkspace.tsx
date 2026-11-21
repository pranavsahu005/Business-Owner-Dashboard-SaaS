import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Pin,
  Trash2,
  Search,
  Check,
  Edit3,
  X,
  CheckSquare,
  StickyNote,
} from 'lucide-react';
import { useStore } from '../store';
import { ClinicalNote, DailyTask } from '../types';

const NOTE_CATEGORIES: ('All' | ClinicalNote['category'])[] = [
  'All',
  'Clinical',
  'Patient Follow-up',
  'Billing',
  'Meeting',
  'Personal',
];

const NOTE_COLORS: { id: ClinicalNote['color']; swatch: string; lightCard: string; darkCard: string }[] = [
  {
    id: 'ivory',
    swatch: 'bg-[#F8EFE9]',
    lightCard: 'bg-[#FAF6F1] border-[#EDE3D8]',
    darkCard: 'bg-[#201C18]/90 border-amber-900/40',
  },
  {
    id: 'sage',
    swatch: 'bg-[#E8F5E9]',
    lightCard: 'bg-[#EFF8F5] border-[#D3ECE5]',
    darkCard: 'bg-[#12221E]/90 border-teal-900/40',
  },
  {
    id: 'blush',
    swatch: 'bg-[#FCE4EC]',
    lightCard: 'bg-[#FDF1F5] border-[#F4D6E0]',
    darkCard: 'bg-[#25161E]/90 border-rose-900/40',
  },
  {
    id: 'sky',
    swatch: 'bg-[#EAF2F8]',
    lightCard: 'bg-[#F0F6FB] border-[#D6E6F2]',
    darkCard: 'bg-[#131D29]/90 border-sky-900/40',
  },
  {
    id: 'lavender',
    swatch: 'bg-[#F3E8FF]',
    lightCard: 'bg-[#F6F1FC] border-[#E4D7F5]',
    darkCard: 'bg-[#1D162B]/90 border-purple-900/40',
  },
];

export default function NotesWorkspace() {
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    togglePinNote,
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    themeMode,
    showToast,
  } = useStore();

  const isDark = themeMode === 'dark' || themeMode === 'galaxy';

  const [categoryFilter, setCategoryFilter] = useState<'All' | ClinicalNote['category']>('All');
  const [noteQuery, setNoteQuery] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Note editor state
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftCategory, setDraftCategory] = useState<ClinicalNote['category']>('Clinical');
  const [draftColor, setDraftColor] = useState<ClinicalNote['color']>('ivory');
  const [draftTags, setDraftTags] = useState('');

  // Task input state
  const [taskInput, setTaskInput] = useState('');
  const [taskPriority, setTaskPriority] = useState<DailyTask['priority']>('Medium');
  const [taskFilter, setTaskFilter] = useState<'all' | 'open' | 'done'>('all');

  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => (categoryFilter === 'All' ? true : n.category === categoryFilter))
      .filter((n) => {
        if (!noteQuery.trim()) return true;
        const q = noteQuery.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }, [notes, categoryFilter, noteQuery]);

  const filteredTasks = useMemo(() => {
    if (taskFilter === 'open') return tasks.filter((t) => !t.completed);
    if (taskFilter === 'done') return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, taskFilter]);

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const completionPct = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const openNewNote = () => {
    setEditingId(null);
    setDraftTitle('');
    setDraftContent('');
    setDraftCategory('Clinical');
    setDraftColor('ivory');
    setDraftTags('');
    setEditorOpen(true);
  };

  const openEditNote = (note: ClinicalNote) => {
    setEditingId(note.id);
    setDraftTitle(note.title);
    setDraftContent(note.content);
    setDraftCategory(note.category);
    setDraftColor(note.color);
    setDraftTags(note.tags.join(', '));
    setEditorOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim() && !draftContent.trim()) return;
    const parsedTags = draftTags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingId) {
      updateNote(editingId, {
        title: draftTitle.trim() || 'Untitled Clinical Note',
        content: draftContent.trim(),
        category: draftCategory,
        color: draftColor,
        tags: parsedTags,
      });
      showToast('Note updated', 'success');
    } else {
      addNote({
        title: draftTitle.trim() || 'Untitled Clinical Note',
        content: draftContent.trim(),
        category: draftCategory,
        color: draftColor,
        pinned: false,
        tags: parsedTags,
      });
      showToast('New clinical note saved', 'success');
    }
    setEditorOpen(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    addTask(taskInput.trim(), taskPriority, '2026-11-21');
    setTaskInput('');
    showToast('Task added to checklist', 'info');
  };

  const getCardStyle = (color: ClinicalNote['color']) => {
    const entry = NOTE_COLORS.find((c) => c.id === color) || NOTE_COLORS[0];
    return isDark ? entry.darkCard : entry.lightCard;
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
      key="notes-workspace"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-serif font-semibold tracking-tight ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
            Clinical Notes & Daily Checklist
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Capture patient observations, billing reminders, and action items with instant pinning and search.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewNote}
          className="flex items-center gap-2 py-2.5 px-5 rounded-full text-xs font-sans font-semibold bg-[#121212] text-white hover:bg-stone-800 dark:bg-[#80CBC4] dark:text-stone-950 shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Note</span>
        </button>
      </div>

      {/* Main Split Grid: Notes Board (8 cols) + Daily Checklist (4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Notes Collection */}
        <div className="xl:col-span-8 space-y-4">
          {/* Search & Category Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1 flex-wrap">
              {NOTE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? isDark
                        ? 'bg-white text-stone-950 font-semibold'
                        : 'bg-stone-900 text-white font-semibold'
                      : isDark
                      ? 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={noteQuery}
                onChange={(e) => setNoteQuery(e.target.value)}
                placeholder="Filter notes or tags..."
                className={`w-full pl-8 pr-3 py-1.5 rounded-full border text-xs outline-none ${inputClass}`}
              />
            </div>
          </div>

          {/* Notes Grid */}
          {filteredNotes.length === 0 ? (
            <div className={`rounded-[24px] border border-dashed p-12 text-center ${surfaceClass}`}>
              <StickyNote className="w-8 h-8 mx-auto mb-3 text-stone-400" />
              <p className="text-sm font-serif font-semibold">No notes match this filter</p>
              <p className="text-xs text-stone-400 mt-1">Create a new clinical note or clear your search filter.</p>
              <button
                type="button"
                onClick={openNewNote}
                className="mt-4 px-4 py-2 rounded-full text-xs font-semibold bg-[#B06F4B] text-white cursor-pointer"
              >
                Create First Note
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNotes.map((note) => (
                <motion.article
                  layout
                  key={note.id}
                  className={`rounded-[22px] border p-5 flex flex-col justify-between transition-shadow hover:shadow-md ${getCardStyle(
                    note.color
                  )}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                        <span className="font-semibold text-[#B06F4B]">{note.category}</span>
                        {note.pinned && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-medium">Pinned</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => togglePinNote(note.id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            note.pinned
                              ? 'text-[#B06F4B] bg-[#B06F4B]/12'
                              : 'text-stone-400 hover:text-stone-600 hover:bg-black/5'
                          }`}
                          title={note.pinned ? 'Unpin note' : 'Pin note'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditNote(note)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-black/5 transition-colors cursor-pointer"
                          title="Edit note"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteNote(note.id);
                            showToast('Note deleted', 'info');
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className={`text-base font-serif font-semibold leading-snug mb-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                      {note.title}
                    </h3>
                    <p className={`text-xs leading-relaxed whitespace-pre-line ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                      {note.content}
                    </p>
                  </div>

                  <div className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 text-[10px] text-stone-400 ${isDark ? 'border-white/10' : 'border-black/5'}`}>
                    <span className="truncate">
                      {note.tags.length > 0 ? note.tags.map((t) => `#${t}`).join('  ') : 'No tags'}
                    </span>
                    <span className="font-mono tabular-nums shrink-0">{note.updatedAt}</span>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>

        {/* Right: Daily Checklist & Priority Tasks */}
        <div className={`xl:col-span-4 rounded-[24px] border p-6 space-y-5 ${surfaceClass}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-semibold flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#B06F4B]" />
                <span>Daily Checklist</span>
              </h2>
              <p className="text-[11px] text-stone-400 mt-0.5 font-mono tabular-nums">
                {completedTasksCount} of {tasks.length} completed ({completionPct}%)
              </p>
            </div>
          </div>

          {/* Subtle progress bar */}
          <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-stone-100'}`}>
            <motion.div
              initial={false}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-[#80CBC4] rounded-full"
            />
          </div>

          {/* Quick-add task form */}
          <form onSubmit={handleAddTask} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Add a clinical or billing task..."
                className={`flex-1 text-xs px-3.5 py-2.5 rounded-xl border outline-none ${inputClass}`}
              />
              <button
                type="submit"
                className="px-3.5 py-2.5 rounded-xl bg-[#121212] text-white hover:bg-stone-800 dark:bg-[#80CBC4] dark:text-stone-950 transition-colors cursor-pointer shrink-0"
                aria-label="Add task"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="text-stone-400">Priority:</span>
                {(['High', 'Medium', 'Low'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTaskPriority(p)}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                      taskPriority === p
                        ? p === 'High'
                          ? 'bg-rose-500/15 text-rose-500'
                          : p === 'Medium'
                          ? 'bg-amber-500/15 text-amber-600'
                          : 'bg-teal-500/15 text-teal-600'
                        : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                {(['all', 'open', 'done'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setTaskFilter(f)}
                    className={`px-1.5 py-0.5 rounded capitalize cursor-pointer ${
                      taskFilter === f ? 'font-bold text-[#B06F4B]' : 'text-stone-400'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* Task list */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto no-scrollbar">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`group flex items-start gap-2.5 p-3 rounded-xl border transition-colors ${
                  isDark
                    ? 'bg-white/[0.03] border-white/8 hover:border-white/15'
                    : 'bg-[#FAF8F5]/80 border-stone-200/60 hover:bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                    task.completed
                      ? 'bg-[#117A65] border-[#117A65] text-white'
                      : isDark
                      ? 'border-stone-600 hover:border-stone-400'
                      : 'border-stone-300 hover:border-stone-500'
                  }`}
                  aria-label="Toggle task completion"
                >
                  {task.completed && <Check className="w-3 h-3" />}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-snug ${task.completed ? 'line-through text-stone-400' : ''}`}>
                    {task.text}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-1">
                    <span
                      className={`font-semibold ${
                        task.priority === 'High'
                          ? 'text-rose-500'
                          : task.priority === 'Medium'
                          ? 'text-amber-600'
                          : 'text-teal-600'
                      }`}
                    >
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{task.dueDate}</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-stone-400 hover:text-rose-500 transition-all cursor-pointer"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Note Create / Edit Modal */}
      <AnimatePresence>
        {editorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setEditorOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-lg rounded-[24px] border p-6 shadow-2xl ${
                themeMode === 'galaxy'
                  ? 'bg-[#0F0D24] border-indigo-900 text-stone-100'
                  : themeMode === 'dark'
                  ? 'bg-[#18181B] border-zinc-800 text-stone-100'
                  : 'bg-white border-stone-200 text-stone-800'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-serif font-semibold">
                  {editingId ? 'Edit Clinical Note' : 'New Clinical Note'}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="p-1.5 rounded-xl text-stone-400 hover:bg-stone-500/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveNote} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="Note heading..."
                    className={`w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border outline-none ${inputClass}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Category</label>
                    <select
                      value={draftCategory}
                      onChange={(e) => setDraftCategory(e.target.value as ClinicalNote['category'])}
                      className={`w-full text-xs px-3 py-2.5 rounded-xl border outline-none ${inputClass}`}
                    >
                      <option value="Clinical">Clinical</option>
                      <option value="Patient Follow-up">Patient Follow-up</option>
                      <option value="Billing">Billing</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Card Tone</label>
                    <div className="flex items-center gap-2 pt-1.5">
                      {NOTE_COLORS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setDraftColor(c.id)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${c.swatch} ${
                            draftColor === c.id ? 'border-[#B06F4B] scale-110' : 'border-stone-300/60'
                          }`}
                          aria-label={`Color ${c.id}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Content</label>
                  <textarea
                    rows={5}
                    required
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    placeholder="Write observations, billing reminders, or follow-up steps..."
                    className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none resize-none leading-relaxed ${inputClass}`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={draftTags}
                    onChange={(e) => setDraftTags(e.target.value)}
                    placeholder="e.g. Q4, Telehealth, Urgent"
                    className={`w-full text-xs px-3.5 py-2 rounded-xl border outline-none ${inputClass}`}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditorOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-medium text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full text-xs font-semibold bg-[#121212] text-white hover:bg-stone-800 dark:bg-[#80CBC4] dark:text-stone-950 transition-colors cursor-pointer"
                  >
                    {editingId ? 'Save Changes' : 'Save Note'}
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

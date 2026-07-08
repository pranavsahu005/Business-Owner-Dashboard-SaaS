import { useState } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  User, 
  Bell, 
  Settings,
  Sparkles,
  SearchCode
} from 'lucide-react';

export default function TopNavigation() {
  const { 
    searchQuery, 
    setSearchQuery,
    searchFilter,
    setSearchFilter,
    doctorName,
    doctorSpecialty
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filters: { id: 'all' | 'patients' | 'education' | 'prescriptions' | 'results'; label: string }[] = [
    { id: 'patients', label: 'Patients' },
    { id: 'education', label: 'Education' },
    { id: 'prescriptions', label: 'Prescriptions' },
    { id: 'results', label: 'Test results' }
  ];

  return (
    <header className="relative w-full flex items-center justify-between gap-6 pb-6 z-30">
      
      {/* LEFT: Search Bar with inline categories exactly like Image 1 */}
      <div className="flex-1 max-w-2xl">
        <motion.div
          animate={{ 
            boxShadow: isSearchFocused ? "0 4px 20px rgba(0,0,0,0.05)" : "none",
            borderColor: isSearchFocused ? "#d6d3d1" : "#e7e5e4"
          }}
          className="flex items-center gap-3 w-full bg-white border border-stone-200 rounded-full py-2 px-4 transition-all duration-300"
        >
          <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search patients, files, bills..."
            className="flex-1 bg-transparent border-none text-xs text-stone-800 outline-none font-sans font-medium placeholder-stone-400"
          />
          
          {/* Inline filters exactly like image */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] font-sans font-medium text-stone-400 ml-2 border-l border-stone-100 pl-3">
            <span className="text-stone-300 font-semibold mr-1">In:</span>
            {filters.map((f, i) => (
              <div key={f.id} className="flex items-center">
                <button
                  onClick={() => setSearchFilter(searchFilter === f.id ? 'all' : f.id)}
                  className={`px-1.5 py-0.5 rounded transition-all duration-150 ${
                    searchFilter === f.id 
                      ? 'text-[#B06F4B] font-semibold bg-stone-100' 
                      : 'hover:text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {f.label}
                </button>
                {i < filters.length - 1 && (
                  <span className="text-stone-200 mx-1">|</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* RIGHT: Compact unified black pill with round white-on-black action items */}
      <div className="flex items-center gap-3">
        {/* Active Doctor profile badge */}
        <div className="hidden sm:flex flex-col items-end leading-none mr-2">
          <span className="text-xs font-bold text-stone-800">Dr. {doctorName}</span>
          <span className="text-[9px] text-[#B09C8D] font-medium mt-0.5">{doctorSpecialty}</span>
        </div>

        {/* Triple circle black pill from Image 1 */}
        <div className="flex items-center gap-1.5 bg-[#121212] py-1 px-1.5 rounded-full shadow-md">
          {/* User Profile */}
          <button 
            className="w-7 h-7 rounded-full flex items-center justify-center text-white bg-transparent hover:bg-white/10 transition-colors"
            title="User Profile"
          >
            <User className="w-4 h-4 stroke-[2]" />
          </button>
          
          {/* Notifications */}
          <button 
            className="w-7 h-7 rounded-full flex items-center justify-center text-white bg-transparent hover:bg-white/10 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[2]" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-pink-400" />
          </button>

          {/* Settings */}
          <button 
            className="w-7 h-7 rounded-full flex items-center justify-center text-white bg-transparent hover:bg-white/10 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </div>

    </header>
  );
}

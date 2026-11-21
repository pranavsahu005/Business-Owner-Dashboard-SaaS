import React from 'react';
import { useStore } from '../store';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  BarChart3, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  CreditCard, 
  FolderHeart, 
  Settings, 
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Home,
  CalendarDays,
  StickyNote
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

const GENERAL_ITEMS: SidebarItem[] = [
  { id: 'home', label: 'Home & Invoice', icon: Home },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'schedule', label: 'Day Schedule', icon: Calendar },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'statistics', label: 'Statistics & reports', icon: BarChart3 },
  { id: 'education', label: 'Education', icon: BookOpen },
];

const TOOL_ITEMS: SidebarItem[] = [
  { id: 'notes', label: 'Notes & Tasks', icon: StickyNote },
  { id: 'chat', label: 'Chats & calls', icon: MessageSquare },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'documents', label: 'Documents base', icon: FolderHeart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function FloatingSidebar() {
  const { 
    activeTab, 
    setActiveTab, 
    sidebarCollapsed, 
    setSidebarCollapsed, 
    themeMode, 
    themeColor,
    setAuthenticated,
    sidebarHoverExpand
  } = useStore();

  const [isHovered, setIsHovered] = React.useState(false);
  const hoverTimeoutRef = React.useRef<any>(null);

  const handleMouseEnter = () => {
    if (!sidebarHoverExpand) return; // Ignore hover expansion if disabled in settings
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!sidebarHoverExpand) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 500); // 0.5 seconds delay before auto collapse as requested
  };

  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const isVisuallyExpanded = !sidebarCollapsed || (sidebarHoverExpand && isHovered);

  const getAccentColor = () => {
    switch(themeColor) {
      case 'teal': return 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]';
      case 'purple': return 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]';
      case 'amber': return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]';
      case 'blue': return 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]';
      case 'rose': return 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]';
      default: return 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]';
    }
  };

  const getSidebarBg = () => {
    if (themeMode === 'galaxy') {
      return 'bg-gradient-to-b from-[#0B0A1C] via-[#110E30] to-[#070514] border-indigo-950/80 shadow-[0_0_35px_rgba(99,102,241,0.18)]';
    }
    if (themeMode === 'dark') {
      return 'bg-[#18181B] border-[#27272A] shadow-2xl';
    }
    return 'bg-[#121212] border-neutral-800 shadow-2xl'; // Default elegant dark
  };

  const renderItem = (item: SidebarItem) => {
    const isActive = activeTab === item.id;
    const Icon = item.icon;

    return (
      <button
        key={item.id}
        id={`sidebar-item-${item.id}`}
        onClick={() => setActiveTab(item.id)}
        className={`relative w-full flex items-center ${
          isVisuallyExpanded ? 'gap-3 px-4 py-2.5' : 'justify-center py-3 px-0'
        } rounded-xl transition-all duration-200 text-left group focus:outline-none`}
        style={{ WebkitTapHighlightColor: 'transparent' }}
        title={!isVisuallyExpanded ? item.label : undefined}
      >
        {/* Active Pill Indicator */}
        {isActive && (
          <motion.div
            layoutId="activeSidebarPill"
            className="absolute inset-0 bg-white/10 rounded-xl"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
        
        {/* Icon & Label */}
        <div className={`relative flex items-center ${!isVisuallyExpanded ? 'justify-center' : 'gap-3'} z-10`}>
          <Icon className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-white' : 'text-stone-400 group-hover:text-stone-200'}`} />
          {isVisuallyExpanded && (
            <span className={`text-[13px] font-sans font-medium tracking-wide transition-colors duration-200 ${isActive ? 'text-white' : 'text-stone-400 group-hover:text-stone-200'}`}>
              {item.label}
            </span>
          )}
        </div>

        {/* Small active dot on right */}
        {isActive && isVisuallyExpanded && (
          <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${getAccentColor()}`} />
        )}
        {isActive && !isVisuallyExpanded && (
          <div className={`absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${getAccentColor()}`} />
        )}
      </button>
    );
  };

  return (
    <aside 
      id="intelly-sidebar"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed left-6 top-6 bottom-6 transition-all duration-300 ${
        isVisuallyExpanded ? 'w-60 p-5' : 'w-20 p-3'
      } ${getSidebarBg()} text-white rounded-[24px] flex flex-col justify-between z-40 border`}
    >
      <div>
        {/* Brand Logo with toggle button */}
        <div className={`flex items-center justify-between px-3 py-2 mb-8 ${!isVisuallyExpanded ? 'flex-col gap-3 justify-center' : ''}`}>
          <div className="flex items-center gap-1.5">
            {isVisuallyExpanded ? (
              <span className="font-sans font-semibold tracking-wide text-lg text-white">intelly</span>
            ) : (
              <span className="font-sans font-semibold tracking-wide text-lg text-[#EA80FC]">i</span>
            )}
            <span className="w-2 h-2 rounded-full bg-[#EA80FC] animate-pulse mt-1" />
          </div>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-stone-300 hover:text-white transition-colors focus:outline-none flex items-center justify-center"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* General Section */}
        <div className="mb-6">
          {isVisuallyExpanded ? (
            <p className="px-4 text-[10px] font-bold tracking-widest text-stone-500 uppercase mb-2">
              General
            </p>
          ) : (
            <div className="border-t border-neutral-800/80 my-2 mx-1" />
          )}
          <div className="space-y-0.5">
            {GENERAL_ITEMS.map(renderItem)}
          </div>
        </div>

        {/* Tools Section */}
        <div>
          {isVisuallyExpanded ? (
            <p className="px-4 text-[10px] font-bold tracking-widest text-stone-500 uppercase mb-2">
              Tools
            </p>
          ) : (
            <div className="border-t border-neutral-800/80 my-2 mx-1" />
          )}
          <div className="space-y-0.5">
            {TOOL_ITEMS.map(renderItem)}
          </div>
        </div>
      </div>

      {/* Footer Area with Log Out */}
      <div className="border-t border-neutral-800 pt-4">
        <button
          onClick={() => {
            if (confirm("Sign out of Dr. Olivia's secure clinical session?")) {
              setAuthenticated(false);
            }
          }}
          className={`w-full flex items-center ${
            !isVisuallyExpanded ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-2.5'
          } text-stone-400 hover:text-rose-400 rounded-xl transition-all duration-200 text-left group`}
          title={!isVisuallyExpanded ? "Log out" : undefined}
        >
          <LogOut className="w-4 h-4 text-stone-400 group-hover:text-rose-400 transition-colors" />
          {isVisuallyExpanded && (
            <span className="text-[13px] font-sans font-medium tracking-wide">
              Log out
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}

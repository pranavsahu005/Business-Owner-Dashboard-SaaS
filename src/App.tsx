/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import OrbsBackground from './components/OrbsBackground';
import FloatingSidebar from './components/FloatingSidebar';
import TopNavigation from './components/TopNavigation';
import MainDashboard from './components/MainDashboard';
import LoginScreen from './components/LoginScreen';
import { useStore } from './store';

export default function App() {
  const { activeTab, sidebarCollapsed, themeMode, isAuthenticated } = useStore();

  const isDarkTheme = themeMode === 'dark' || themeMode === 'galaxy';

  return (
    <div className={`relative min-h-screen flex transition-colors duration-500 font-sans antialiased ${
      isDarkTheme ? 'text-stone-100 selection:bg-indigo-500/20 selection:text-indigo-200' : 'text-stone-800 selection:bg-[#B06F4B]/10 selection:text-[#B06F4B]'
    }`}>
      {/* Luxury Canvas Background with Ambient Orbs and Particles */}
      <OrbsBackground />

      {/* Login Lock Screen overlay */}
      {!isAuthenticated && <LoginScreen />}

      {/* Floating Left Sidebar (Fixed Positioning) */}
      <FloatingSidebar />

      {/* Primary Workspace Window (Shifted to the right of the sidebar) */}
      <div 
        className={`flex-1 flex flex-col min-h-screen pr-8 py-8 transition-all duration-300 ${
          sidebarCollapsed ? 'pl-28' : 'pl-72'
        }`}
      >
        {/* Premium Top Navigation Row */}
        <TopNavigation />

        {/* Dynamic Business Dashboard Views */}
        <MainDashboard />
      </div>
    </div>
  );
}

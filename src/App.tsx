/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import Lenis from 'lenis';
import OrbsBackground from './components/OrbsBackground';
import FloatingSidebar from './components/FloatingSidebar';
import TopNavigation from './components/TopNavigation';
import MainDashboard from './components/MainDashboard';
import LoginScreen from './components/LoginScreen';
import QuickToolsDrawer from './components/QuickToolsDrawer';
import ToastBanner from './components/ToastBanner';
import { useStore } from './store';

export default function App() {
  const { sidebarCollapsed, themeMode, isAuthenticated } = useStore();

  const isDarkTheme = themeMode === 'dark' || themeMode === 'galaxy';

  // Sync Tailwind v4 .dark class on <html> root for consistent dual-theme styling
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkTheme) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkTheme]);

  // Smooth inertial scrolling via Lenis (respects prefers-reduced-motion)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 0.95,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div
      className={`relative min-h-screen flex transition-colors duration-300 font-sans antialiased ${
        isDarkTheme
          ? 'text-[#F3EFEA] selection:bg-[#8FB5A3]/25 selection:text-white'
          : 'text-[#221F1D] selection:bg-[#C87D55]/15 selection:text-[#8E4F2F]'
      }`}
    >
      {/* Warm Pastel Editorial Canvas Backdrop */}
      <OrbsBackground />

      {/* Login Lock Screen overlay */}
      {!isAuthenticated && <LoginScreen />}

      {/* Floating Left Sidebar (Preserved untouched) */}
      <FloatingSidebar />

      {/* Primary Workspace Window */}
      <div
        className={`flex-1 flex flex-col min-h-screen pr-5 md:pr-8 py-6 md:py-7 transition-all duration-300 ${
          sidebarCollapsed ? 'pl-28' : 'pl-72'
        }`}
      >
        {/* Top Navigation Row */}
        <TopNavigation />

        {/* Dynamic Dashboard Views */}
        <MainDashboard />
      </div>

      {/* Global Slide-over Workspace Companion (Notes / Tasks / Calendar) */}
      <QuickToolsDrawer />

      {/* Global Toast Feedback Banner */}
      <ToastBanner />
    </div>
  );
}

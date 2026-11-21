# Changelog

All notable changes to **Intelly Clinical Suite** are documented in this file.

---

## [1.4.0] - 2026-07-15

### Added
- **D3.js Monthly Revenue Trend Chart (`D3RevenueChart.tsx`)**: Interactive D3.js v7 Catmull-Rom spline line and area visualization with Revenue / Net Margin / Patient Visits switcher, dashed forward forecast segment, `ResizeObserver` responsiveness, animated stroke reveal, and pointer crosshair tooltip synced to `DateRangePicker`.
- **Warm Pastel Editorial Infographics (`ClinicalInfographics.tsx`)**: Added Practice Utilization & Billing Split striped bar, D3 segmented Channel Mix Donut (`d3.pie` + `d3.arc`), D3 semi-circle Collection Target Gauge with live needle, and interactive Consultation Session Timer (`Start`, `Pause`, `Reset`).
- **One-Click Light / Dark Mode Switch**: Added direct Sun/Moon toggle in `TopNavigation` synchronized with `<html class="dark">` and Tailwind v4 `@custom-variant dark`.
- **Lenis Smooth Scrolling**: Integrated `lenis` in `App.tsx` with `prefers-reduced-motion` guard and `data-lenis-prevent` support for nested scrollable popovers.
- **GitHub Documentation Suite & 7-Screenshot Showcase**: Added complete `/docs/` micro-documentation (`ARCHITECTURE.md`, `FEATURES.md`, `DATA_MODEL.md`, `API.md`, `DEPLOYMENT.md`), root governance docs (`CONTRIBUTING.md`, `CHANGELOG.md`, `SECURITY.md`), custom vector banner, and 7 preview screenshots in `README.md`.

### Changed
- Refined surface palette across `OrbsBackground.tsx`, `TopNavigation.tsx`, and `MainDashboard.tsx` to a calm warm pastel editorial system (`#F6F2EA` alabaster, `#FFFEFC` ivory, `#171614` obsidian anchor KPI card) while preserving the existing font stack and `FloatingSidebar.tsx`.

---

## [1.3.0] - 2026-07-10

### Added
- **Structured Report Export (`DownloadReportMenu.tsx`, `reportExporter.ts`)**: Added one-click export of active analytical views and filtered date intervals as multi-section PDF documents (`jsPDF` + `jspdf-autotable`) or RFC-4180 UTF-8 BOM CSV files.
- **Dynamic Date Range Picker (`DateRangePicker.tsx`, `analyticsData.ts`)**: Added global TopNavigation interval selector with 5 presets (`7d`, `30d`, `90d`, `YTD`, `All Time & Forecast`) and custom mini-calendar selection driving KPIs, charts, and billing tables.
- **Clinical Productivity Modules**: Added full-month `CalendarWorkspace.tsx`, color-coded `NotesWorkspace.tsx` with priority daily checklist, global `QuickToolsDrawer.tsx` companion drawer, and `ToastBanner.tsx`.

---

## [1.2.0] - 2026-07-04

### Added
- **YouTube-Style Auto-Hover Sidebar Setting**: Added toggle in `Settings` allowing users to choose between manual sidebar collapse and automatic hover expansion with a `0.5s` close debounce.
- **Dark & Galaxy Night Themes**: Added Dark and Galaxy theme modes alongside 5 selectable accent color palettes and a functional clinical lock/sign-out flow (`LoginScreen.tsx`).

---

## [1.1.0] - 2026-06-28

### Added
- **Business Owner & Invoice Center (`Home & Invoice`)**: Added corporate invoice generator with itemized line items, automatic totals, receipt preview modal, status management, and administrative overview hub.
- **Full Clinical Workspace Suite**: Replaced legacy placeholders with icon-driven (`lucide-react`) workspaces for `Patients`, `Schedule`, `Statistics & reports`, `Education`, `Chats & calls`, `Billing`, `Documents base`, and `Settings`.
- **Express + Gemini Backend (`server.ts`)**: Added `/api/health`, `/api/ai/insights`, and `/api/ai/chat` server-side routes with deterministic offline fallbacks.

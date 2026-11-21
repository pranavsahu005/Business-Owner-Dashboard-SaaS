<div align="center">

<img src="./docs/assets/banner.svg" alt="Intelly Clinical Suite Banner" width="100%" />

<br />

<p>
  <strong>An editorial-grade clinical operations, executive invoicing, analytics, forecasting, and practice productivity platform built with React 19, TypeScript, Tailwind CSS v4, Express, and the Google Gemini SDK.</strong>
</p>

<p>
  <img src="https://img.shields.io/badge/React-19.0-149ECA?style=flat-square&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5.8" />
  <img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Zustand-5.0-443E38?style=flat-square" alt="Zustand" />
  <img src="https://img.shields.io/badge/Recharts-3.9-22B5BF?style=flat-square" alt="Recharts" />
  <img src="https://img.shields.io/badge/Express-4.21-121212?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Export-PDF_%26_CSV-B06F4B?style=flat-square" alt="PDF and CSV Export" />
</p>

<p>
  <a href="#preview">Preview</a> •
  <a href="#core-capabilities">Capabilities</a> •
  <a href="#system-architecture">Architecture</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#documentation-hub">Documentation Hub</a> •
  <a href="#project-structure">Project Structure</a>
</p>

</div>

---

## Preview

<div align="center">
  <img src="./public/assets/aistudio/Business-Owner-Dashboard-Google-AI-Studio_a634bf5c.png" alt="Intelly Business Owner and Invoice Center Dashboard Preview" width="100%" />
  <p><em>Business Owner &amp; Invoice Center — warm editorial surface, floating collapsible navigation, live KPI metrics, and invoice register.</em></p>
</div>

---

## Overview

**Intelly Clinical Suite** unifies financial operations, patient billing, forward revenue forecasting, scheduling, clinical note-taking, medical education tracking, and AI-assisted advisory inside a single responsive workspace. Designed around restrained typography (`Playfair Display`, `Inter`, `Space Grotesk`, and `JetBrains Mono` with tabular numerals), the application supports **Light**, **Dark**, and **Galaxy** themes along with customizable accent palettes and an optional YouTube-style auto-hover sidebar.

### Key Highlights

- **Zero-friction executive reporting**: Export the currently active analytical view and selected date range as a multi-section **structured PDF** (powered by `jsPDF` + `jspdf-autotable`) or an Excel-ready **RFC-4180 CSV** file with a single click.
- **Global dynamic date range filtering**: Select quick presets (`Last 7 Days`, `Last 30 Days`, `This Quarter`, `Year to Date`, `All Time & Forecast`) or pick custom start and end dates from an inline mini-calendar inside `TopNavigation` to dynamically recalculate KPIs, charts, and billing ledgers across views.
- **Integrated productivity suite**: Includes a full-month **Clinical Calendar**, an hourly **Day Schedule**, a **Clinical Notes & Daily Checklist** workspace, and a slide-over **Workspace Companion Drawer** accessible from any page.
- **Resilient server-side Gemini integration**: Express API routes proxy requests to `@google/genai` using server-side environment secrets and degrade gracefully to deterministic domain fallbacks when `GEMINI_API_KEY` is not configured locally.

---

## Core Capabilities

| Module | Sidebar Route | Key Functionality |
| :--- | :--- | :--- |
| **Business Owner & Invoice Center** | `Home & Invoice` | Corporate invoice generator, itemized line-item calculator, receipt preview, status filters, Workspace Pulse (forecast sparkline, upcoming calendar, pinned notes), and Download Report menu. |
| **Patients Billing & Analytics** | `Dashboard` | Interval-synced billing donut breakdown, received/requested/non-insurance KPIs, waiting-for-bills dispatch queue, latest settlements, and searchable billing ledger. |
| **Statistics & Forecast** | `Statistics & reports` | `ComposedChart` comparing verified revenue actuals against dashed forward forecast projections, consultation mix `BarChart`, and 4-KPI yield strip filtered by `DateRangePicker`. |
| **Clinical Calendar** | `Calendar` | Full-month interactive calendar grid, category filters (`Clinical`, `Billing`, `Follow-up`, `Personal`), selected-day agenda, completion tracking, and event creation modal. |
| **Day Scheduler** | `Day Schedule` | Hourly clinical timetable with consultation cards, room allocations, participant avatars, and one-click video consultation join states. |
| **Notes & Daily Checklist** | `Notes & Tasks` | Color-toned clinical notes (`Ivory`, `Sage`, `Blush`, `Sky`, `Lavender`), pinning, tags, live search, and a priority task manager with progress bar. |
| **Workspace Companion** | `Top Bar -> Notes` | Slide-over drawer providing quick note capture, task check-offs, and upcoming calendar preview without leaving the active dashboard view. |
| **Patients Ledger** | `Patients` | Searchable patient registry with demographics, blood type, diagnosis, insurance metadata, and new patient intake modal. |
| **Learning Plan** | `Education` | Medical continuing-education (CME) progression tracker with linked learning subjects, completion toggles, and upcoming webinars/tasks. |
| **Clinical AI Assistant** | `Chats & calls` | Conversational advisory interface backed by Express `/api/ai/chat` and `@google/genai` with offline clinical context fallback. |
| **Billing Configuration** | `Billing` | Editable CPT fee schedule (`CPT 99213`–`90834`), insurance coverage ratios, and automated dispatch toggles. |
| **Documents Base** | `Documents base` | Drag-and-drop and click-to-upload clinical templates vault with category filtering (`Consent Forms`, `HIPAA & Compliance`, `Clinical Protocols`). |
| **Display & Session Settings** | `Settings` | Light / Dark / Galaxy theme switcher, 5 accent color palettes, YouTube-style 0.5s hover sidebar toggle, and clinical lock-screen sign-out. |

---

## System Architecture

```mermaid
flowchart TB
    subgraph Client["React 19 + TypeScript SPA (Vite)"]
        UI["App Shell (OrbsBackground, FloatingSidebar, TopNavigation)"]
        DRP["DateRangePicker (Presets + Mini Calendar)"]
        EXP["DownloadReportMenu (jsPDF + CSV Generator)"]
        DRAWER["QuickToolsDrawer & ToastBanner"]
        VIEWS["Workspace Views (Home, Dashboard, Statistics, Calendar, Notes, Patients, Schedule, Education, Billing, Docs, Settings)"]
        STORE["Zustand Clinical Store (src/store.ts)"]
        ANALYTICS["Analytics & Forecast Engine (src/utils/analyticsData.ts)"]
    end

    subgraph Server["Node.js + Express Server (server.ts :3000)"]
        HEALTH["GET /api/health"]
        INSIGHTS["POST /api/ai/insights"]
        CHAT["POST /api/ai/chat"]
        STATIC["Vite Dev Middleware / Production Static dist/"]
    end

    subgraph External["External AI Runtime (Optional)"]
        GEMINI["Google Gemini API (@google/genai)"]
    end

    DRP --> STORE
    UI --> VIEWS
    UI --> DRAWER
    VIEWS <--> STORE
    STORE --> ANALYTICS
    ANALYTICS --> VIEWS
    ANALYTICS --> EXP
    VIEWS -->|"POST /api/ai/chat"| CHAT
    CHAT -->|"Server-side GEMINI_API_KEY"| GEMINI
    INSIGHTS -->|"Server-side GEMINI_API_KEY"| GEMINI
    STATIC --> UI
```

### Dynamic Filtering & Report Export Flow

```mermaid
flowchart LR
    A["User selects interval in TopNavigation DateRangePicker"] --> B["useStore.setDateRange(range)"]
    B --> C["computeFilteredAnalytics(dateRange, patientBills)"]
    C --> D["Recalculate KPIs & Growth Deltas"]
    C --> E["Select Daily (<=45d) or Monthly Series + Forecast Tail"]
    C --> F["Filter Billing Ledger by isoDate"]
    D & E & F --> G["Re-render Home, Dashboard & Statistics Views"]
    G --> H{"Download Report Action"}
    H -->|".PDF"| I["exportAnalyticsPDF() via jsPDF + autoTable"]
    H -->|".CSV"| J["exportAnalyticsCSV() RFC-4180 UTF-8 BOM"]
    I & J --> K["Browser File Download + ToastBanner Confirmation"]
```

---

## Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **UI Framework** | React 19 + TypeScript 5.8 | Strict static typing across domain models, analytics pipelines, and modular workspace components. |
| **Build & Dev Server** | Vite 6 + `tsx` + Express 4 | Unified port `3000` full-stack runtime mounting Vite middleware in dev and serving `dist/` in production. |
| **Styling & Motion** | Tailwind CSS v4 + `motion` | Utility-first themeable surfaces (Light, Dark, Galaxy) with spring-driven layout and drawer transitions. |
| **State Management** | Zustand 5 | Lightweight centralized state without boilerplate for navigation, date intervals, invoices, calendar, notes, and tasks. |
| **Data Visualization** | Recharts 3 | Responsive `ComposedChart`, `AreaChart`, and `BarChart` visualizations for revenue actuals, forecasts, and visit mix. |
| **Document Export** | `jsPDF` + `jspdf-autotable` | Client-side multi-section PDF generation with styled tables and pagination — no popup windows or backend print service required. |
| **AI Integration** | `@google/genai` | Server-side Gemini SDK integration via Express proxy routes so API keys never leak to browser bundles. |
| **Iconography** | `lucide-react` | Consistent stroke-weight functional UI icons across navigation, tables, calendars, and modals. |

---

## Quick Start

### Prerequisites

- **Node.js** `v20+` (LTS recommended)
- **npm** `v10+`

### 1. Clone & Install Dependencies

```bash
git clone <your-repository-url>
cd intelly-clinical-suite
npm install
```

### 2. Configure Environment Variables

Copy the template environment file and optionally supply your Gemini API key:

```bash
cp .env.example .env
```

```env
# Optional: Enables live Gemini responses on /api/ai/chat and /api/ai/insights.
# If omitted, Express serves realistic domain-aware fallback responses.
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Application URL (used for deployment metadata)
APP_URL="http://localhost:3000"
```

### 3. Run in Development

```bash
npm run dev
```

The unified Express + Vite development server starts on **`http://localhost:3000`**.

### 4. Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts `server.ts` via `tsx` with Vite middleware mounted on port `3000`. |
| `npm run lint` | Runs strict TypeScript type-checking (`tsc --noEmit`). |
| `npm run build` | Builds the Vite frontend bundle (`dist/`) and compiles the Express server (`dist/server.cjs`). |
| `npm run start` | Runs the production Node server (`node dist/server.cjs`). |
| `npm run clean` | Removes build artifacts (`dist/`). |

---

## Project Structure

```text
.
├── docs/
│   ├── assets/
│   │   └── banner.svg                # Custom vector repository banner
│   ├── ARCHITECTURE.md               # Deep technical architecture & component graph
│   ├── API.md                        # Express REST endpoint contracts & examples
│   ├── DATA_MODEL.md                 # Domain interfaces, ER diagram & state flows
│   ├── DEPLOYMENT.md                 # Build pipeline, production server & troubleshooting
│   └── FEATURES.md                   # Complete module walkthrough & user journeys
├── public/
│   └── assets/aistudio/
│       └── Business-Owner-Dashboard-Google-AI-Studio_a634bf5c.png
├── src/
│   ├── components/
│   │   ├── CalendarWorkspace.tsx     # Full-month interactive clinical calendar & agenda
│   │   ├── DateRangePicker.tsx       # Dynamic TopNavigation date range & mini-calendar picker
│   │   ├── DownloadReportMenu.tsx    # PDF & CSV structured report export menu
│   │   ├── FloatingSidebar.tsx       # Collapsible & 0.5s hover-expand navigation rail
│   │   ├── LoginScreen.tsx           # Clinical session lock/sign-in overlay
│   │   ├── MainDashboard.tsx         # Core workspace views (Home, Dashboard, Statistics, etc.)
│   │   ├── NotesWorkspace.tsx        # Clinical notes board & priority daily checklist
│   │   ├── OrbsBackground.tsx        # Ambient multi-theme canvas backdrop
│   │   ├── QuickToolsDrawer.tsx      # Global slide-over companion (Notes, Tasks, Calendar)
│   │   ├── ToastBanner.tsx           # Action confirmation toast system
│   │   └── TopNavigation.tsx         # Search bar, date range picker, notifications & profile
│   ├── utils/
│   │   ├── analyticsData.ts          # Date-range filtering & forward revenue forecast engine
│   │   └── reportExporter.ts         # Structured PDF (jsPDF) & CSV file generator
│   ├── App.tsx                       # Root application layout & global drawers
│   ├── index.css                     # Typography imports & Tailwind v4 directives
│   ├── main.tsx                      # React 19 DOM entry point
│   ├── store.ts                      # Centralized Zustand state store & actions
│   └── types.ts                      # Shared TypeScript interfaces
├── server.ts                         # Express backend + Vite middleware + Gemini proxy routes
├── package.json                      # Dependencies & lifecycle scripts
├── metadata.json                     # App manifest metadata
├── CHANGELOG.md                      # Versioned release notes
├── CONTRIBUTING.md                   # Development workflow & coding guidelines
├── SECURITY.md                       # Security model & secret handling guidelines
└── .env.example                      # Safe environment variable template
```

---

## Documentation Hub

Explore the dedicated micro-documentation files for deeper technical reference:

| Document | Audience | Contents |
| :--- | :--- | :--- |
| [**docs/ARCHITECTURE.md**](./docs/ARCHITECTURE.md) | Engineers & Architects | Full-stack topology, Zustand slice map, analytics/forecast algorithm, PDF/CSV pipeline, and theme system. |
| [**docs/FEATURES.md**](./docs/FEATURES.md) | Product & Designers | Detailed breakdown of all 13 workspaces, interaction patterns, sidebar hover rules, and end-to-end user journeys. |
| [**docs/DATA_MODEL.md**](./docs/DATA_MODEL.md) | Engineers | Entity-Relationship Mermaid diagram, TypeScript contracts, date-range calculation schemas, and state transitions. |
| [**docs/API.md**](./docs/API.md) | Backend & Integrators | Express endpoint documentation (`/api/health`, `/api/ai/insights`, `/api/ai/chat`), payloads, and fallback modes. |
| [**docs/DEPLOYMENT.md**](./docs/DEPLOYMENT.md) | DevOps & Maintainers | Production bundling (`vite` + `esbuild`), Cloud Run / Node deployment checklist, env vars, and troubleshooting. |
| [**CONTRIBUTING.md**](./CONTRIBUTING.md) | Contributors | Local workflow, branching conventions, TypeScript/Tailwind standards, and pre-PR verification steps. |
| [**CHANGELOG.md**](./CHANGELOG.md) | All Stakeholders | Chronological record of features, UX refinements, and architectural updates. |
| [**SECURITY.md**](./SECURITY.md) | Security Reviewers | Secret isolation, client-side export privacy, dependency hygiene, and disclosure guidance. |

---

## Verification & Quality Baseline

Before committing changes, run both static verification commands:

```bash
npm run lint   # TypeScript strict check (tsc --noEmit)
npm run build  # Full Vite client build + esbuild server bundle
```

---

## License

Licensed under the **Apache License 2.0**. See license headers across source modules for details.

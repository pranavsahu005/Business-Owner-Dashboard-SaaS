# Data Model & State Contracts

All domain entities and analytical payloads are strictly typed in `src/types.ts` and `src/utils/analyticsData.ts`, and managed through the centralized Zustand store in `src/store.ts`.

---

## 1. Entity-Relationship Overview

```mermaid
erDiagram
    CLINICAL_STORE ||--o{ CORPORATE_INVOICE : manages
    CLINICAL_STORE ||--o{ PATIENT_BILL : tracks
    CLINICAL_STORE ||--o{ PATIENT : registers
    CLINICAL_STORE ||--o{ CALENDAR_EVENT : schedules
    CLINICAL_STORE ||--o{ CLINICAL_NOTE : stores
    CLINICAL_STORE ||--o{ DAILY_TASK : tracks
    CLINICAL_STORE ||--o{ APP_NOTIFICATION : emits
    CLINICAL_STORE ||--|| DATE_RANGE_STATE : filters_by

    CORPORATE_INVOICE ||--|{ INVOICE_LINE_ITEM : contains
    DATE_RANGE_STATE ||--|| FILTERED_ANALYTICS_RESULT : computes
    FILTERED_ANALYTICS_RESULT ||--|{ ANALYTICS_DATA_POINT : yields

    CORPORATE_INVOICE {
        string id
        string invoiceNumber
        string clientName
        string clientEmail
        string issueDate
        string dueDate
        number totalAmount
        string status
    }

    INVOICE_LINE_ITEM {
        string id
        string description
        number quantity
        number unitPrice
    }

    PATIENT_BILL {
        string id
        string type
        string sendDate
        string isoDate
        string patientName
        number amount
        string recipient
        string dueDate
        string status
    }

    PATIENT {
        string id
        string name
        number age
        string gender
        string bloodType
        string diagnosis
        string insurance
        string lastVisit
        string status
    }

    CALENDAR_EVENT {
        string id
        string title
        string date
        string time
        string endTime
        string category
        string location
        boolean completed
    }

    CLINICAL_NOTE {
        string id
        string title
        string content
        string color
        boolean pinned
        string updatedAt
        string[] tags
    }

    DAILY_TASK {
        string id
        string title
        string priority
        boolean completed
        string dueDate
        string category
    }

    DATE_RANGE_STATE {
        string preset
        string startDate
        string endDate
        string label
    }
```

---

## 2. Core TypeScript Interfaces (`src/types.ts`)

### Navigation & Theme Contracts

| Type | Allowed Values | Purpose |
| :--- | :--- | :--- |
| `ActiveView` | `'home' \| 'dashboard' \| 'schedule' \| 'calendar' \| 'notes' \| 'patients' \| 'statistics' \| 'education' \| 'chats' \| 'billing' \| 'documents' \| 'settings'` | Active primary workspace rendered inside `MainDashboard`. |
| `ThemeMode` | `'light' \| 'dark' \| 'galaxy'` | Global visual palette synchronized with `<html class="dark">` and `OrbsBackground`. |
| `AccentTheme` | `'emerald' \| 'indigo' \| 'rose' \| 'amber' \| 'cyan'` | Highlight color system configurable from Settings. |
| `DateRangePreset` | `'7d' \| '30d' \| '90d' \| 'ytd' \| 'all' \| 'custom'` | Preset identifier controlling `DateRangePicker` and interval calculation. |

### Productivity & Notification Contracts

- **`CalendarEvent`**: Anchored by ISO date (`YYYY-MM-DD`), start/end time strings, category (`'clinical' | 'billing' | 'followup' | 'personal'`), optional room/location, notes, and `completed` boolean.
- **`ClinicalNote`**: Supports 5 warm paper tones (`'ivory' | 'sage' | 'blush' | 'sky' | 'lavender'`), `pinned` flag for sorting priority, ISO timestamp (`updatedAt`), and keyword `tags`.
- **`DailyTask`**: Tracks `priority` (`'high' | 'medium' | 'low'`), completion toggle, optional due date, and operational category.
- **`AppNotification`**: Represents unread/read clinical alerts displayed in `TopNavigation` popover with type classification (`'payment' | 'schedule' | 'system' | 'note'`).
- **`ToastItem`**: Ephemeral notification banner (`message`, `tone: 'success' | 'info' | 'warning'`) auto-dismissed after 3.2 seconds.

---

## 3. Analytics & Forecast Contract (`src/utils/analyticsData.ts`)

`computeFilteredAnalytics(dateRange, patientBills)` produces a deterministic `FilteredAnalyticsResult` consumed identically by `D3RevenueChart`, `ClinicalInfographics`, `MainDashboard` KPI cards, and `reportExporter`:

```ts
export interface AnalyticsDataPoint {
  label: string;          // e.g., "May 2026" or "Jul 14"
  isoDate: string;        // Canonical YYYY-MM-DD key
  revenue: number;        // Verified actual revenue ($)
  forecast?: number;      // Forward projection ($)
  profit: number;         // Net margin ($)
  visits: number;         // Completed consultations
  telemedicine: number;   // Telehealth visit count
  inClinic: number;       // In-person visit count
  insurance: number;      // Insurance-billed visit count
  isForecast?: boolean;   // Distinguishes future dashed segment
}

export interface FilteredAnalyticsResult {
  points: AnalyticsDataPoint[];
  filteredBills: PatientBill[];
  kpis: {
    totalRevenue: number;
    projectedRevenue: number;
    netProfit: number;
    profitMarginPct: number;
    totalVisits: number;
    avgRevenuePerVisit: number;
    growthPct: number;
    receivedAmount: number;
    requestedAmount: number;
    nonInsuranceAmount: number;
  };
  granularity: 'daily' | 'monthly';
}
```

### Granularity Switching Rules
- When the selected `dateRange` spans **45 days or fewer**, the engine outputs **daily granularity** points and appends a short-term forecast tail.
- When the span exceeds **45 days** (`This Quarter`, `Year to Date`, `All Time & Forecast`, or multi-month custom ranges), the engine aggregates to **monthly granularity** and appends a multi-month forward forecast series so `D3RevenueChart` and `ComposedChart` remain legible without label collisions.

---

## 4. State Transition Lifecycle

```mermaid
stateDiagram-v2
    state "Invoice Lifecycle" as INV {
        Draft --> Sent: Dispatch to Client
        Draft --> Paid: Mark Paid
        Sent --> Pending: Payment Requested
        Pending --> Paid: Mark Paid
        Sent --> Paid: Direct Settlement
    }

    state "Patient Bill Lifecycle" as BILL {
        WaitingQueue --> Requested: Request Payment
        Requested --> SentClaim: Submit to Payer
        SentClaim --> SettledPaid: Confirm Receipt
        Requested --> SettledPaid: Direct Patient Payment
    }
```

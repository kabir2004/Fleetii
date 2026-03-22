<div align="center">
  <img src="rampx/public/fleetiilogolight.png" alt="Fleetii Logo" width="80" />
  <h1>Fleetii</h1>
  <p><strong>Freight finance & fleet management platform built for modern carriers.</strong></p>
  <p>Manage loads, drivers, invoices, payroll, compliance, and analytics — all in one place.</p>

  <br />

  <!-- Tech Stack Shields -->
  ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

  <br />

  ![Zustand](https://img.shields.io/badge/Zustand-5.0-FF6B2B?style=for-the-badge&logo=react&logoColor=white)
  ![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=for-the-badge&logo=framer&logoColor=white)
  ![Recharts](https://img.shields.io/badge/Recharts-3.8-22B5BF?style=for-the-badge&logo=chartdotjs&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-2.99-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

  <br />

  ![Radix UI](https://img.shields.io/badge/Radix_UI-Latest-161618?style=for-the-badge&logo=radixui&logoColor=white)
  ![React Router](https://img.shields.io/badge/React_Router-6.30-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
  ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.71-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)
  ![Zod](https://img.shields.io/badge/Zod-4.3-274D82?style=for-the-badge&logo=zod&logoColor=white)

  <br /><br />

  ![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)
  ![Version](https://img.shields.io/badge/Version-1.0.0-C8F400?style=for-the-badge)
  ![Status](https://img.shields.io/badge/Status-Production_Ready-2D6A4F?style=for-the-badge)

</div>

---

## Overview

Fleetii is a full-featured SaaS platform designed for freight carriers and fleet operators. It brings together load management, driver oversight, financial operations, compliance tracking, and analytics into a single clean interface — with a design language built for real daily use.

Built with a modern React stack, Fleetii ships with a responsive layout, fluid dark mode, real-time UI updates, and a consistent design system across every page.

---

## Features

### Operations
- **Load Management** — Create, dispatch, and track loads with full status lifecycle (pending → dispatched → in transit → delivered → invoiced)
- **Load Board** — Kanban-style board view and list view with filtering
- **Fleet Management** — Vehicle inventory, maintenance logs, DOT inspection tracking
- **Driver Management** — Driver profiles, CDL tracking, safety scores, YTD earnings

### Finance
- **Spend Overview** — Revenue vs cost area charts with margin trend analysis
- **Invoices** — Full AP/AR management with audit engine that flags overcharges
- **Payments** — Outgoing/incoming payment tracking with ACH, wire, check support
- **Billing** — Customer invoice management with aging and overdue alerts
- **Fuel Cards** — Per-transaction fuel monitoring with anomaly flagging
- **Savings** — AI audit recovery tracker showing overcharge recoveries
- **Payroll** — Employee pay run processing with department breakdowns
- **Cash Flow** — 6-month inflow/outflow analysis with upcoming obligations

### Analytics
- **Analytics Dashboard** — Gross margin trends, revenue vs cost, carrier performance rankings, top lanes
- **Lane Analytics** — Per-lane profitability, volume, and RPM analysis
- **Carrier Ratings** — Scored carrier scorecards with on-time, claims, and trend data
- **Reports** — Exportable financial and operational reports

### Compliance
- **Compliance Dashboard** — Document expiry tracker with urgency tiers
- **Documents** — Centralized compliance document storage and renewal tracking
- **Safety** — Driver safety score rankings, HOS violations, incident tracking

### Platform
- **Dark / Light Mode** — Full system-wide theme toggle with volt green (`#C8F400`) accent
- **Command Palette** — `⌘K` global search across loads, drivers, and invoices
- **Notification Panel** — Real-time alert feed with priority tiers
- **Live Clock** — Second-by-second clock in the topbar
- **Responsive Design** — Adapts cleanly from desktop to tablet to mobile

---

## Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| **Framework** | React 19 | UI rendering with concurrent features |
| **Language** | TypeScript 5.9 | Full type safety across the codebase |
| **Build Tool** | Vite 8 | Lightning-fast dev server and production builds |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS with dark mode via class strategy |
| **Routing** | React Router 6.30 | Client-side routing with nested layouts |
| **State** | Zustand 5.0 | Global UI state (dark mode, sidebar, notifications) |
| **Animation** | Framer Motion 12 | Page transitions, stagger animations, sidebar motion |
| **Charts** | Recharts 3.8 | Wealthsimple-style fluid area/line charts |
| **UI Primitives** | Radix UI | Accessible dropdowns, dialogs, tooltips, checkboxes |
| **Forms** | React Hook Form + Zod | Validated form handling across onboarding and settings |
| **Backend** | Supabase 2.99 | Auth, database, and real-time subscriptions |
| **Data Fetching** | TanStack Query 5 | Server state management and caching |
| **Icons** | Lucide React 0.577 | Consistent icon system throughout the UI |
| **Command Menu** | cmdk | ⌘K command palette |
| **Date Utilities** | date-fns 4 | Date formatting and calculations |

---

## Project Structure

```
rampx/src/
├── components/
│   ├── dashboard/        # Sidebar, Topbar, CommandPalette, NotificationPanel
│   ├── layouts/          # DashboardLayout, AuthLayout, OnboardingLayout
│   ├── shared/           # StatCard, DataTable, StatusBadge, EmptyState
│   └── ui/               # Radix-based primitives (button, dialog, checkbox...)
├── pages/
│   └── dashboard/
│       ├── analytics/    # AnalyticsDashboard, LaneAnalytics, CarrierScorecard, Reports
│       ├── compliance/   # ComplianceDashboard, Documents, Safety
│       ├── drivers/      # DriversListPage, DriverDetailPage, DriverPayPage
│       ├── finance/      # Spend, Invoices, Payments, Billing, Fuel, Savings, Payroll, CashFlow
│       ├── fleet/        # FleetOverview, VehicleDetail, Maintenance
│       ├── loads/        # LoadsListPage, LoadBoardPage, LoadDetailPage
│       ├── settings/     # SettingsLayout, Profile, Company, Team, Integrations
│       └── OverviewPage.tsx
├── stores/
│   ├── uiStore.ts        # Dark mode, sidebar collapse, notification panel, command palette
│   └── authStore.ts      # User session and sign-out
├── lib/
│   ├── mockData.ts       # Seed data for all entities
│   ├── formatters.ts     # Currency, date, initials formatters
│   └── utils.ts          # cn() class merge utility
└── App.tsx               # Route definitions
```

---

## Brand

| Token | Dark Mode | Light Mode |
|---|---|---|
| **Primary Accent** | `#C8F400` (Volt Green) | `#2D6A4F` (Old Growth Green) |
| **Secondary** | `#818cf8` (Indigo 400) | `#818cf8` (Indigo 400) |
| **Background** | `#09090b` (Zinc 950) | `#F9FAFB` (Gray 50) |
| **Surface** | `#18181b` (Zinc 900) | `#FFFFFF` |
| **Border** | `#27272a` (Zinc 800) | `#E5E7EB` (Gray 200) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/fleetii.git
cd fleetii/rampx

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file in the `rampx/` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Build for Production

```bash
npm run build
```

The compiled output lands in `rampx/dist/` and is ready to serve from any static host (Vercel, Netlify, Cloudflare Pages, S3+CloudFront).

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server at `http://localhost:5173` |
| `npm run build` | TypeScript check + Vite production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the codebase |

---

## Design System

All KPI tiles across the platform follow the `StatCard` design language:

- `p-5` card padding
- Label: `text-xs font-medium uppercase tracking-wide` (gray-400 / zinc-500)
- Icon: `h-8 w-8 rounded-lg` box with border (gray-50 / zinc-800 background)
- Value: `text-2xl sm:text-3xl font-bold tracking-tight`
- Subtext: `text-xs mt-1` (gray-400 / zinc-500)
- Grid: `grid-cols-2 md:grid-cols-4 gap-4` — always 4 equal tiles filling full width

Charts use `ResponsiveContainer` from Recharts with `AreaChart` and `linearGradient` fills, styled with JS-side color variables (since Recharts SVG cannot use Tailwind dark: classes). The `useUIStore` hook provides `darkMode` to compute correct stroke and fill colors at runtime.

---

## License

Private — All rights reserved. Fleetii is proprietary software.

---

<div align="center">
  <sub>Built with precision for freight operators who demand better tools.</sub>
</div>

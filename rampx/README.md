<div align="center">

<img src="public/fleetiilogolight.png" alt="Fleetii Logo" width="72" height="72" />

# Fleetii

**The Financial OS for Trucking**

Automated freight audit · Carrier payments · Fleet spend intelligence

<br />

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white&labelColor=20232a)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_DB-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![License](https://img.shields.io/badge/License-Proprietary-gray?style=flat-square)](./LICENSE)

</div>

---

## Overview

Fleetii is a full-stack SaaS platform purpose-built for trucking companies. It unifies freight finance, fleet operations, and AI-powered invoice auditing into a single clean interface — giving operators total visibility over revenue, spend, and compliance from any device.

---

## Features

| Module | Description |
|---|---|
| **Inbox** | Prioritized notifications — overdue invoices, overcharges, compliance alerts |
| **Insights** | Revenue vs spend analytics, lane performance, carrier scorecards |
| **Transactions** | Full payment history and reconciliation |
| **Cards** | Fuel card tracking and per-driver spend |
| **Company** | Fleet overview, driver management, maintenance scheduling |
| **Bill Pay** | Invoice approval workflows and vendor billing |
| **Vendors** | Vendor spend analysis and management |
| **Reimbursements** | Driver reimbursement processing |
| **Accounting** | Cash flow, spend overview, savings audit |
| **AI Audit** | Automated freight invoice auditing — catches overcharges, flags discrepancies |

---

## Tech Stack

```
Frontend       React 19 · TypeScript 5.9 · Vite 8
Styling        Tailwind CSS 3.4 · SF Pro system font · Radix UI primitives
Animation      Framer Motion 12 (drag-to-reorder, spring transitions)
Charts         Recharts 3.8 (area, line, bar — switchable per widget)
State          Zustand 5 (auth, UI preferences)
Data           TanStack Query 5 · React Hook Form 7 · Zod 4
Backend        Supabase (Auth, Postgres, Realtime)
Routing        React Router 6
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- A [Supabase](https://supabase.com) project

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/fleetii.git
cd fleetii

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and anon key to .env.local
```

### Development

```bash
npm run dev
```

App runs at `http://localhost:5173`

### Build

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── dashboard/        # Sidebar, Topbar, layout chrome
│   ├── layouts/          # DashboardLayout, MarketingLayout, AuthLayout
│   ├── shared/           # StatCard, DataTable, StatusBadge, etc.
│   └── ui/               # Radix-based primitives (Button, Dialog, etc.)
├── lib/
│   ├── formatters.ts     # Currency, date, number formatters
│   ├── mockData.ts       # Development data
│   └── utils.ts          # cn() and shared utilities
├── pages/
│   ├── auth/             # Login, Register
│   ├── dashboard/        # All dashboard pages
│   ├── marketing/        # Landing, Pricing, About
│   └── onboarding/       # Onboarding flow
├── stores/
│   ├── authStore.ts      # User session (Zustand)
│   └── uiStore.ts        # Dark mode, sidebar state (Zustand)
└── styles/
    └── globals.css       # Tailwind base + custom CSS
```

---

## Architecture Notes

- **Widget system** — Dashboard widgets (KPI tiles, charts, loads table) are individually configurable with a draft/commit editing pattern. Users can reorder via drag-and-drop, hide/show, and customize each widget's data range, chart type, columns, and display format.
- **Responsive** — Fully mobile-responsive: sidebar converts to a slide-in drawer, grids reflow, and type scales fluidly down to 375px.
- **Dark mode** — System-aware with manual toggle, persisted in Zustand.
- **Type safety** — Strict TypeScript throughout. All widget configs, API responses, and form schemas are fully typed.

---

## Team

| Name | Role |
|---|---|
| **Kabir** | Founder · Product & Engineering |
| **Sarim Siddiqui** | Engineering |
| **Muhad Shahid** | Engineering |

---

<div align="center">

Built with precision for the trucking industry.

&copy; 2026 Fleetii. All rights reserved.

</div>

# 💰 SpendWise

A personal finance tracker built as a modern SPA — no backend, no registration. All data lives in your browser's localStorage.

**[Live Demo → spend-wise-flax.vercel.app](https://spend-wise-flax.vercel.app/)**

![SpendWise](https://img.shields.io/badge/React-18-61dafb?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)

## Features

- **Transactions** — add income and expense entries with categories, dates, and optional notes
- **Budgets** — set monthly spending limits per category with real-time progress bars and alerts
- **Dashboard** — overview with spending-by-category pie chart, 6-month area trend, daily spending bar chart, and top 5 expenses
- **Categories** — manage default and custom categories with emoji icons and color pickers
- **Filters** — filter transactions by type, category, date range, amount range, and free-text search
- **Export / Import** — backup and restore all data as a JSON file
- **Dark mode** — persisted theme preference
- **Responsive** — sidebar layout on desktop, bottom tab bar on mobile

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + Vite | UI framework + build tool |
| TypeScript (strict) | Type safety |
| Tailwind CSS | Styling |
| Zustand + persist | State management + localStorage sync |
| React Hook Form + Zod | Forms and validation |
| Recharts | Charts (Pie, Area, Bar) |
| Framer Motion | Animations |
| React Router v6 | Client-side routing |
| date-fns (pl locale) | Date formatting |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/       # AppShell, Sidebar, Header, MobileNav
│   ├── ui/           # Modal, Toast, ConfirmDialog, ProgressBar, etc.
│   ├── transactions/ # TransactionForm, TransactionList, TransactionItem, Filters
│   ├── dashboard/    # Charts, BalanceCard, SummaryCards, TopExpenses
│   ├── budgets/      # BudgetCard, BudgetList, BudgetForm, BudgetAlert
│   ├── categories/   # CategoryManager, CategoryForm, CategoryIcon
│   └── settings/     # CurrencySelect, ExportImport, ResetData
├── hooks/            # useTransactions, useBudgets, useCategories, useStats, useFilteredTransactions
├── pages/            # DashboardPage, TransactionsPage, BudgetsPage, CategoriesPage, SettingsPage
├── store/            # Zustand stores (transactions, budgets, categories, settings)
├── types/            # TypeScript interfaces
├── schemas/          # Zod validation schemas
└── utils/            # formatCurrency, dateHelpers, calculations, exportImport, cn
```

## Data Model

All amounts are stored as **integers in grosze** (1 PLN = 100 grosze) to avoid floating-point arithmetic issues.

```
Transaction: { id, type, amount (grosze), title, categoryId, date, note, createdAt }
Category:    { id, name, icon (emoji), color (hex), type, isDefault }
Budget:      { id, categoryId, amount (grosze), month (YYYY-MM) }
```

## Deployment

The app is configured for Netlify with SPA routing:

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

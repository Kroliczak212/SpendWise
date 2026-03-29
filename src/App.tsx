import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useSettingsStore } from "@/store/settingsStore";
import { AppShell } from "@/components/layout/AppShell";
import { ToastProvider } from "@/components/ui/Toast";
import DashboardPage from "@/pages/DashboardPage";
import TransactionsPage from "@/pages/TransactionsPage";
import BudgetsPage from "@/pages/BudgetsPage";
import CategoriesPage from "@/pages/CategoriesPage";
import SettingsPage from "@/pages/SettingsPage";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export function App() {
  const initTheme = useSettingsStore((s) => s.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <BrowserRouter>
      <ToastProvider>
        <AppShell>
          <AnimatedRoutes />
        </AppShell>
      </ToastProvider>
    </BrowserRouter>
  );
}

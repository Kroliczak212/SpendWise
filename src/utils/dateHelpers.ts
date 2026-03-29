import {
  format,
  parse,
  addMonths as dateFnsAddMonths,
  subMonths,
  startOfMonth,
  getDaysInMonth as dateFnsGetDaysInMonth,
  parseISO,
} from "date-fns";
import { pl } from "date-fns/locale";
import type { Transaction } from "@/types";

export function getCurrentMonth(): string {
  return format(new Date(), "yyyy-MM");
}

export function formatMonthLabel(month: string): string {
  const date = parse(month, "yyyy-MM", new Date());
  return format(date, "LLLL yyyy", { locale: pl });
}

export function formatDayHeader(dateStr: string): string {
  const date = parseISO(dateStr);
  return format(date, "EEEE, d MMMM yyyy", { locale: pl });
}

export function formatShortDate(dateStr: string): string {
  const date = parseISO(dateStr);
  return format(date, "d MMM", { locale: pl });
}

export function formatShortMonthLabel(month: string): string {
  const date = parse(month, "yyyy-MM", new Date());
  return format(date, "LLL", { locale: pl });
}

export function addMonths(month: string, n: number): string {
  const date = parse(month, "yyyy-MM", new Date());
  const result = n > 0 ? dateFnsAddMonths(date, n) : subMonths(date, Math.abs(n));
  return format(startOfMonth(result), "yyyy-MM");
}

export function getLastNMonths(n: number): string[] {
  const months: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    months.push(addMonths(getCurrentMonth(), -i));
  }
  return months;
}

export function getDaysInMonth(month: string): number {
  const date = parse(month, "yyyy-MM", new Date());
  return dateFnsGetDaysInMonth(date);
}

export function isDateInMonth(date: string, month: string): boolean {
  return date.startsWith(month);
}

export function groupTransactionsByDay(
  transactions: Transaction[]
): Map<string, Transaction[]> {
  const map = new Map<string, Transaction[]>();
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  for (const t of sorted) {
    const day = t.date;
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(t);
  }
  return map;
}

export function getTodayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

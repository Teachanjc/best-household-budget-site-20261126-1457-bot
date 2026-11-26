import { BUDGETS, CATEGORIES, GOALS, INCOME, MONTHS, TRANSACTIONS } from "./data.js";

const KEY = "homeledger-v1";

function clone(v) {
  return JSON.parse(JSON.stringify(v));
}

function loadSaved() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

function save(state) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({
      transactions: state.transactions,
      budgets: state.budgets,
      goals: state.goals
    }));
  } catch (e) {
    return;
  }
}

const saved = loadSaved();

export const state = {
  monthKey: "2026-11",
  transactions: saved && Array.isArray(saved.transactions) ? saved.transactions : clone(TRANSACTIONS),
  budgets: saved && Array.isArray(saved.budgets) ? saved.budgets : clone(BUDGETS),
  goals: saved && Array.isArray(saved.goals) ? saved.goals : clone(GOALS),
  filterCategory: "all",
  filterText: ""
};

export function categoryOf(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, label: id, color: "#9a9a8a" };
}

export function incomeTotal() {
  return INCOME.reduce((sum, row) => sum + row.amount, 0);
}

export function spentTotal() {
  return state.transactions.reduce((sum, t) => sum + t.amount, 0);
}

export function spentByCategory() {
  const map = {};
  CATEGORIES.forEach((c) => { map[c.id] = 0; });
  state.transactions.forEach((t) => {
    if (map[t.category] === undefined) map[t.category] = 0;
    map[t.category] += t.amount;
  });
  return CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    color: c.color,
    value: map[c.id] || 0,
    limit: budgetLimit(c.id)
  })).filter((row) => row.value > 0 || row.limit > 0)
    .sort((a, b) => b.value - a.value);
}

export function budgetLimit(category) {
  const row = state.budgets.find((b) => b.category === category);
  return row ? row.limit : 0;
}

export function budgetTotal() {
  return state.budgets.reduce((sum, b) => sum + b.limit, 0);
}

export function monthRow(key) {
  return MONTHS.find((m) => m.key === key) || MONTHS[MONTHS.length - 1];
}

export function monthSpent(key) {
  if (key === "2026-11") return spentTotal();
  return monthRow(key).spent;
}

export function monthIncome(key) {
  if (key === "2026-11") return incomeTotal();
  return monthRow(key).income;
}

export function filteredTransactions() {
  const q = state.filterText.trim().toLowerCase();
  return state.transactions
    .filter((t) => state.filterCategory === "all" || t.category === state.filterCategory)
    .filter((t) => !q || t.payee.toLowerCase().includes(q) || t.note.toLowerCase().includes(q))
    .slice()
    .sort((a, b) => b.day - a.day || String(b.id).localeCompare(String(a.id)));
}

export function addTransaction(payee, category, amount, note) {
  const id = "u" + Date.now().toString(36);
  state.transactions.push({
    id,
    day: 26,
    payee,
    category,
    amount,
    note: note || "Added by hand"
  });
  save(state);
  return id;
}

export function deleteTransaction(id) {
  const i = state.transactions.findIndex((t) => t.id === id);
  if (i >= 0) {
    state.transactions.splice(i, 1);
    save(state);
    return true;
  }
  return false;
}

export function setBudget(category, limit) {
  const row = state.budgets.find((b) => b.category === category);
  if (row) row.limit = limit;
  else state.budgets.push({ category, limit });
  save(state);
}

export function contribute(goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return false;
  goal.saved = Math.min(goal.target, goal.saved + amount);
  save(state);
  return true;
}

export function addGoal(name, target) {
  const id = "g" + Date.now().toString(36);
  state.goals.push({ id, name, target, saved: 0, note: "Added by hand" });
  save(state);
  return id;
}

export function resetAll() {
  state.transactions = clone(TRANSACTIONS);
  state.budgets = clone(BUDGETS);
  state.goals = clone(GOALS);
  state.filterCategory = "all";
  state.filterText = "";
  try {
    window.localStorage.removeItem(KEY);
  } catch (e) {
    return;
  }
}

import { VIEWS, render503020, renderGoalPlan } from "./views.js";
import {
  state, addTransaction, deleteTransaction, setBudget, contribute,
  addGoal, resetAll, incomeTotal
} from "./state.js";

const viewEl = document.getElementById("view");
const navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));

function route() {
  const hash = window.location.hash || "#/";
  const name = hash.replace(/^#\/?/, "").split("/")[0] || "overview";
  const render = VIEWS[name] || VIEWS.overview;
  viewEl.innerHTML = render();
  navLinks.forEach((a) => {
    const target = a.getAttribute("href").replace(/^#\/?/, "") || "overview";
    if (target === name) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  if (name === "calculator") {
    const out = document.getElementById("calc-result");
    if (out) out.innerHTML = render503020(incomeTotal());
    const goal = document.getElementById("goal-result");
    if (goal) goal.innerHTML = renderGoalPlan(28000, 12600, 2000);
  }
  window.scrollTo(0, 0);
}

function rerender() {
  route();
}

document.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.getAttribute("data-action");
  if (action === "delete-tx") {
    deleteTransaction(btn.getAttribute("data-id"));
    rerender();
  }
  if (action === "contribute") {
    contribute(btn.getAttribute("data-id"), Number(btn.getAttribute("data-amount")));
    rerender();
  }
  if (action === "save-budgets") {
    const inputs = document.querySelectorAll("[data-budget-input]");
    inputs.forEach((input) => {
      const value = Math.max(Math.round(Number(input.value) || 0), 0);
      setBudget(input.getAttribute("data-budget-input"), value);
    });
    const msg = document.getElementById("budget-msg");
    if (msg) msg.textContent = "Budget limits saved.";
    rerender();
  }
  if (action === "reset-data") {
    resetAll();
    rerender();
  }
});

document.addEventListener("submit", (event) => {
  const form = event.target;
  if (form.id === "add-tx") {
    event.preventDefault();
    const payee = form.elements.payee.value.trim();
    const amount = Math.round(Number(form.elements.amount.value));
    const msg = document.getElementById("add-tx-msg");
    if (!payee || !amount || amount <= 0) {
      if (msg) msg.textContent = "Add a payee and an amount above HK$0.";
      return;
    }
    addTransaction(payee, form.elements.category.value, amount, form.elements.note.value.trim());
    rerender();
  }
  if (form.id === "add-goal") {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    const target = Math.round(Number(form.elements.target.value));
    const msg = document.getElementById("add-goal-msg");
    if (!name || !target || target < 100) {
      if (msg) msg.textContent = "Add a goal name and a target of at least HK$100.";
      return;
    }
    addGoal(name, target);
    rerender();
  }
  if (form.id === "calc-503020") {
    event.preventDefault();
    const income = Math.max(Math.round(Number(form.elements.income.value)) || 0, 1000);
    const out = document.getElementById("calc-result");
    if (out) out.innerHTML = render503020(income);
  }
  if (form.id === "calc-goal") {
    event.preventDefault();
    const target = Math.max(Math.round(Number(form.elements.target.value)) || 0, 100);
    const saved = Math.max(Math.round(Number(form.elements.saved.value)) || 0, 0);
    const monthly = Math.max(Math.round(Number(form.elements.monthly.value)) || 0, 50);
    const out = document.getElementById("goal-result");
    if (out) out.innerHTML = renderGoalPlan(target, saved, monthly);
  }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "filter-category") {
    state.filterCategory = event.target.value;
    rerender();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "filter-text") {
    state.filterText = event.target.value;
    const rows = document.querySelectorAll("#view table.tx tbody tr");
    const q = state.filterText.trim().toLowerCase();
    const count = document.querySelector(".filter-row .muted");
    let shown = 0;
    rows.forEach((row) => {
      const hit = !q || row.textContent.toLowerCase().includes(q);
      row.style.display = hit ? "" : "none";
      if (hit) shown += 1;
    });
    if (count) count.textContent = "Showing " + shown + " matching transactions";
  }
});

window.addEventListener("hashchange", route);

route();

import { CATEGORIES, HOUSEHOLD, INCOME, MONTHS, TIPS } from "./data.js";
import { donut, legend, bars } from "./charts.js";
import { money, pct, pct1, monthDay, escapeHtml } from "./format.js";
import {
  state, categoryOf, incomeTotal, spentTotal, spentByCategory,
  budgetTotal, filteredTransactions, monthRow
} from "./state.js";

function statCard(label, value, sub) {
  return '<div class="stat"><p class="stat-label">' + label + '</p>' +
    '<p class="stat-value">' + value + '</p><p class="stat-sub">' + sub + '</p></div>\n';
}

function bar(used, limit) {
  const ratio = limit > 0 ? Math.min(used / limit, 1) : 0;
  const cls = used > limit ? "bar-fill over" : "bar-fill";
  return '<div class="bar-track"><div class="' + cls + '" style="width:' + Math.round(ratio * 100) + '%"></div></div>\n';
}

function txRow(t) {
  const c = categoryOf(t.category);
  return '<tr><td>' + monthDay(t.day) + '</td>' +
    '<td><strong>' + escapeHtml(t.payee) + '</strong><br><span class="muted">' + escapeHtml(t.note) + '</span></td>' +
    '<td><span class="chip" style="--chip:' + c.color + '">' + c.label + '</span></td>' +
    '<td class="num">' + money(t.amount) + '</td>' +
    '<td><button class="link-btn" data-action="delete-tx" data-id="' + t.id + '">Delete</button></td></tr>\n';
}

function goalCard(g) {
  const p = pct(g.saved, g.target);
  return '<article class="goal-card"><div class="goal-head"><h3>' + escapeHtml(g.name) + '</h3>' +
    '<span class="goal-pct">' + p + '%</span></div>' +
    '<p class="muted">' + escapeHtml(g.note) + '</p>' + bar(g.saved, g.target) +
    '<p class="goal-nums"><strong>' + money(g.saved) + '</strong> saved of ' + money(g.target) +
    ' &middot; ' + money(Math.max(g.target - g.saved, 0)) + ' to go</p>' +
    '<div class="goal-actions"><button data-action="contribute" data-id="' + g.id + '" data-amount="500">+ HK$500</button>' +
    '<button data-action="contribute" data-id="' + g.id + '" data-amount="1000">+ HK$1,000</button>' +
    '<button data-action="contribute" data-id="' + g.id + '" data-amount="5000">+ HK$5,000</button></div></article>\n';
}

export function renderOverview() {
  const income = incomeTotal();
  const spent = spentTotal();
  const saved = income - spent;
  const rate = pct1(saved, income);
  const cats = spentByCategory();
  const over = cats.filter((c) => c.value > c.limit && c.limit > 0);
  const recent = state.transactions.slice().sort((a, b) => b.day - a.day).slice(0, 6);
  const topGoals = state.goals.slice(0, 2);
  return '<section class="page-head"><div><p class="eyebrow">' + HOUSEHOLD.name + ' &middot; ' + HOUSEHOLD.members + ' &middot; ' + HOUSEHOLD.home + '</p>' +
    '<h1>November 2026 at a glance</h1>' +
    '<p class="lede">Income, spending and savings for the month, with every dollar accounted for.</p></div>' +
    '<a class="btn" href="#/transactions">Add a transaction</a></section>\n' +
    '<section class="stats">' +
    statCard("Income", money(income), INCOME.length + " sources this month") +
    statCard("Spending", money(spent), state.transactions.length + " transactions") +
    statCard("Saved", money(saved), "Savings rate " + rate + "%") +
    statCard("Budget left", money(Math.max(budgetTotal() - spent, 0)), "of " + money(budgetTotal()) + " budgeted") +
    '</section>\n' +
    '<section class="grid-2"><article class="card"><h2>Where the money went</h2>' +
    '<div class="donut-wrap">' + donut(cats, spent, money(spent), "spent in November") +
    '<ul class="legend">' + legend(cats, spent) + '</ul></div></article>\n' +
    '<article class="card"><h2>Budget health</h2>' +
    '<p class="big">' + over.length + ' categor' + (over.length === 1 ? "y" : "ies") + ' over budget</p>' +
    '<p>' + (over.length ? over.map((c) => c.label + " is " + money(c.value - c.limit) + " over its " + money(c.limit) + " budget").join("; ") + "." : "Every category is inside its budget this month.") + '</p>' +
    '<p>Housing takes the biggest share at ' + pct1(cats[0].value, spent) + '% of spending, followed by food at ' +
    pct1(cats[1].value, spent) + '%. Fixed costs (housing, insurance, utilities) come to ' +
    money(12000 + 1950 + 1240) + ', just under half of all spending.</p>' +
    '<p><a href="#/budget">See the full budget &rarr;</a></p></article></section>\n' +
    '<section class="grid-2"><article class="card"><h2>Latest spending</h2>' +
    '<table class="tx"><tbody>' + recent.map(txRow).join("") + '</tbody></table>' +
    '<p><a href="#/transactions">See all ' + state.transactions.length + ' transactions &rarr;</a></p></article>\n' +
    '<article class="card"><h2>Savings goals</h2>' + topGoals.map(goalCard).join("") +
    '<p><a href="#/goals">See all ' + state.goals.length + ' goals &rarr;</a></p></article></section>\n' +
    '<section><h2>Three things worth knowing</h2><div class="tips">' +
    TIPS.map((t) => '<article class="tip"><h3>' + t.title + '</h3><p>' + t.body + '</p></article>\n').join("") +
    '</div></section>\n';
}

export function renderTransactions() {
  const rows = filteredTransactions();
  const total = rows.reduce((s, t) => s + t.amount, 0);
  const options = ['<option value="all">All categories</option>'].concat(
    CATEGORIES.map((c) => '<option value="' + c.id + '"' + (state.filterCategory === c.id ? " selected" : "") + '>' + c.label + '</option>')
  ).join("");
  return '<section class="page-head"><div><p class="eyebrow">November 2026</p><h1>Transactions</h1>' +
    '<p class="lede">Every dollar in and out, searchable and filterable. Add your own below.</p></div></section>\n' +
    '<section class="card"><form id="add-tx" class="form-grid">' +
    '<label>Payee<input name="payee" type="text" placeholder="e.g. ParknShop — groceries" required></label>' +
    '<label>Category<select name="category">' + CATEGORIES.map((c) => '<option value="' + c.id + '">' + c.label + '</option>').join("") + '</select></label>' +
    '<label>Amount (HK$)<input name="amount" type="number" min="1" step="1" placeholder="500" required></label>' +
    '<label>Note<input name="note" type="text" placeholder="What was it for?"></label>' +
    '<button class="btn" type="submit">Add transaction</button>' +
    '<p class="form-msg" id="add-tx-msg" role="status"></p></form></section>\n' +
    '<section class="card"><div class="filter-row">' +
    '<label>Category <select id="filter-category">' + options + '</select></label>' +
    '<label>Search <input id="filter-text" type="search" placeholder="Search payee or note" value="' + escapeHtml(state.filterText) + '"></label>' +
    '<span class="muted">Showing ' + rows.length + ' of ' + state.transactions.length + ' transactions &middot; ' + money(total) + '</span></div>' +
    '<table class="tx"><thead><tr><th>Date</th><th>Payee</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>' +
    '<tbody>' + (rows.length ? rows.map(txRow).join("") : '<tr><td colspan="5">No transactions match. Try clearing the search or filter.</td></tr>') + '</tbody></table>' +
    '<p><button class="link-btn" data-action="reset-data">Reset demo data</button></p></section>\n';
}

export function renderBudget() {
  const spent = spentTotal();
  const total = budgetTotal();
  const cats = spentByCategory();
  const rows = cats.map((c) => {
    const diff = c.limit - c.value;
    const status = diff >= 0 ? money(diff) + " left" : money(-diff) + " over";
    return '<div class="budget-row"><div class="budget-info"><span class="swatch" style="background:' + c.color + '"></span>' +
      '<strong>' + c.label + '</strong><span class="muted">' + money(c.value) + ' of ' + money(c.limit) + ' &middot; ' + status + '</span></div>' +
      bar(c.value, c.limit) +
      '<label class="budget-edit">Monthly limit HK$ <input type="number" min="0" step="50" value="' + c.limit + '" data-budget-input="' + c.id + '"></label></div>\n';
  }).join("");
  return '<section class="page-head"><div><p class="eyebrow">November 2026</p><h1>Monthly budget</h1>' +
    '<p class="lede">A limit for every category. Change a limit and save — the bars and the overview update at once.</p></div></section>\n' +
    '<section class="stats">' +
    statCard("Total budget", money(total), "Across " + state.budgets.length + " categories") +
    statCard("Spent so far", money(spent), pct(spent, total) + "% of the budget used") +
    statCard("Remaining", money(Math.max(total - spent, 0)), total - spent >= 0 ? "Inside the budget" : "Over the budget") +
    '</section>\n' +
    '<section class="card"><div class="budget-list">' + rows + '</div>' +
    '<div class="row-end"><button class="btn" data-action="save-budgets">Save budget limits</button>' +
    '<p class="form-msg" id="budget-msg" role="status"></p></div></section>\n';
}

export function renderGoals() {
  const saved = state.goals.reduce((s, g) => s + g.saved, 0);
  const target = state.goals.reduce((s, g) => s + g.target, 0);
  return '<section class="page-head"><div><p class="eyebrow">Saving with a purpose</p><h1>Savings goals</h1>' +
    '<p class="lede">Four goals, one household. Add money to a goal and watch the bar move.</p></div></section>\n' +
    '<section class="stats">' +
    statCard("Saved across goals", money(saved), pct(saved, target) + "% of all targets") +
    statCard("All targets", money(target), state.goals.length + " goals") +
    statCard("Still to save", money(target - saved), "At HK$2,000 a month: " + Math.ceil((target - saved) / 2000) + " months") +
    '</section>\n' +
    '<section class="goals-grid">' + state.goals.map(goalCard).join("") + '</section>\n' +
    '<section class="card"><h2>Add a goal</h2><form id="add-goal" class="form-grid">' +
    '<label>Goal name<input name="name" type="text" placeholder="e.g. New washing machine" required></label>' +
    '<label>Target (HK$)<input name="target" type="number" min="100" step="100" placeholder="8000" required></label>' +
    '<button class="btn" type="submit">Add goal</button>' +
    '<p class="form-msg" id="add-goal-msg" role="status"></p></form></section>\n';
}

export function renderReports() {
  const rows = MONTHS.map((m) => ({
    short: m.label.slice(0, 3),
    income: m.key === "2026-11" ? incomeTotal() : m.income,
    spent: m.key === "2026-11" ? spentTotal() : m.spent
  }));
  const maxValue = Math.max.apply(null, rows.map((r) => Math.max(r.income, r.spent)));
  const best = rows.reduce((a, b) => (a.income - a.spent > b.income - b.spent ? a : b));  const worst = rows.reduce((a, b) => (a.income - a.spent < b.income - b.spent ? a : b));
  const tableRows = rows.map((r) => {
    const m = monthRow(MONTHS.find((x) => x.label.slice(0, 3) === r.short).key);
    return '<tr><td>' + m.label + '</td><td class="num">' + money(r.income) + '</td><td class="num">' +
      money(r.spent) + '</td><td class="num">' + money(r.income - r.spent) + '</td><td class="num">' +
      pct1(r.income - r.spent, r.income) + '%</td></tr>\n';
  }).join("");
  return '<section class="page-head"><div><p class="eyebrow">June – November 2026</p><h1>Reports</h1>' +
    '<p class="lede">Six months of income against spending. Bars show spending; the darker bar is income.</p></div></section>\n' +
    '<section class="card"><h2>Income vs spending</h2>' + bars(rows, maxValue) +
    '<p class="chart-key"><span class="key-income">Income</span><span class="key-spent">Spending</span></p></section>\n' +
    '<section class="grid-2"><article class="card"><h2>Best month</h2><p class="big">' + best.short + ' 2026</p>' +
    '<p>Saved ' + money(best.income - best.spent) + ' — a ' + pct1(best.income - best.spent, best.income) + '% savings rate, the highest of the six months.</p></article>' +
    '<article class="card"><h2>Tightest month</h2><p class="big">' + worst.short + ' 2026</p>' +
    '<p>Saved ' + money(worst.income - worst.spent) + ' — a ' + pct1(worst.income - worst.spent, worst.income) + '% savings rate, the lowest of the six months.</p></article></section>\n' +
    '<section class="card"><h2>Month by month</h2><table class="tx"><thead><tr><th>Month</th><th class="num">Income</th><th class="num">Spent</th><th class="num">Saved</th><th class="num">Rate</th></tr></thead>' +
    '<tbody>' + tableRows + '</tbody></table></section>\n' +
    '<section><h2>Three things worth knowing</h2><div class="tips">' +
    TIPS.map((t) => '<article class="tip"><h3>' + t.title + '</h3><p>' + t.body + '</p></article>\n').join("") +
    '</div></section>\n';
}

export function renderCalculator() {
  return '<section class="page-head"><div><p class="eyebrow">Plan before you spend</p><h1>Budget calculator</h1>' +
    '<p class="lede">The 50/30/20 rule on your income, next to what this household actually spent — and a planner for any savings goal.</p></div></section>\n' +
    '<section class="card"><h2>The 50/30/20 rule</h2>' +
    '<form id="calc-503020" class="form-grid"><label>Monthly income (HK$)<input name="income" type="number" min="1000" step="100" value="' + incomeTotal() + '"></label>' +
    '<button class="btn" type="submit">Calculate</button></form>' +
    '<div id="calc-result"></div></section>\n' +
    '<section class="card"><h2>How long until I reach my goal?</h2>' +
    '<form id="calc-goal" class="form-grid"><label>Goal amount (HK$)<input name="target" type="number" min="100" step="100" value="28000"></label>' +
    '<label>Already saved (HK$)<input name="saved" type="number" min="0" step="100" value="12600"></label>' +
    '<label>Monthly contribution (HK$)<input name="monthly" type="number" min="50" step="50" value="2000"></label>' +
    '<button class="btn" type="submit">Work it out</button></form>' +
    '<div id="goal-result"></div></section>\n';
}

export function render503020(income) {
  const needs = Math.round(income * 0.5);
  const wants = Math.round(income * 0.3);
  const save = income - needs - wants;
  const byCat = {};
  spentByCategory().forEach((c) => { byCat[c.id] = c.value; });
  const needIds = ["housing", "food", "transport", "utilities", "health", "insurance"];
  const wantIds = ["dining", "entertainment", "shopping"];
  const actualNeeds = needIds.reduce((s, id) => s + (byCat[id] || 0), 0);
  const actualWants = wantIds.reduce((s, id) => s + (byCat[id] || 0), 0);
  const actualSave = incomeTotal() - spentTotal();
  function line(label, rule, actual) {
    return '<tr><td>' + label + '</td><td class="num">' + money(rule) + '</td><td class="num">' + money(actual) +
      '</td><td class="num">' + (actual - rule >= 0 ? "+" : "") + money(actual - rule) + '</td></tr>\n';
  }
  return '<table class="tx"><thead><tr><th></th><th class="num">50/30/20 rule</th><th class="num">November actual</th><th class="num">Difference</th></tr></thead><tbody>' +
    line("Needs (50%)", needs, actualNeeds) +
    line("Wants (30%)", wants, actualWants) +
    line("Savings (20%)", save, actualSave) +
    '</tbody></table><p>This household spends more on needs than the rule allows (' + pct1(actualNeeds, incomeTotal()) +
    '% of income, mostly the HK$12,000 rent) and less on wants — so the savings rate lands at ' +
    pct1(actualSave, incomeTotal()) + '%, well above the rule&rsquo;s 20%.</p>\n';
}

export function renderGoalPlan(target, saved, monthly) {
  const remaining = Math.max(target - saved, 0);
  if (remaining === 0) return '<p class="big">Goal reached.</p><p>You have already saved ' + money(saved) + ' against a ' + money(target) + ' goal.</p>\n';
  const months = Math.ceil(remaining / monthly);
  const finish = new Date(2026, 10 + months, 1);
  const names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return '<p class="big">' + months + ' month' + (months === 1 ? "" : "s") + ' to go</p>' +
    '<p>Saving ' + money(monthly) + ' a month, the remaining ' + money(remaining) + ' is covered by ' +
    names[finish.getMonth()] + ' ' + finish.getFullYear() + '. That is ' + money(monthly * months) +
    ' in contributions, ' + money(monthly * months - remaining) + ' more than the goal needs.</p>\n';
}

export const VIEWS = {
  overview: renderOverview,
  transactions: renderTransactions,
  budget: renderBudget,
  goals: renderGoals,
  reports: renderReports,
  calculator: renderCalculator
};

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Teachanjc/best-household-budget-site-20261126-1457-bot/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Teachanjc/best-household-budget-site-20261126-1457-bot/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

# best-household-budget-site-20261126-1457-bot

HomeLedger is a household budget site for one Hong Kong family: November 2026 income, spending by category, monthly budgets, savings goals, six-month reports and a 50/30/20 calculator, all working in the browser with real figures and no network requests.

## Run it

```sh
cd app && python3 -m http.server 8080
```

Then open http://localhost:8080/ in a desktop or phone browser. Every page is reached from the top navigation: Overview, Transactions, Budget, Goals, Reports and Calculator. Adding a transaction, changing a budget limit, contributing to a goal or adding a goal updates the figures everywhere at once, and changes are kept in the browser only.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with `buildDossier` from `vendor/makefun-frontend.ts`.

---

<sub>Entered on [make.fun](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>

export const HOUSEHOLD = {
  name: "Chan Household",
  members: "2 adults, 1 child",
  home: "Sha Tin, Hong Kong",
  currency: "HKD",
  month: "November 2026"
};

export const CATEGORIES = [
  { id: "housing", label: "Housing", color: "#1f5c46" },
  { id: "food", label: "Food & Groceries", color: "#2e8b6a" },
  { id: "dining", label: "Dining Out", color: "#e8a33d" },
  { id: "transport", label: "Transport", color: "#4a90b8" },
  { id: "utilities", label: "Utilities", color: "#7a6fc0" },
  { id: "health", label: "Health", color: "#c05a7a" },
  { id: "education", label: "Education", color: "#3f7d5a" },
  { id: "entertainment", label: "Entertainment", color: "#b07d3c" },
  { id: "shopping", label: "Shopping", color: "#8a6d4b" },
  { id: "insurance", label: "Insurance", color: "#5b7a8c" },
  { id: "other", label: "Other", color: "#9a9a8a" }
];

export const INCOME = [
  { id: "inc1", source: "Salary — M. Chan", amount: 38500, day: 1 },
  { id: "inc2", source: "Freelance design — K. Chan", amount: 4600, day: 12 },
  { id: "inc3", source: "Dividends & interest", amount: 1150, day: 20 }
];

export const BUDGETS = [
  { category: "housing", limit: 12000 },
  { category: "food", limit: 7000 },
  { category: "dining", limit: 2000 },
  { category: "transport", limit: 1800 },
  { category: "utilities", limit: 1500 },
  { category: "health", limit: 1200 },
  { category: "education", limit: 2000 },
  { category: "entertainment", limit: 1500 },
  { category: "shopping", limit: 2500 },
  { category: "insurance", limit: 1950 },
  { category: "other", limit: 800 }
];

export const TRANSACTIONS = [
  { id: "t01", day: 1, payee: "Sun Hung Kai Properties — rent", category: "housing", amount: 12000, note: "Monthly rent, 2-bed flat" },
  { id: "t02", day: 2, payee: "ParknShop — weekly groceries", category: "food", amount: 862, note: "Rice, vegetables, fruit, milk" },
  { id: "t03", day: 3, payee: "MTR Octopus top-up", category: "transport", amount: 500, note: "Monthly travel card" },
  { id: "t04", day: 4, payee: "CLP Power — electricity", category: "utilities", amount: 486, note: "October bill" },
  { id: "t05", day: 5, payee: "Wellcome — weekly groceries", category: "food", amount: 743, note: "Meat, eggs, snacks" },
  { id: "t06", day: 6, payee: "Café de Coral — family dinner", category: "dining", amount: 238, note: "Friday dinner out" },
  { id: "t07", day: 7, payee: "Mannings — pharmacy", category: "health", amount: 312, note: "Vitamins and plasters" },
  { id: "t08", day: 9, payee: "ParknShop — weekly groceries", category: "food", amount: 918, note: "Seafood and pantry staples" },
  { id: "t09", day: 10, payee: "Kumon — maths class", category: "education", amount: 900, note: "Monthly tuition" },
  { id: "t10", day: 11, payee: "Cinema City — movie night", category: "entertainment", amount: 260, note: "Two tickets and popcorn" },
  { id: "t11", day: 12, payee: "AIA — life insurance", category: "insurance", amount: 1950, note: "Monthly premium" },
  { id: "t12", day: 14, payee: "Uniqlo — winter clothes", category: "shopping", amount: 1240, note: "Jackets for the family" },
  { id: "t13", day: 15, payee: "Hong Kong & China Gas", category: "utilities", amount: 312, note: "October bill" },
  { id: "t14", day: 16, payee: "ParknShop — weekly groceries", category: "food", amount: 1045, note: "Big shop before the holiday" },
  { id: "t15", day: 17, payee: "Pizza Hut — birthday dinner", category: "dining", amount: 486, note: "Mum's birthday" },
  { id: "t16", day: 18, payee: "Sinopec — petrol", category: "transport", amount: 420, note: "Family car top-up" },
  { id: "t17", day: 19, payee: "Water Supplies Dept", category: "utilities", amount: 442, note: "Quarterly water bill" },
  { id: "t18", day: 20, payee: "Yamaha Music School", category: "education", amount: 900, note: "Piano lessons" },
  { id: "t19", day: 21, payee: "ParknShop — weekly groceries", category: "food", amount: 978, note: "Fresh produce and bread" },
  { id: "t20", day: 22, payee: "McDonald's — lunch", category: "dining", amount: 156, note: "Quick lunch after football" },
  { id: "t21", day: 23, payee: "Decathlon — sports gear", category: "shopping", amount: 1100, note: "Trainers and a badminton set" },
  { id: "t22", day: 24, payee: "GP clinic — check-up", category: "health", amount: 578, note: "Annual check-up fee" },
  { id: "t23", day: 25, payee: "Netflix & Spotify", category: "entertainment", amount: 216, note: "Monthly subscriptions" },
  { id: "t24", day: 26, payee: "ParknShop — weekly groceries", category: "food", amount: 1104, note: "Thanksgiving week shop" },
  { id: "t25", day: 27, payee: "Sushi Express — dinner", category: "dining", amount: 642, note: "Sushi night" },
  { id: "t26", day: 28, payee: "MTR Octopus top-up", category: "transport", amount: 260, note: "Extra top-up" },
  { id: "t27", day: 28, payee: "Ocean Park — family day", category: "entertainment", amount: 644, note: "Tickets for three" },
  { id: "t28", day: 29, payee: "Bookazine — school books", category: "other", amount: 640, note: "Workbooks and stationery" },
  { id: "t29", day: 30, payee: "Din Tai Fung — month-end dinner", category: "dining", amount: 628, note: "Celebration dinner" }
];

export const MONTHS = [
  { key: "2026-06", label: "June 2026", income: 42800, spent: 30410, top: "food" },
  { key: "2026-07", label: "July 2026", income: 43150, spent: 31880, top: "housing" },
  { key: "2026-08", label: "August 2026", income: 44250, spent: 33540, top: "shopping" },
  { key: "2026-09", label: "September 2026", income: 43900, spent: 30960, top: "food" },
  { key: "2026-10", label: "October 2026", income: 44250, spent: 31780, top: "housing" },
  { key: "2026-11", label: "November 2026", income: 44250, spent: 30960, top: "food" }
];

export const GOALS = [
  { id: "g1", name: "Emergency fund", target: 120000, saved: 78400, note: "6 months of essential spending" },
  { id: "g2", name: "Japan family trip", target: 28000, saved: 12600, note: "Flights and hotels, April 2027" },
  { id: "g3", name: "New laptop for K. Chan", target: 15000, saved: 9300, note: "For freelance design work" },
  { id: "g4", name: "Child education fund", target: 60000, saved: 21000, note: "Secondary school top-up" }
];

export const TIPS = [
  { title: "Dining out is 7% over budget", body: "November dining reached HK$2,150 against a HK$2,000 budget. One home-cooked dinner a week saves about HK$600 a month." },
  { title: "Groceries are your biggest variable cost", body: "Food and groceries total HK$5,650 this month. A weekly list and one big shop instead of top-ups keeps it under HK$7,000." },
  { title: "Savings rate is 30%", body: "HK$13,290 of HK$44,250 income was saved. Keeping the rate above 25% puts the emergency fund on track for February 2027." }
];

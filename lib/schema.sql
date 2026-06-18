CREATE TABLE IF NOT EXISTS ingredients (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT NOT NULL UNIQUE,
  quantity     REAL NOT NULL DEFAULT 0,
  unit         TEXT NOT NULL,
  min_quantity REAL NOT NULL DEFAULT 0,
  created_at   TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS recipes (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  name             TEXT NOT NULL,
  raw_text         TEXT NOT NULL,
  ingredients_json TEXT,
  servings         INTEGER DEFAULT 1,
  created_at       TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS meal_logs (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id      INTEGER REFERENCES recipes(id),
  cooked_at      TEXT DEFAULT (datetime('now')),
  servings       INTEGER DEFAULT 1,
  nutrition_json TEXT
);

CREATE TABLE IF NOT EXISTS notifications (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  type       TEXT NOT NULL,
  message    TEXT NOT NULL,
  seen       INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

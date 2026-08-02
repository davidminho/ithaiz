CREATE TABLE IF NOT EXISTS menu_categories (
  id TEXT PRIMARY KEY,
  name_original TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  notes TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES menu_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  name_original TEXT NOT NULL,
  description_original TEXT NOT NULL DEFAULT '',
  price_text_original TEXT NOT NULL DEFAULT '',
  price_value NUMERIC(10, 2),
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  variants JSONB NOT NULL DEFAULT '[]'::jsonb,
  options_original JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes_original TEXT NOT NULL DEFAULT '',
  source_file TEXT NOT NULL DEFAULT '',
  source_page INTEGER,
  sort INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE INDEX IF NOT EXISTS menu_items_category_id_idx ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS menu_items_status_idx ON menu_items(status);

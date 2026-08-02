import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = process.env.MENU_SOURCE ?? path.resolve(scriptDir, "../data/menu_extracted.json");
const directusUrl = (process.env.DIRECTUS_URL ?? "http://localhost:8055").replace(/\/$/, "");
const email = process.env.DIRECTUS_EMAIL;
const password = process.env.DIRECTUS_PASSWORD;
const status = process.env.MENU_IMPORT_STATUS ?? "draft";

if (!email || !password) {
  throw new Error("Set DIRECTUS_EMAIL and DIRECTUS_PASSWORD before importing the menu.");
}

const source = JSON.parse(await readFile(sourcePath, "utf8"));
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function request(endpoint, options = {}) {
  const response = await fetch(`${directusUrl}${endpoint}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) }
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${options.method ?? "GET"} ${endpoint} failed (${response.status}): ${JSON.stringify(body)}`);
  return body?.data ?? body;
}

const auth = await request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
const token = auth.access_token;
const headers = { Authorization: `Bearer ${token}` };

async function upsert(collection, id, item) {
  const existing = await fetch(`${directusUrl}/items/${collection}/${encodeURIComponent(id)}`, { headers });
  if (existing.ok) {
    return request(`/items/${collection}/${encodeURIComponent(id)}`, { method: "PATCH", headers, body: JSON.stringify(item) });
  }
  return request(`/items/${collection}`, { method: "POST", headers, body: JSON.stringify({ id, ...item }) });
}

for (const [categoryIndex, category] of source.categories.entries()) {
  const categoryId = category.category_id;
  await upsert("menu_categories", categoryId, {
    name_original: category.name_original,
    slug: slugify(category.name_original),
    sort: categoryIndex,
    status,
    notes: "Imported from menu_extracted.json; review before publishing."
  });

  for (const [itemIndex, item] of category.items.entries()) {
    await upsert("menu_items", item.item_id, {
      category_id: categoryId,
      name_original: item.name_original,
      description_original: item.description_original ?? "",
      price_text_original: item.price_text_original ?? "",
      price_value: item.price_value ?? null,
      currency: item.currency ?? "USD",
      variants: item.variants ?? [],
      options_original: item.options_original ?? [],
      notes_original: item.notes_original ?? "",
      source_file: item.source_file ?? "",
      source_page: item.page_number ?? null,
      sort: itemIndex,
      status
    });
  }
}

console.log(`Imported ${source.categories.length} categories and ${source.categories.reduce((total, category) => total + category.items.length, 0)} menu items as ${status}.`);

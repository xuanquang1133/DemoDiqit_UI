/**
 * Converts a product name into a URL-friendly slug and a readable SKU prefix.
 * Logic mirrors the Go backend helpers/slug/slug.go
 */

function removeVietnameseDiacritics(text: string): string {
  const vowelReplacements: Record<string, string> = {
    à: "a", á: "a", ả: "a", ã: "a", ạ: "a",
    ă: "a", ằ: "a", ắ: "a", ẳ: "a", ẵ: "a", ặ: "a",
    â: "a", ầ: "a", ấ: "a", ẩ: "a", ẫ: "a", ậ: "a",
    đ: "d",
    è: "e", é: "e", ẻ: "e", ẽ: "e", ẹ: "e",
    ê: "e", ề: "e", ế: "e", ể: "e", ễ: "e", ệ: "e",
    ì: "i", í: "i", ỉ: "i", ĩ: "i", ị: "i",
    ò: "o", ó: "o", ỏ: "o", õ: "o", ọ: "o",
    ô: "o", ồ: "o", ố: "o", ổ: "o", ỗ: "o", ộ: "o",
    ơ: "o", ờ: "o", ớ: "o", ở: "o", ỡ: "o", ợ: "o",
    ù: "u", ú: "u", ủ: "u", ũ: "u", ụ: "u",
    ư: "u", ừ: "u", ứ: "u", ử: "u", ữ: "u", ự: "u",
    ỳ: "y", ý: "y", ỷ: "y", ỹ: "y", ỵ: "y",
  };

  return text
    .split("")
    .map((char) => vowelReplacements[char] ?? char)
    .join("");
}

/**
 * Converts a name to a URL-friendly slug.
 */
export function generateSlug(name: string): string {
  if (!name.trim()) return "";

  const normalized = removeVietnameseDiacritics(name);
  const slugified = normalized
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slugified;
}

/**
 * Generates a SKU from a product name.
 * Takes the first 3 characters of the slug + a random 4-digit suffix.
 * Example: "iPhone 15 Pro" -> "IPH-0000"
 */
export function generateSKU(name: string): string {
  const slug = generateSlug(name);
  const prefix = slug.slice(0, 3).toUpperCase();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `SKU-${prefix}-${suffix}`;
}

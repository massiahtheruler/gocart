export const CATEGORY_DELIMITER = "|||";

export function parseProductCategories(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return [...new Set(value.flatMap((item) => parseProductCategories(item)))];
  }

  return String(value)
    .split(CATEGORY_DELIMITER)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index);
}

export function serializeProductCategories(categories) {
  return parseProductCategories(categories).join(CATEGORY_DELIMITER);
}

export function productHasCategory(categoryValue, category) {
  if (!category) return false;
  return parseProductCategories(categoryValue).includes(category);
}

export function getPrimaryProductCategory(categoryValue) {
  return parseProductCategories(categoryValue)[0] || "";
}

export function formatProductCategories(categoryValue, maxVisible = 2) {
  const categories = parseProductCategories(categoryValue);
  if (categories.length <= maxVisible) return categories.join(", ");
  return `${categories.slice(0, maxVisible).join(", ")} +${categories.length - maxVisible}`;
}

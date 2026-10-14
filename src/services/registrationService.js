import { sanitizeText } from '../utils/security.js';

function createReference(prefix) {
  const stamp = new Date().getFullYear();
  const fragment = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${stamp}-${fragment}`;
}

const STORAGE_PREFIX = 'infobrains_category_reg_';

export async function registerInterests(values, selectedCategories) {
  return {
    ...values,
    selectedCategories,
    referenceNumber: createReference('IB-CAT'),
    submittedAt: new Date().toISOString(),
    status: 'Local demo registration saved',
  };
}

export async function registerCategoryTrack(category, values) {
  const prefix = `IB-${category.shortName.toUpperCase().slice(0, 3)}`;
  const record = {
    ...values,
    categoryId: category.id,
    categoryName: category.name,
    categoryShortName: category.shortName,
    referenceNumber: createReference(prefix),
    submittedAt: new Date().toISOString(),
    status: 'Confirmed Registration',
  };

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${category.id}`, JSON.stringify(record));
  } catch {
    // Graceful fallback if storage is restricted
  }

  return record;
}

export function getCategoryRegistration(categoryId) {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${categoryId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      ...parsed,
      fullName: sanitizeText(parsed.fullName),
      phoneNumber: sanitizeText(parsed.phoneNumber),
      email: sanitizeText(parsed.email),
      registrationNumber: sanitizeText(parsed.registrationNumber),
      motivation: sanitizeText(parsed.motivation),
    };
  } catch {
    return null;
  }
}

export function clearCategoryRegistration(categoryId) {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${categoryId}`);
  } catch {
    // ignore
  }
}

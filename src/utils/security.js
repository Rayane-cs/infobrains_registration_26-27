/**
 * Security & Input Validation Utilities
 * Defense against XSS, SQLi, Formula/CSV injection, and malformed inputs.
 */

// Injection patterns to detect and block
const XSS_PATTERNS = [
  /<[^>]*>/i, // Any HTML tags <script>, <img ...>, etc.
  /javascript:/i,
  /vbscript:/i,
  /data:text\/html/i,
  /on\w+\s*=/i, // inline event handlers: onclick=, onerror=, etc.
  /expression\s*\(/i,
  /eval\s*\(/i,
];

const SQL_INJECTION_PATTERNS = [
  /(\b(union|select|insert|update|delete|drop|alter|create|truncate|exec|execute)\b)/i,
  /(--|\/\*|\*\/)/, // SQL comments
  /;\s*$/, // Trailing query semicolon
  /\b(or|and)\b\s+["']?\d+["']?\s*=\s*["']?\d+/i, // 1=1 or 1=0 tautologies
  /["']\s*(or|and)\s*["']/i,
];

const DANGEROUS_CHARS = /[<>{}[\]\\^~`]/;

/**
 * Checks if input contains any common XSS or HTML injection patterns
 */
export function hasXss(val) {
  if (typeof val !== 'string') return false;
  return XSS_PATTERNS.some((pattern) => pattern.test(val)) || DANGEROUS_CHARS.test(val);
}

/**
 * Checks if input contains common SQL injection patterns
 */
export function hasSqlInjection(val) {
  if (typeof val !== 'string') return false;
  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(val));
}

/**
 * Checks if input begins with formula injection triggers (=, +, -, @)
 */
export function hasFormulaInjection(val) {
  if (typeof val !== 'string') return false;
  const trimmed = val.trim();
  return /^[=+\-@]/.test(trimmed);
}

/**
 * Sanitizes generic single-line text:
 * - Trims leading/trailing whitespace
 * - Strips control characters
 * - Neutralizes formula injection prefix
 */
export function sanitizeText(val) {
  if (!val || typeof val !== 'string') return '';
  let clean = val.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim();
  // Neutralize formula injection if exported to CSV/Excel
  if (/^[=+\-@]/.test(clean)) {
    clean = `'${clean}`;
  }
  return clean;
}

/**
 * Allowed Academic Study Levels
 */
export const ALLOWED_STUDY_LEVELS = [
  'Licence 1 (L1)',
  'Licence 2 (L2)',
  'Licence 3 (L3)',
  'Master 1 (M1)',
  'Master 2 (M2)',
  '1ère Année Ingénieur (IA)',
];

/**
 * Allowed Specialities
 */
export const ALLOWED_SPECIALITES = [
  'Mathématiques (Math)',
  'Physique (Physics)',
  'Chimie (Chimie)',
  'Informatique',
  'Autre (Other)',
];

/**
 * Full Name Validation
 * - Letters (Latin + Arabic + Accents), spaces, hyphens, and apostrophes only
 * - 2 to 60 characters
 */
export function validateFullName(name) {
  const clean = (name || '').trim();
  if (!clean) return 'Full name is required.';
  if (clean.length < 2) return 'Full name must be at least 2 characters.';
  if (clean.length > 60) return 'Full name cannot exceed 60 characters.';
  if (hasXss(clean) || hasSqlInjection(clean)) {
    return 'Invalid characters detected. Please enter a legitimate name.';
  }
  // Unicode letters (\p{L}), spaces, apostrophe, hyphen
  const nameRegex = /^[\p{L}\s'-]+$/u;
  if (!nameRegex.test(clean)) {
    return 'Name may only contain letters, spaces, hyphens, and apostrophes.';
  }
  return null;
}

/**
 * Phone Number Validation
 * - Allowed: digits, spaces, hyphens, optional leading '+'
 * - Total digit count must be between 8 and 15
 */
export function validatePhoneNumber(phone, required = true) {
  const clean = (phone || '').trim();
  if (!clean) {
    return required ? 'Phone number is required.' : null;
  }
  if (hasXss(clean) || hasSqlInjection(clean)) {
    return 'Invalid phone number format.';
  }
  // Format check: only digits, spaces, parentheses, dashes, and optional leading +
  if (!/^\+?[0-9\s\-()]{8,22}$/.test(clean)) {
    return 'Enter a valid phone number (e.g. 0555 12 34 56 or +213 555 12 34 56).';
  }
  const digitsOnly = clean.replace(/\D/g, '');
  if (digitsOnly.length < 8 || digitsOnly.length > 15) {
    return 'Phone number must contain between 8 and 15 digits.';
  }
  return null;
}

/**
 * University Registration Number (Matricule) Validation
 * - Typically 12-digit number (e.g. 212137016608) or standard alphanumeric university ID
 * - Strictly alphanumeric with optional hyphen or slash
 * - 6 to 24 characters
 */
export function validateRegistrationNumber(regNum) {
  const clean = (regNum || '').trim();
  if (!clean) return 'University registration number is required.';
  if (hasXss(clean) || hasSqlInjection(clean)) {
    return 'Invalid registration number. Special injection characters are not allowed.';
  }
  if (!/^[A-Za-z0-9\-_/]{6,24}$/.test(clean)) {
    return 'Registration number must be 6-24 alphanumeric characters (e.g. 212137016608).';
  }
  return null;
}

/**
 * Email Address Validation
 * - Standard RFC-compliant email structure
 * - Max 100 characters
 * - No HTML/SQL injection
 */
export function validateEmail(email, required = true) {
  const clean = (email || '').trim();
  if (!clean) {
    return required ? 'Email address is required.' : null;
  }
  if (clean.length > 100) return 'Email address is too long (maximum 100 characters).';
  if (hasXss(clean) || hasSqlInjection(clean)) {
    return 'Invalid email address.';
  }
  // Standard robust email pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(clean)) {
    return 'Please enter a valid email address (e.g. student@univ.dz).';
  }
  return null;
}

/**
 * Faculty or Department Validation
 * - Letters (Latin/Arabic), digits, spaces, dots, commas, hyphens, parentheses, ampersands
 * - 2 to 80 characters
 */
export function validateFaculty(faculty) {
  const clean = (faculty || '').trim();
  if (!clean) return 'Faculty or department is required.';
  if (clean.length < 2) return 'Faculty name must be at least 2 characters.';
  if (clean.length > 80) return 'Faculty name cannot exceed 80 characters.';
  if (hasXss(clean) || hasSqlInjection(clean)) {
    return 'Invalid characters in faculty name.';
  }
  const facultyRegex = /^[\p{L}0-9\s.,'()&-]+$/u;
  if (!facultyRegex.test(clean)) {
    return 'Faculty may only contain letters, numbers, spaces, and standard punctuation.';
  }
  return null;
}

/**
 * Study Level Validation (Whitelist)
 */
export function validateStudyLevel(level) {
  if (!level) return 'Please select your academic year.';
  if (!ALLOWED_STUDY_LEVELS.includes(level)) {
    return 'Invalid academic year selected.';
  }
  return null;
}

/**
 * Specialite Validation (Whitelist)
 */
export function validateSpecialite(specialite) {
  if (!specialite) return 'Please select your speciality.';
  if (!ALLOWED_SPECIALITES.includes(specialite)) {
    return 'Invalid speciality selected.';
  }
  return null;
}

/**
 * Sub-Track Validation (Whitelist against category)
 */
export function validateSubTrack(subTrack, category) {
  if (!subTrack) return 'Please choose your focus area.';
  if (category?.subTracks && !category.subTracks.includes(subTrack)) {
    return 'Invalid focus area selected.';
  }
  return null;
}

/**
 * Experience Level Validation (Whitelist)
 */
export function validateExperienceLevel(level) {
  const allowed = ['beginner', 'intermediate', 'advanced'];
  if (level && !allowed.includes(level)) {
    return 'Invalid experience level.';
  }
  return null;
}

/**
 * Motivation / Notes Validation
 * - Optional, max 500 characters
 * - No HTML/script tags or SQL injection sequences
 */
export function validateMotivation(text) {
  if (!text) return null;
  const clean = text.trim();
  if (clean.length > 500) {
    return 'Motivation cannot exceed 500 characters.';
  }
  if (hasXss(clean) || hasSqlInjection(clean)) {
    return 'HTML tags, scripts, and special injection characters are not permitted.';
  }
  return null;
}

import { sanitizeText } from '../utils/security.js';

function createReference(prefix) {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const fragment = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${stamp}-${fragment}`;
}

export async function recordAttendance(values) {
  return {
    ...values,
    fullName: sanitizeText(values.fullName),
    phoneNumber: sanitizeText(values.phoneNumber),
    registrationNumber: sanitizeText(values.registrationNumber),
    faculty: sanitizeText(values.faculty),
    email: sanitizeText(values.email),
    referenceNumber: createReference('IB-ATT'),
    submittedAt: new Date().toISOString(),
    status: 'Local demo recorded',
  };
}

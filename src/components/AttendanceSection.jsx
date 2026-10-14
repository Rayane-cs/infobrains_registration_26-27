import { ClipboardCheck, HelpCircle, Printer, RefreshCcw } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { eventConfig } from '../config/event.js';
import { recordAttendance } from '../services/attendanceService.js';
import {
  ALLOWED_STUDY_LEVELS,
  sanitizeText,
  validateEmail,
  validateFaculty,
  validateFullName,
  validatePhoneNumber,
  validateRegistrationNumber,
  validateStudyLevel,
} from '../utils/security.js';
import AttendanceConfirmation from './AttendanceConfirmation.jsx';
import FeedbackMessage from './FeedbackMessage.jsx';
import FormField from './FormField.jsx';
import StudentCardModal from './StudentCardModal.jsx';

const STUDY_LEVELS = ALLOWED_STUDY_LEVELS;

const initialValues = {
  fullName: '',
  phoneNumber: '',
  registrationNumber: '',
  faculty: '',
  studyLevel: '',
  email: '',
  acknowledged: false,
};

function validate(values) {
  const errors = {};
  
  const nameError = validateFullName(values.fullName);
  if (nameError) errors.fullName = nameError;

  const phoneError = validatePhoneNumber(values.phoneNumber, true);
  if (phoneError) errors.phoneNumber = phoneError;

  const regError = validateRegistrationNumber(values.registrationNumber);
  if (regError) errors.registrationNumber = regError;

  const facultyError = validateFaculty(values.faculty);
  if (facultyError) errors.faculty = facultyError;

  const studyError = validateStudyLevel(values.studyLevel);
  if (studyError) errors.studyLevel = studyError;

  const emailError = validateEmail(values.email, false);
  if (emailError) errors.email = emailError;

  if (!values.acknowledged) {
    errors.acknowledged = 'Please confirm your presence to submit.';
  }
  return errors;
}

export default function AttendanceSection() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [record, setRecord] = useState(null);
  const [showCardGuide, setShowCardGuide] = useState(false);
  const suppressCardGuideRef = useRef(false);

  const fieldRefs = {
    fullName: useRef(null),
    phoneNumber: useRef(null),
    registrationNumber: useRef(null),
    faculty: useRef(null),
    studyLevel: useRef(null),
    email: useRef(null),
    acknowledged: useRef(null),
  };

  const hasRecord = Boolean(record);

  const formattedSubmittedAt = useMemo(() => {
    if (!record?.submittedAt) return '';
    return new Intl.DateTimeFormat('en', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(record.submittedAt));
  }, [record]);

  function openCardGuide(force = false) {
    if (suppressCardGuideRef.current) return;
    if (!force && values.registrationNumber.trim().length > 3) return;
    setShowCardGuide(true);
  }

  function handleCloseCardGuide() {
    setShowCardGuide(false);
    suppressCardGuideRef.current = true;
    setTimeout(() => {
      suppressCardGuideRef.current = false;
    }, 400);
    requestAnimationFrame(() => {
      fieldRefs.registrationNumber.current?.focus();
    });
  }

  function updateValue(event) {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];
      requestAnimationFrame(() => fieldRefs[firstField]?.current?.focus());
      return;
    }

    setIsSubmitting(true);
    try {
      const sanitizedValues = {
        fullName: sanitizeText(values.fullName),
        phoneNumber: sanitizeText(values.phoneNumber),
        registrationNumber: sanitizeText(values.registrationNumber),
        faculty: sanitizeText(values.faculty),
        studyLevel: values.studyLevel,
        email: values.email ? sanitizeText(values.email) : '',
        acknowledged: Boolean(values.acknowledged),
      };
      const result = await recordAttendance(sanitizedValues);
      setRecord(result);
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetAttendance() {
    setValues(initialValues);
    setErrors({});
    setRecord(null);
    requestAnimationFrame(() => fieldRefs.fullName.current?.focus());
  }

  return (
    <section className="workflow-section attendance-section" id="attendance" aria-labelledby="attendance-title">
      <div className="section-inner workflow-grid">
        <div className="section-copy">
          <p className="section-kicker">
            <ClipboardCheck size={16} aria-hidden="true" />
            Attendance
          </p>
          <h2 id="attendance-title">Were you here today?</h2>
          <p>
            Fill in your details below to mark your presence at the InfoBrains Open Day.
          </p>
          <FeedbackMessage tone="info" title="Presence confirmation">
            {eventConfig.attendanceDisclaimer}
          </FeedbackMessage>
        </div>

        <div className="form-panel attendance-form-panel">
          {!hasRecord ? (
            <form onSubmit={handleSubmit} noValidate>
              <FormField
                id="attendance-name"
                name="fullName"
                label="Full name"
                autoComplete="name"
                value={values.fullName}
                onChange={updateValue}
                error={errors.fullName}
                ref={fieldRefs.fullName}
                placeholder="e.g. Rayan Chen"
                maxLength={60}
                required
              />
              <FormField
                id="attendance-phone"
                name="phoneNumber"
                label="Phone number"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={values.phoneNumber}
                onChange={updateValue}
                error={errors.phoneNumber}
                ref={fieldRefs.phoneNumber}
                placeholder="e.g. 0555 12 34 56 or +213 555 12 34 56"
                maxLength={22}
                required
              />
              <FormField
                id="attendance-registration"
                name="registrationNumber"
                label="University registration number"
                autoComplete="off"
                value={values.registrationNumber}
                onChange={updateValue}
                onClick={() => openCardGuide()}
                onFocus={() => openCardGuide()}
                error={errors.registrationNumber}
                ref={fieldRefs.registrationNumber}
                placeholder="e.g. 212137016608"
                maxLength={24}
                labelAction={
                  <button
                    type="button"
                    className="field-hint-btn"
                    onClick={() => openCardGuide(true)}
                    title="View student card example"
                  >
                    <HelpCircle size={13} aria-hidden="true" />
                    <span>Where to find?</span>
                  </button>
                }
                required
              />
              <FormField
                id="attendance-faculty"
                name="faculty"
                label="Faculty or department"
                autoComplete="organization"
                value={values.faculty}
                onChange={updateValue}
                error={errors.faculty}
                ref={fieldRefs.faculty}
                placeholder="e.g. Faculty of Exact Sciences & Computer Science"
                maxLength={80}
                required
              />
              <div className="field" ref={fieldRefs.studyLevel}>
                <div className="field-header">
                  <label htmlFor="attendance-level">
                    Study level <span aria-hidden="true"> *</span>
                  </label>
                </div>
                <select
                  id="attendance-level"
                  name="studyLevel"
                  value={values.studyLevel}
                  onChange={updateValue}
                  required
                  aria-required="true"
                  aria-invalid={errors.studyLevel ? 'true' : 'false'}
                  aria-describedby={errors.studyLevel ? 'attendance-level-error' : undefined}
                >
                  <option value="" disabled>Select academic year…</option>
                  {STUDY_LEVELS.map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
                {errors.studyLevel && (
                  <p id="attendance-level-error" className="field-error" role="alert">
                    {errors.studyLevel}
                  </p>
                )}
              </div>
              <FormField
                id="attendance-email"
                name="email"
                label="Optional contact email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={values.email}
                onChange={updateValue}
                error={errors.email}
                ref={fieldRefs.email}
                placeholder="e.g. student@univ.dz"
                maxLength={100}
                help="Used only in this local demo screen."
              />

              <div className="check-field">
                <input
                  id="attendance-acknowledged"
                  name="acknowledged"
                  type="checkbox"
                  checked={values.acknowledged}
                  onChange={updateValue}
                  aria-invalid={errors.acknowledged ? 'true' : 'false'}
                  aria-describedby={errors.acknowledged ? 'attendance-acknowledged-error' : undefined}
                  ref={fieldRefs.acknowledged}
                />
                <label htmlFor="attendance-acknowledged">
                  I confirm that the information I provided is correct and I was present at the InfoBrains Open Day.
                </label>
              </div>
              {errors.acknowledged ? (
                <p className="field-error check-error" id="attendance-acknowledged-error" role="alert">
                  {errors.acknowledged}
                </p>
              ) : null}

              <button className="button button--primary button--full" type="submit" disabled={isSubmitting}>
                <span>{isSubmitting ? 'Recording...' : 'Record My Attendance'}</span>
              </button>
            </form>
          ) : (
            <div className="success-stack">
              <FeedbackMessage tone="success" title="Presence recorded">
                Your attendance has been confirmed. Reference: {record.referenceNumber}
              </FeedbackMessage>
              <AttendanceConfirmation record={record} submittedAt={formattedSubmittedAt} />
              <div className="action-row no-print">
                <button className="button button--primary" type="button" onClick={() => window.print()}>
                  <Printer size={18} aria-hidden="true" />
                  Print Confirmation
                </button>
                <button className="button button--outline" type="button" onClick={resetAttendance}>
                  <RefreshCcw size={18} aria-hidden="true" />
                  Record Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <StudentCardModal isOpen={showCardGuide} onClose={handleCloseCardGuide} />
    </section>
  );
}

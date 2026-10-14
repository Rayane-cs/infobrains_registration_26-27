import { BadgeCheck, Edit3, HelpCircle, Mail, RefreshCcw } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { categories } from '../config/categories.js';
import { registerInterests } from '../services/registrationService.js';
import {
  ALLOWED_SPECIALITES,
  ALLOWED_STUDY_LEVELS,
  sanitizeText,
  validateEmail,
  validateFullName,
  validatePhoneNumber,
  validateRegistrationNumber,
  validateSpecialite,
  validateStudyLevel,
} from '../utils/security.js';
import CategoryCard from './CategoryCard.jsx';
import FeedbackMessage from './FeedbackMessage.jsx';
import FormField from './FormField.jsx';
import StudentCardModal from './StudentCardModal.jsx';

const MAX_CATEGORIES = 2;
const STUDY_LEVELS = ALLOWED_STUDY_LEVELS;
const SPECIALITES = ALLOWED_SPECIALITES;

const initialValues = {
  fullName: '',
  email: '',
  phoneNumber: '',
  registrationNumber: '',
  studyLevel: '',
  specialite: '',
  consent: false,
};

function validate(values, selectedIds) {
  const errors = {};
  if (selectedIds.length === 0) {
    errors.categories = 'Select at least one category.';
  } else if (selectedIds.length > MAX_CATEGORIES) {
    errors.categories = `You can select a maximum of ${MAX_CATEGORIES} categories.`;
  }

  const nameErr = validateFullName(values.fullName);
  if (nameErr) errors.fullName = nameErr;

  const emailErr = validateEmail(values.email, true);
  if (emailErr) errors.email = emailErr;

  const phoneErr = validatePhoneNumber(values.phoneNumber, true);
  if (phoneErr) errors.phoneNumber = phoneErr;

  const regErr = validateRegistrationNumber(values.registrationNumber);
  if (regErr) errors.registrationNumber = regErr;

  const studyErr = validateStudyLevel(values.studyLevel);
  if (studyErr) errors.studyLevel = studyErr;

  const specErr = validateSpecialite(values.specialite);
  if (specErr) errors.specialite = specErr;

  if (!values.consent) {
    errors.consent = 'Confirm that InfoBrains can use this demo registration.';
  }
  return errors;
}

export default function CategoriesSection() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [showCardGuide, setShowCardGuide] = useState(false);
  const suppressCardGuideRef = useRef(false);

  const fieldRefs = {
    categories: useRef(null),
    fullName: useRef(null),
    email: useRef(null),
    phoneNumber: useRef(null),
    registrationNumber: useRef(null),
    studyLevel: useRef(null),
    specialite: useRef(null),
    consent: useRef(null),
  };

  const selectedCategories = useMemo(
    () => categories.filter((category) => selectedIds.includes(category.id)),
    [selectedIds],
  );

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

  function toggleCategory(id) {
    setRegistration(null);

    // Enforce maximum 2 categories limit
    if (!selectedIds.includes(id) && selectedIds.length >= MAX_CATEGORIES) {
      setErrors((current) => ({
        ...current,
        categories: `You cannot select more than ${MAX_CATEGORIES} categories. Please deselect one to choose another.`,
      }));
      return;
    }

    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    setErrors((current) => ({ ...current, categories: undefined }));
  }

  function updateValue(event) {
    const { name, value, type, checked } = event.target;
    setRegistration(null);
    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validate(values, selectedIds);
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
        email: sanitizeText(values.email),
        phoneNumber: sanitizeText(values.phoneNumber),
        registrationNumber: sanitizeText(values.registrationNumber),
        studyLevel: values.studyLevel,
        specialite: values.specialite,
        consent: Boolean(values.consent),
      };
      const result = await registerInterests(sanitizedValues, selectedCategories);
      setRegistration(result);
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  }

  function editRegistration() {
    setRegistration(null);
    requestAnimationFrame(() => fieldRefs.fullName.current?.focus());
  }

  function resetRegistration() {
    setValues(initialValues);
    setSelectedIds([]);
    setErrors({});
    setRegistration(null);
    requestAnimationFrame(() => fieldRefs.categories.current?.focus());
  }

  return (
    <section className="workflow-section categories-section" id="categories" aria-labelledby="categories-title">
      <div className="section-inner">
        <div className="section-heading">
          <div className="section-heading-row">
            <p className="section-kicker">
              <BadgeCheck size={16} aria-hidden="true" />
              Categories
            </p>
            <span className="category-limit-tag" aria-live="polite">
              Max {MAX_CATEGORIES} tracks ({selectedIds.length}/{MAX_CATEGORIES} selected)
            </span>
          </div>
          <h2 id="categories-title">Find your domain.</h2>
          <p>Choose the fields you're curious about. You can select up to 2 categories.</p>
        </div>

        <div className="category-grid" ref={fieldRefs.categories} tabIndex="-1">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              selected={selectedIds.includes(category.id)}
              maxReached={selectedIds.length >= MAX_CATEGORIES && !selectedIds.includes(category.id)}
              selectionOrder={
                selectedIds.includes(category.id) ? selectedIds.indexOf(category.id) + 1 : undefined
              }
              onToggle={toggleCategory}
            />
          ))}
        </div>
        {errors.categories ? (
          <p className="field-error category-error" role="alert">
            {errors.categories}
          </p>
        ) : null}

        <div className="registration-layout">
          <aside className="selection-summary" aria-live="polite">
            <div className="summary-title-row">
              <h3>Selected categories</h3>
              <span className="summary-count-badge">
                {selectedCategories.length} / {MAX_CATEGORIES}
              </span>
            </div>
            {selectedCategories.length ? (
              <ul>
                {selectedCategories.map((category) => (
                  <li key={category.id}>
                    <span style={{ '--summary-color': category.color }} />
                    {category.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No category selected yet (max {MAX_CATEGORIES}).</p>
            )}
          </aside>

          <div className="form-panel">
            {!registration ? (
              <form onSubmit={handleSubmit} noValidate>
                <FormField
                  id="registration-name"
                  name="fullName"
                  label="Full name"
                  autoComplete="name"
                  value={values.fullName}
                  onChange={updateValue}
                  error={errors.fullName}
                  ref={fieldRefs.fullName}
                  placeholder="e.g. Rayan Chen"
                  required
                />
                <FormField
                  id="registration-email"
                  name="email"
                  label="Email address"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={updateValue}
                  error={errors.email}
                  ref={fieldRefs.email}
                  placeholder="e.g. student@univ.dz"
                  required
                />
                <FormField
                  id="registration-phone"
                  name="phoneNumber"
                  label="Phone number"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={values.phoneNumber}
                  onChange={updateValue}
                  error={errors.phoneNumber}
                  ref={fieldRefs.phoneNumber}
                  placeholder="e.g. 0555 12 34 56 or +213 555 12 34 56"
                  required
                />
                <FormField
                  id="registration-number"
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
                <div className="field" ref={fieldRefs.studyLevel}>
                  <div className="field-header">
                    <label htmlFor="registration-level">
                      Study level <span aria-hidden="true"> *</span>
                    </label>
                  </div>
                  <select
                    id="registration-level"
                    name="studyLevel"
                    value={values.studyLevel}
                    onChange={updateValue}
                    required
                    aria-required="true"
                    aria-invalid={errors.studyLevel ? 'true' : 'false'}
                    aria-describedby={errors.studyLevel ? 'registration-level-error' : undefined}
                  >
                    <option value="" disabled>Select academic year…</option>
                    {STUDY_LEVELS.map(lvl => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                  {errors.studyLevel && (
                    <p id="registration-level-error" className="field-error" role="alert">
                      {errors.studyLevel}
                    </p>
                  )}
                </div>
                <div className="field" ref={fieldRefs.specialite}>
                  <div className="field-header">
                    <label htmlFor="registration-specialite">
                      Spécialité <span aria-hidden="true"> *</span>
                    </label>
                  </div>
                  <select
                    id="registration-specialite"
                    name="specialite"
                    value={values.specialite}
                    onChange={updateValue}
                    required
                    aria-required="true"
                    aria-invalid={errors.specialite ? 'true' : 'false'}
                    aria-describedby={errors.specialite ? 'registration-specialite-error' : undefined}
                  >
                    <option value="" disabled>Select your speciality…</option>
                    {SPECIALITES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.specialite && (
                    <p id="registration-specialite-error" className="field-error" role="alert">
                      {errors.specialite}
                    </p>
                  )}
                </div>
                <div className="check-field">
                  <input
                    id="registration-consent"
                    name="consent"
                    type="checkbox"
                    checked={values.consent}
                    onChange={updateValue}
                    aria-invalid={errors.consent ? 'true' : 'false'}
                    aria-describedby={errors.consent ? 'registration-consent-error' : undefined}
                    ref={fieldRefs.consent}
                  />
                  <label htmlFor="registration-consent">
                    I agree to use this local demo registration to share my category interests.
                  </label>
                </div>
                {errors.consent ? (
                  <p className="field-error check-error" id="registration-consent-error" role="alert">
                    {errors.consent}
                  </p>
                ) : null}

                <button className="button button--primary button--full" type="submit" disabled={isSubmitting}>
                  <Mail size={18} aria-hidden="true" />
                  <span>{isSubmitting ? 'Registering...' : 'Register My Interests'}</span>
                </button>
              </form>
            ) : (
              <div className="success-stack">
                <FeedbackMessage tone="success" title="Interests registered locally">
                  Reference {registration.referenceNumber} lists {registration.selectedCategories.length}{' '}
                  selected category
                  {registration.selectedCategories.length === 1 ? '' : 'ies'} for this demo.
                </FeedbackMessage>
                <div className="registration-confirmation">
                  <p className="mono-label">{registration.referenceNumber}</p>
                  <h3>{registration.fullName}</h3>
                  <p className="registration-contact-info">
                    {registration.phoneNumber} &bull; {registration.email}
                  </p>
                  <ul>
                    {registration.selectedCategories.map((category) => (
                      <li key={category.id}>{category.name}</li>
                    ))}
                  </ul>
                </div>
                <div className="action-row">
                  <button className="button button--primary" type="button" onClick={editRegistration}>
                    <Edit3 size={18} aria-hidden="true" />
                    Edit Registration
                  </button>
                  <button className="button button--outline" type="button" onClick={resetRegistration}>
                    <RefreshCcw size={18} aria-hidden="true" />
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <StudentCardModal isOpen={showCardGuide} onClose={handleCloseCardGuide} />
    </section>
  );
}

import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clapperboard,
  Code2,
  Cpu,
  Edit3,
  HelpCircle,
  Layers,
  Printer,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserCheck,
  Wrench,
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { categories } from '../config/categories.js';
import {
  clearCategoryRegistration,
  getCategoryRegistration,
  registerCategoryTrack,
} from '../services/registrationService.js';
import {
  ALLOWED_SPECIALITES,
  ALLOWED_STUDY_LEVELS,
  sanitizeText,
  validateEmail,
  validateExperienceLevel,
  validateFullName,
  validateMotivation,
  validatePhoneNumber,
  validateRegistrationNumber,
  validateSpecialite,
  validateStudyLevel,
  validateSubTrack,
} from '../utils/security.js';
import { Link } from '../router.jsx';
import FeedbackMessage from './FeedbackMessage.jsx';
import FormField from './FormField.jsx';
import StudentCardModal from './StudentCardModal.jsx';

const iconMap = {
  Brain,
  Clapperboard,
  Code2,
  Cpu,
  ShieldCheck,
  Smartphone,
};

const studyLevels = ALLOWED_STUDY_LEVELS;
const SPECIALITES = ALLOWED_SPECIALITES;

const experienceLevels = [
  { id: 'beginner', label: 'Beginner', desc: 'New to this field, eager to learn fundamentals' },
  { id: 'intermediate', label: 'Intermediate', desc: 'Familiar with basics, built mini projects' },
  { id: 'advanced', label: 'Advanced', desc: 'Experienced, looking for deep dive challenges' },
];

export default function CategoryRegisterPage({ category }) {
  const Icon = iconMap[category.icon] ?? Code2;

  const [registration, setRegistration] = useState(() => getCategoryRegistration(category.id));
  const [showCardGuide, setShowCardGuide] = useState(false);
  const suppressCardGuideRef = useRef(false);

  const [values, setValues] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    registrationNumber: '',
    studyLevel: '',
    specialite: '',
    selectedSubTrack: category.subTracks[0] || '',
    experienceLevel: 'beginner',
    motivation: '',
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fieldRefs = {
    fullName: useRef(null),
    phoneNumber: useRef(null),
    email: useRef(null),
    registrationNumber: useRef(null),
    studyLevel: useRef(null),
    specialite: useRef(null),
    motivation: useRef(null),
    consent: useRef(null),
  };

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

  // Sync state if category route changes
  useEffect(() => {
    document.title = `${category.name} Registration | InfoBrains Open Day`;
    const existing = getCategoryRegistration(category.id);
    setRegistration(existing);
    if (!existing) {
      setValues((current) => ({
        ...current,
        selectedSubTrack: category.subTracks[0] || '',
      }));
    }
    setErrors({});
  }, [category.id, category.name, category.subTracks]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubTrackSelect(subTrack) {
    setValues((prev) => ({ ...prev, selectedSubTrack: subTrack }));
  }

  function handleExperienceSelect(expId) {
    setValues((prev) => ({ ...prev, experienceLevel: expId }));
  }

  function validate() {
    const errs = {};

    const subTrackErr = validateSubTrack(values.selectedSubTrack, category);
    if (subTrackErr) errs.selectedSubTrack = subTrackErr;

    const nameErr = validateFullName(values.fullName);
    if (nameErr) errs.fullName = nameErr;

    const phoneErr = validatePhoneNumber(values.phoneNumber, true);
    if (phoneErr) errs.phoneNumber = phoneErr;

    const emailErr = validateEmail(values.email, true);
    if (emailErr) errs.email = emailErr;

    const regErr = validateRegistrationNumber(values.registrationNumber);
    if (regErr) errs.registrationNumber = regErr;

    const studyErr = validateStudyLevel(values.studyLevel);
    if (studyErr) errs.studyLevel = studyErr;

    const specErr = validateSpecialite(values.specialite);
    if (specErr) errs.specialite = specErr;

    const expErr = validateExperienceLevel(values.experienceLevel);
    if (expErr) errs.experienceLevel = expErr;

    const motErr = validateMotivation(values.motivation);
    if (motErr) errs.motivation = motErr;

    if (!values.consent) {
      errs.consent = 'Please confirm your registration commitment.';
    }
    return errs;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.keys(validationErrors)[0];
      requestAnimationFrame(() => fieldRefs[firstError]?.current?.focus());
      return;
    }

    setIsSubmitting(true);
    try {
      const sanitized = {
        selectedSubTrack: values.selectedSubTrack,
        fullName: sanitizeText(values.fullName),
        phoneNumber: sanitizeText(values.phoneNumber),
        email: sanitizeText(values.email),
        registrationNumber: sanitizeText(values.registrationNumber),
        studyLevel: values.studyLevel,
        specialite: values.specialite,
        experienceLevel: values.experienceLevel,
        motivation: values.motivation ? sanitizeText(values.motivation) : '',
        consent: Boolean(values.consent),
      };
      const saved = await registerCategoryTrack(category, sanitized);
      setRegistration(saved);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit() {
    if (registration) {
      setValues({
        fullName: registration.fullName || '',
        phoneNumber: registration.phoneNumber || '',
        email: registration.email || '',
        registrationNumber: registration.registrationNumber || '',
        studyLevel: registration.studyLevel || 'Licence 1 (L1)',
        specialite: registration.specialite || '',
        selectedSubTrack: registration.selectedSubTrack || category.subTracks[0] || '',
        experienceLevel: registration.experienceLevel || 'beginner',
        motivation: registration.motivation || '',
        consent: true,
      });
    }
    setRegistration(null);
  }

  function handleReset() {
    clearCategoryRegistration(category.id);
    setRegistration(null);
    setValues({
      fullName: '',
      phoneNumber: '',
      email: '',
      registrationNumber: '',
      studyLevel: 'Licence 1 (L1)',
      specialite: '',
      selectedSubTrack: category.subTracks[0] || '',
      experienceLevel: 'beginner',
      motivation: '',
      consent: false,
    });
    setErrors({});
  }

  const categoryCssVariables = {
    '--cat-primary': category.color,
    '--cat-accent': category.accentColor,
    '--cat-tint': category.bgTint,
    '--cat-glow': category.glowColor,
  };

  const formattedDate = useMemo(() => {
    if (!registration?.submittedAt) return '';
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(registration.submittedAt));
  }, [registration]);

  return (
    <div className={`category-page category-page--${category.id}`} style={categoryCssVariables}>
      {/* Top navigation bar */}
      <nav className="category-switcher-bar no-print" aria-label="Page navigation">
        <div className="section-inner category-switcher-inner">
          <Link to="/" className="switcher-back-link">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Return to Home</span>
          </Link>
        </div>
      </nav>

      {/* Main hero banner for the category */}
      <header className="category-hero-banner">
        <div className="category-hero-backdrop" />
        <div className="section-inner category-hero-content">
          <div className="category-tag-badge">
            <Icon size={18} aria-hidden="true" />
            <span>{category.name} Track</span>
          </div>
          <h1 className="category-hero-title">
            Register for the <span className="category-title-accent">{category.shortName}</span> Experience
          </h1>
          <p className="category-hero-description">{category.description}</p>
        </div>
      </header>

      {/* Main content area */}
      <main className="section-inner category-main-grid">
        {/* Left Column: Track Details & Curriculum */}
        <aside className="category-details-panel">
          <div className="details-card">
            <div className="details-header">
              <div className="details-icon-box">
                <Icon size={28} aria-hidden="true" />
              </div>
              <div>
                <h2 className="details-title">{category.name}</h2>
                <p className="details-tagline">{category.tagline}</p>
              </div>
            </div>

            <hr className="details-divider" />

            <div className="details-section">
              <h3 className="details-heading">
                <Layers size={16} aria-hidden="true" />
                <span>Specialized Sub-Tracks</span>
              </h3>
              <ul className="details-list">
                {category.subTracks.map((track, i) => (
                  <li key={i}>
                    <CheckCircle2 size={16} className="details-check-icon" aria-hidden="true" />
                    <span>{track}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="details-section">
              <h3 className="details-heading">
                <Sparkles size={16} aria-hidden="true" />
                <span>What You'll Explore</span>
              </h3>
              <ul className="details-list">
                {category.highlights.map((highlight, i) => (
                  <li key={i}>
                    <span className="details-bullet" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="details-section">
              <h3 className="details-heading">
                <Wrench size={16} aria-hidden="true" />
                <span>Tools & Technologies</span>
              </h3>
              <div className="tech-chip-grid">
                {category.tools.map((tool) => (
                  <span key={tool} className="tech-chip">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="details-notice">
              <p>
                <strong>Open to all academic years.</strong> Mentors will guide you through hands-on challenges and live demos tailored to your experience.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Column: Registration Form OR Confirmation Pass */}
        <section className="category-form-section">
          {!registration ? (
            <div className="category-form-card">
              <div className="form-card-header">
                <h2>Join {category.name}</h2>
                <p>Fill out your attendee profile to secure your spot in this specialized domain.</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-subtrack-selection">
                  <label className="field-label-group">Choose your focus area</label>
                  <div className="subtrack-options">
                    {category.subTracks.map((track) => {
                      const isSelected = values.selectedSubTrack === track;
                      return (
                        <button
                          key={track}
                          type="button"
                          className={`subtrack-btn ${isSelected ? 'subtrack-btn--selected' : ''}`}
                          onClick={() => handleSubTrackSelect(track)}
                        >
                          <span className="subtrack-radio">
                            {isSelected && <span className="subtrack-radio-inner" />}
                          </span>
                          <span className="subtrack-text">{track}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="form-row-2">
                  <FormField
                    id="cat-reg-name"
                    name="fullName"
                    label="Full Name"
                    autoComplete="name"
                    value={values.fullName}
                    onChange={updateField}
                    error={errors.fullName}
                    ref={fieldRefs.fullName}
                    placeholder="e.g. Rayan Chen"
                    maxLength={60}
                    required
                  />

                  <FormField
                    id="cat-reg-phone"
                    name="phoneNumber"
                    label="Phone Number"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={values.phoneNumber}
                    onChange={updateField}
                    error={errors.phoneNumber}
                    ref={fieldRefs.phoneNumber}
                    placeholder="e.g. 0555 12 34 56 or +213 555 12 34 56"
                    maxLength={22}
                    required
                  />
                </div>

                <div className="form-row-2">
                  <FormField
                    id="cat-reg-number"
                    name="registrationNumber"
                    label="University Registration Number"
                    autoComplete="off"
                    value={values.registrationNumber}
                    onChange={updateField}
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
                    id="cat-reg-email"
                    name="email"
                    label="Email Address"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={updateField}
                    error={errors.email}
                    ref={fieldRefs.email}
                    placeholder="student@university.edu"
                    maxLength={100}
                    required
                  />
                </div>

                  <div className="field">
                    <label htmlFor="cat-reg-level">Study Level / Academic Year <span aria-hidden="true"> *</span></label>
                    <select
                      id="cat-reg-level"
                      name="studyLevel"
                      className="select-field"
                      value={values.studyLevel}
                      onChange={updateField}
                      ref={fieldRefs.studyLevel}
                      aria-required="true"
                      aria-invalid={errors.studyLevel ? 'true' : 'false'}
                      aria-describedby={errors.studyLevel ? 'cat-level-error' : undefined}
                    >
                      <option value="" disabled>Select academic year…</option>
                      {studyLevels.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                    {errors.studyLevel && (
                      <p id="cat-level-error" className="field-error" role="alert">
                        {errors.studyLevel}
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="cat-reg-specialite">Spécialité <span aria-hidden="true"> *</span></label>
                    <select
                      id="cat-reg-specialite"
                      name="specialite"
                      className="select-field"
                      value={values.specialite}
                      onChange={updateField}
                      ref={fieldRefs.specialite}
                      aria-required="true"
                      aria-invalid={errors.specialite ? 'true' : 'false'}
                      aria-describedby={errors.specialite ? 'cat-specialite-error' : undefined}
                    >
                      <option value="" disabled>Select your speciality…</option>
                      {SPECIALITES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.specialite && (
                      <p id="cat-specialite-error" className="field-error" role="alert">
                        {errors.specialite}
                      </p>
                    )}
                  </div>

                <div className="experience-level-group">
                  <label className="field-label-group">Prior Experience in {category.shortName}</label>
                  <div className="experience-cards">
                    {experienceLevels.map((exp) => {
                      const isSelected = values.experienceLevel === exp.id;
                      return (
                        <button
                          key={exp.id}
                          type="button"
                          className={`exp-card ${isSelected ? 'exp-card--selected' : ''}`}
                          onClick={() => handleExperienceSelect(exp.id)}
                        >
                          <div className="exp-card-top">
                            <span className="exp-radio">
                              {isSelected && <span className="exp-radio-inner" />}
                            </span>
                            <strong>{exp.label}</strong>
                          </div>
                          <p>{exp.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="cat-reg-motivation">
                    What would you like to achieve in this track? <span className="optional-tag">(Optional)</span>
                  </label>
                  <textarea
                    id="cat-reg-motivation"
                    name="motivation"
                    rows="3"
                    ref={fieldRefs.motivation}
                    maxLength={500}
                    value={values.motivation}
                    onChange={updateField}
                    placeholder="Mention specific projects you want to build or skills you want to develop..."
                    aria-invalid={errors.motivation ? 'true' : 'false'}
                    aria-describedby={errors.motivation ? 'cat-reg-motivation-error' : undefined}
                  />
                  {errors.motivation && (
                    <p id="cat-reg-motivation-error" className="field-error" role="alert">
                      {errors.motivation}
                    </p>
                  )}
                </div>

                <div className="check-field">
                  <input
                    id="cat-reg-consent"
                    name="consent"
                    type="checkbox"
                    checked={values.consent}
                    onChange={updateField}
                    aria-invalid={errors.consent ? 'true' : 'false'}
                    aria-describedby={errors.consent ? 'cat-reg-consent-error' : undefined}
                    ref={fieldRefs.consent}
                  />
                  <label htmlFor="cat-reg-consent">
                    I confirm my participation in the <strong>{category.name}</strong> track and agree to abide by InfoBrains Open Day guidelines.
                  </label>
                </div>
                {errors.consent && (
                  <p className="field-error check-error" id="cat-reg-consent-error" role="alert">
                    {errors.consent}
                  </p>
                )}

                <button
                  type="submit"
                  className="button button--full category-submit-btn"
                  disabled={isSubmitting}
                >
                  <UserCheck size={18} aria-hidden="true" />
                  <span>{isSubmitting ? 'Registering...' : `Confirm Registration in ${category.shortName}`}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </form>
            </div>
          ) : (
            <div className="category-success-container">
              <FeedbackMessage
                tone="success"
                title={`You are registered for ${category.name}!`}
              >
                Your registration pass is confirmed. Present this reference number or print your ticket for the event session.
              </FeedbackMessage>

              {/* Digital Boarding Pass Ticket */}
              <div className="boarding-pass">
                <div className="pass-header">
                  <div className="pass-brand">
                    <Icon size={22} className="pass-category-icon" aria-hidden="true" />
                    <div>
                      <span className="pass-kicker">INFOBRAINS OPEN DAY 2026</span>
                      <h3 className="pass-track-title">{category.name}</h3>
                    </div>
                  </div>
                  <div className="pass-badge">
                    <span className="pass-status-pill">OFFICIAL PASS</span>
                    <span className="pass-ref-number">{registration.referenceNumber}</span>
                  </div>
                </div>

                <div className="pass-body">
                  <div className="pass-grid">
                    <div className="pass-field">
                      <span className="pass-label">ATTENDEE NAME</span>
                      <span className="pass-val pass-val--highlight">{registration.fullName}</span>
                    </div>

                    <div className="pass-field">
                      <span className="pass-label">STUDENT / REG ID</span>
                      <span className="pass-val">{registration.registrationNumber}</span>
                    </div>

                    <div className="pass-field">
                      <span className="pass-label">SELECTED FOCUS AREA</span>
                      <span className="pass-val">{registration.selectedSubTrack || category.subTracks[0]}</span>
                    </div>

                    <div className="pass-field">
                      <span className="pass-label">ACADEMIC LEVEL</span>
                      <span className="pass-val">{registration.studyLevel}</span>
                    </div>

                    <div className="pass-field">
                      <span className="pass-label">PHONE NUMBER</span>
                      <span className="pass-val">{registration.phoneNumber}</span>
                    </div>

                    <div className="pass-field">
                      <span className="pass-label">REGISTERED EMAIL</span>
                      <span className="pass-val">{registration.email}</span>
                    </div>

                    <div className="pass-field">
                      <span className="pass-label">SUBMISSION TIME</span>
                      <span className="pass-val pass-val--mono">{formattedDate || 'Just now'}</span>
                    </div>
                  </div>

                  {registration.motivation && (
                    <div className="pass-notes">
                      <span className="pass-label">ASPIRATION / GOAL</span>
                      <p className="pass-val--notes">{registration.motivation}</p>
                    </div>
                  )}

                  <div className="pass-barcode-section">
                    <div className="barcode-bars" aria-hidden="true">
                      {Array.from({ length: 44 }).map((_, i) => (
                        <span
                          key={i}
                          className="barcode-bar"
                          style={{
                            width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1) * 2}px`,
                            opacity: (i % 5 === 0 ? 0.4 : 0.85),
                          }}
                        />
                      ))}
                    </div>
                    <span className="barcode-code">{registration.referenceNumber}</span>
                  </div>
                </div>
              </div>

              {/* Pass Actions */}
              <div className="pass-actions no-print">
                <button
                  type="button"
                  className="button button--primary"
                  onClick={() => window.print()}
                >
                  <Printer size={18} aria-hidden="true" />
                  <span>Print / Save Pass</span>
                </button>

                <button
                  type="button"
                  className="button button--outline"
                  onClick={handleEdit}
                >
                  <Edit3 size={18} aria-hidden="true" />
                  <span>Edit Details</span>
                </button>

                <button
                  type="button"
                  className="button button--outline"
                  onClick={handleReset}
                >
                  <RefreshCcw size={18} aria-hidden="true" />
                  <span>Register Another</span>
                </button>
              </div>

              {/* Other Tracks Quick Selector */}
              <div className="other-tracks-suggestion no-print">
                <h3>Explore other tracks</h3>
                <div className="other-tracks-grid">
                  {categories
                    .filter((cat) => cat.id !== category.id)
                    .map((otherCat) => (
                      <Link
                        key={otherCat.id}
                        to={otherCat.route}
                        className="other-track-card"
                        style={{ '--other-cat-color': otherCat.color }}
                      >
                        <span className="other-track-dot" />
                        <span className="other-track-name">{otherCat.name}</span>
                        <ArrowRight size={14} className="other-track-arrow" aria-hidden="true" />
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <StudentCardModal isOpen={showCardGuide} onClose={handleCloseCardGuide} />
    </div>
  );
}

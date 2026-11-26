import React, { useRef, useState } from 'react';
import styles from './RegistrationForm.module.css';

const cities = ['Hyderabad', 'Pune', 'Bengaluru', 'Chennai', 'Kochi', 'Ahmedabad'];
const initialValues = {
  fullName: '',
  email: '',
  city: '',
  layout: '',
  consent: false,
};

export default function RegistrationForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const errorSummaryRef = useRef(null);

  function validate(formValues) {
    const nextErrors = {};
    if (formValues.fullName.trim().length < 2) {
      nextErrors.fullName = 'Enter your name using at least 2 characters.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email.trim())) {
      nextErrors.email = 'Enter an email address in a valid format.';
    }
    if (!cities.includes(formValues.city)) nextErrors.city = 'Choose a city from the list.';
    if (!formValues.consent) nextErrors.consent = 'Confirm consent before sending your enquiry.';
    return nextErrors;
  }

  function handleChange(event) {
    const {
      name,
      type,
      checked,
      value,
    } = event.target;
    const nextValues = {
      ...values,
      [name]: type === 'checkbox' ? checked : value,
    };

    setValues(nextValues);
    setErrors((currentErrors) => {
      if (!currentErrors[name]) return currentErrors;
      const nextErrors = { ...currentErrors };
      const fieldError = validate(nextValues)[name];
      if (fieldError) nextErrors[name] = fieldError;
      else delete nextErrors[name];
      return nextErrors;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (submitted) return;

    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    setErrors({});
    setValues(initialValues);
    setSubmitted(true);
  }

  const fields = [
    ['fullName', 'Full name'],
    ['email', 'Email address'],
    ['city', 'Preferred city'],
    ['consent', 'Consent'],
  ];

  return (
    <section id="enquire" className={styles.section} aria-labelledby="enquiry-title">
      <div className={styles.intro}>
        <p className={styles.eyebrow}>Start a conversation</p>
        <h2 id="enquiry-title">Find your next move</h2>
        <p className={styles.support}>
          Tell us what you are looking for. We will guide the next conversation.
        </p>
        <p className={styles.note}>No payment or account creation required.</p>
      </div>
      <div className={styles.formColumn}>
        {Object.keys(errors).length > 0 && (
          <div
            className={styles.errorSummary}
            ref={errorSummaryRef}
            role="alert"
            tabIndex="-1"
            aria-labelledby="error-summary-title"
          >
            <h3 id="error-summary-title">There is a problem</h3>
            <ul>
              {fields.filter(([name]) => errors[name]).map(([name]) => (
                <li key={name}><a href={`#${name}`}>{errors[name]}</a></li>
              ))}
            </ul>
          </div>
        )}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              name="fullName"
              required
              autoComplete="name"
              value={values.fullName}
              onChange={handleChange}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            />
            {errors.fullName && <p className={styles.error} id="fullName-error">{errors.fullName}</p>}
          </div>
          <div className={styles.field}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <p className={styles.error} id="email-error">{errors.email}</p>}
          </div>
          <div className={styles.field}>
            <label htmlFor="city">Preferred city</label>
            <select
              id="city"
              name="city"
              required
              value={values.city}
              onChange={handleChange}
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? 'city-error' : undefined}
            >
              <option value="">Select a city</option>
              {cities.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
            {errors.city && <p className={styles.error} id="city-error">{errors.city}</p>}
          </div>
          <div className={styles.field}>
            <label htmlFor="layout">
              Home layout
              {' '}
              <span>(optional)</span>
            </label>
            <select id="layout" name="layout" value={values.layout} onChange={handleChange}>
              <option value="">Any layout</option>
              <option value="2 BHK">2 BHK</option>
              <option value="3 BHK">3 BHK</option>
              <option value="4 BHK">4 BHK</option>
            </select>
          </div>
          <div className={styles.consentField}>
            <input
              id="consent"
              name="consent"
              type="checkbox"
              required
              checked={values.consent}
              onChange={handleChange}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? 'consent-error' : undefined}
            />
            <div>
              <label htmlFor="consent">I agree to be contacted about my enquiry.</label>
              {errors.consent && <p className={styles.error} id="consent-error">{errors.consent}</p>}
            </div>
          </div>
          <button className={styles.submitButton} type="submit" disabled={submitted}>
            {submitted ? 'Enquiry checked' : 'Send enquiry'}
          </button>
          <p className={styles.privacyNote}>
            This demo checks your details in this browser only. No message has been sent.
          </p>
          <p className={styles.success} role="status" aria-live="polite">
            {submitted ? 'Thanks — your enquiry details passed the form check. No message has been sent.' : ''}
          </p>
        </form>
      </div>
    </section>
  );
}

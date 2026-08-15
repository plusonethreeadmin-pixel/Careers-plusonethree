import { useCallback, useId, useState } from 'react'
import {
  LOCATION_OPTIONS,
  ROLE_OPTIONS,
  SITE_COPY,
} from '../constants/site'
import {
  getApplicationValidationError,
  isApplicationDuplicateError,
  submitApplication,
  WHY_YOU_MAX,
} from '../lib/careers'
import CareerSelect from './CareerSelect'

const INITIAL_FORM = {
  fullName: '',
  contactNumber: '',
  email: '',
  linkedin: '',
  social: '',
  role: '',
  location: '',
  whyYou: '',
}

function RequiredMark() {
  return (
    <span className="application-form__required" aria-hidden="true">
      *
    </span>
  )
}

export default function ApplicationForm() {
  const formId = useId()
  const [form, setForm] = useState(INITIAL_FORM)
  const [openSelect, setOpenSelect] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const updateField = useCallback((field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setSubmitError('')
    setSubmitSuccess(false)
  }, [])

  const handleSelectOpen = useCallback((field, isOpen) => {
    setOpenSelect(isOpen ? field : null)
  }, [])

  const whyYouPlaceholder =
    form.role === 'other'
      ? SITE_COPY.formWhyYouPlaceholderOther
      : SITE_COPY.formWhyYouPlaceholder

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    setSubmitSuccess(false)

    const validationError = getApplicationValidationError(form)
    if (validationError) {
      setSubmitError(validationError)
      return
    }

    setIsSubmitting(true)

    try {
      await submitApplication(form)
      setForm(INITIAL_FORM)
      setSubmitSuccess(true)
    } catch (err) {
      if (isApplicationDuplicateError(err)) {
        setSubmitError('You already applied with this email address.')
      } else {
        setSubmitError('Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="application-form" aria-labelledby={`${formId}-title`}>
      <div className="application-form__inner">
        <header className="application-form__header">
          <h2 id={`${formId}-title`} className="application-form__title">
            {SITE_COPY.formTitle}
          </h2>
          <p className="application-form__subtitle">{SITE_COPY.formSubtitle}</p>
        </header>

        <form className="application-form__form" onSubmit={handleSubmit} noValidate>
          <div className="application-form__fields">
          <div className="application-form__row application-form__row--split">
            <div className="application-form__field">
              <label className="application-form__label" htmlFor={`${formId}-full-name`}>
                Full Name <RequiredMark />
              </label>
              <input
                id={`${formId}-full-name`}
                className="application-form__input"
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={(event) => updateField('fullName', event.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </div>
            <div className="application-form__field">
              <label className="application-form__label" htmlFor={`${formId}-contact`}>
                Contact Number <RequiredMark />
              </label>
              <input
                id={`${formId}-contact`}
                className="application-form__input"
                type="tel"
                name="contactNumber"
                value={form.contactNumber}
                onChange={(event) => updateField('contactNumber', event.target.value)}
                placeholder="Enter your contact number"
                autoComplete="tel"
                required
              />
            </div>
          </div>

          <div className="application-form__row application-form__row--split">
            <div className="application-form__field">
              <label className="application-form__label" htmlFor={`${formId}-email`}>
                Email Address <RequiredMark />
              </label>
              <input
                id={`${formId}-email`}
                className="application-form__input"
                type="email"
                name="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="Enter your email address"
                autoComplete="email"
                required
              />
            </div>
            <div className="application-form__field">
              <label className="application-form__label" htmlFor={`${formId}-linkedin`}>
                LinkedIn Profile <RequiredMark />
              </label>
              <input
                id={`${formId}-linkedin`}
                className="application-form__input"
                type="url"
                name="linkedin"
                value={form.linkedin}
                onChange={(event) => updateField('linkedin', event.target.value)}
                placeholder="Enter your LinkedIn profile URL"
                required
              />
            </div>
          </div>

          <div className="application-form__row">
            <div className="application-form__field">
              <label className="application-form__label" htmlFor={`${formId}-social`}>
                Instagram / X (Optional)
              </label>
              <input
                id={`${formId}-social`}
                className="application-form__input"
                type="text"
                name="social"
                value={form.social}
                onChange={(event) => updateField('social', event.target.value)}
                placeholder="Enter your Instagram or X handle"
              />
            </div>
          </div>

          <div className="application-form__row application-form__row--split">
            <div className="application-form__field">
              <label className="application-form__label" htmlFor={`${formId}-role`}>
                Role <RequiredMark />
              </label>
              <CareerSelect
                id={`${formId}-role`}
                label="Role"
                placeholder="Select a role"
                options={ROLE_OPTIONS}
                value={form.role}
                onChange={(value) => updateField('role', value)}
                required
                isOpen={openSelect === 'role'}
                onOpenChange={(isOpen) => handleSelectOpen('role', isOpen)}
              />
            </div>
            <div className="application-form__field">
              <label className="application-form__label" htmlFor={`${formId}-location`}>
                {SITE_COPY.formWorkModeLabel} <RequiredMark />
              </label>
              <CareerSelect
                id={`${formId}-location`}
                label={SITE_COPY.formWorkModeLabel}
                placeholder="Select work mode"
                options={LOCATION_OPTIONS}
                value={form.location}
                onChange={(value) => updateField('location', value)}
                required
                isOpen={openSelect === 'location'}
                onOpenChange={(isOpen) => handleSelectOpen('location', isOpen)}
              />
            </div>
          </div>

          <div className="application-form__row application-form__row--grow">
            <div className="application-form__field application-form__field--textarea">
              <label className="application-form__label" htmlFor={`${formId}-why`}>
                Why You? <RequiredMark />
              </label>
              <div className="application-form__textarea-wrap">
                <textarea
                  id={`${formId}-why`}
                  className="application-form__textarea"
                  name="whyYou"
                  value={form.whyYou}
                  onChange={(event) =>
                    updateField('whyYou', event.target.value.slice(0, WHY_YOU_MAX))
                  }
                  placeholder={whyYouPlaceholder}
                  required
                />
                <span className="application-form__char-count" aria-live="polite">
                  {form.whyYou.length}/{WHY_YOU_MAX}
                </span>
              </div>
            </div>
          </div>
          </div>

          <div className="application-form__actions">
          {submitSuccess ? (
            <p className="application-form__error" role="status" style={{ color: 'inherit' }}>
              Application submitted. We will be in touch.
            </p>
          ) : null}
          {submitError ? (
            <p className="application-form__error" role="alert">
              {submitError}
            </p>
          ) : null}

          <button
            type="submit"
            className="waitlist-btn application-form__submit"
            disabled={isSubmitting}
          >
            <span className="waitlist-btn__label">{SITE_COPY.formSubmit}</span>
          </button>
          </div>
        </form>
      </div>
    </section>
  )
}

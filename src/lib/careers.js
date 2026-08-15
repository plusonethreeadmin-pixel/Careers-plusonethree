import { LOCATION_OPTIONS, ROLE_OPTIONS } from '../constants/site'

export const WHY_YOU_MIN_WORDS = 15
export const WHY_YOU_MAX = 500

export function countWords(text) {
  if (!text?.trim()) return 0
  return text.trim().split(/\s+/).length
}
const PHONE_DIGIT_LENGTH = 10
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LINKEDIN_REGEX = /^https?:\/\/.+/i

const ROLE_VALUES = new Set(ROLE_OPTIONS.map((o) => o.value))
const WORK_MODE_VALUES = new Set(LOCATION_OPTIONS.map((o) => o.value))

const API_BASE = (import.meta.env.VITE_CAREERS_API_URL || '').replace(/\/$/, '')

function requireApiBase() {
  if (!API_BASE) {
    throw new Error('Missing VITE_CAREERS_API_URL')
  }
  return API_BASE
}

export function getApplicationValidationError(form) {
  const fullName = form.fullName?.trim()
  const contactNumber = form.contactNumber?.trim()
  const email = form.email?.trim()
  const linkedin = form.linkedin?.trim()
  const role = form.role
  const workMode = form.location
  const whyYou = form.whyYou?.trim()

  if (!fullName) return 'Please enter your full name.'
  if (!contactNumber) return 'Please enter your contact number.'
  const digits = contactNumber.replace(/\D/g, '')
  if (digits.length !== PHONE_DIGIT_LENGTH) {
    return 'Please enter a valid 10-digit phone number.'
  }
  if (!email) return 'Please enter your email address.'
  if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address.'
  if (!linkedin) return 'Please enter your LinkedIn profile URL.'
  if (!LINKEDIN_REGEX.test(linkedin)) return 'Please enter a valid LinkedIn URL.'
  if (!role || !ROLE_VALUES.has(role)) return 'Please select a role.'
  if (!workMode || !WORK_MODE_VALUES.has(workMode)) {
    return 'Please select a work mode.'
  }
  if (!whyYou) return 'Please tell us why you are the right fit.'
  const wordCount = countWords(whyYou)
  if (wordCount < WHY_YOU_MIN_WORDS) {
    return `Why You must be at least ${WHY_YOU_MIN_WORDS} words.`
  }
  if (whyYou.length > WHY_YOU_MAX) {
    return `Why You must be ${WHY_YOU_MAX} characters or fewer.`
  }
  return null
}

export const APPLICATION_DUPLICATE_CODE = 'DUPLICATE'

export function isApplicationDuplicateError(error) {
  return error?.code === APPLICATION_DUPLICATE_CODE || error?.status === 409
}

export async function submitApplication(form) {
  const base = requireApiBase()
  const response = await fetch(`${base}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: form.fullName.trim(),
      contactNumber: form.contactNumber.trim(),
      email: form.email.trim().toLowerCase(),
      linkedin: form.linkedin.trim(),
      social: form.social?.trim() || undefined,
      role: form.role,
      workMode: form.location,
      whyYou: form.whyYou.trim(),
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (response.status === 409 || data.error === 'duplicate') {
    const err = new Error('duplicate')
    err.code = APPLICATION_DUPLICATE_CODE
    err.status = 409
    throw err
  }

  if (!response.ok) {
    const err = new Error(data.error ?? 'submit_failed')
    err.status = response.status
    throw err
  }

  return { success: true }
}

import { useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import { ASSETS } from '../constants/assets'
import { SITE_COPY } from '../constants/site'
import '../styles/application-success-modal.css'

function SuccessCheckIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 20L18 26L28 14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ApplicationSuccessModal({ isOpen, onClose }) {
  const titleId = useId()

  useEffect(() => {
    if (!isOpen) return undefined

    document.body.classList.add('application-success-modal-open')

    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.classList.remove('application-success-modal-open')
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="application-success-modal application-success-modal--visible">
      <button
        type="button"
        className="application-success-modal__backdrop"
        aria-label="Close success dialog"
        onClick={onClose}
      />

      <div
        className="application-success-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className="application-success-modal__close"
          aria-label="Close"
          onClick={onClose}
        >
          <span aria-hidden="true" />
        </button>

        <div className="application-success-modal__content">
          <div className="application-success-modal__success">
            <div className="application-success-modal__success-main">
              <div className="application-success-modal__success-icon" aria-hidden="true">
                <SuccessCheckIcon />
              </div>

              <h2 id={titleId} className="application-success-modal__success-title">
                {SITE_COPY.applicationSuccessTitle}
              </h2>

              <p className="application-success-modal__success-body">
                {SITE_COPY.applicationSuccessBodyLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            </div>

            <button
              type="button"
              className="application-success-modal__submit"
              onClick={onClose}
            >
              {SITE_COPY.applicationSuccessClose}
            </button>
          </div>
        </div>

        <div className="application-success-modal__logo" aria-hidden="true">
          <img
            src={ASSETS.logo}
            alt=""
            className="application-success-modal__logo-image"
            width={120}
            height={20}
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}

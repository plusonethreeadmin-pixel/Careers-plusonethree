import { useCallback, useEffect, useRef, useState } from 'react'

const EASTER_EGG_MESSAGE = 'Nice Try, Better luck next Time'
const EASTER_EGG_STYLE = 'font-size: 16px; color: #d4537e; font-weight: bold;'
const RESTORE_DELAY_MS = 400

const PROTECTED_SELECTOR =
  '.nav-desktop, .nav-desktop__links, .nav-link, .lock-btn, .nav-box'

function logEasterEgg() {
  console.log(`%c${EASTER_EGG_MESSAGE}`, EASTER_EGG_STYLE)
}

function isProtectedElement(node) {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) return false

  if (node.matches?.(PROTECTED_SELECTOR)) return true
  if (node.querySelector?.(PROTECTED_SELECTOR)) return true
  if (node.closest?.(PROTECTED_SELECTOR)) return true

  return false
}

function resetProtectedStyles(root) {
  root.querySelectorAll(PROTECTED_SELECTOR).forEach((el) => {
    el.removeAttribute('style')
    el.removeAttribute('hidden')
    el.removeAttribute('aria-hidden')
  })
}

export function useNavGuard(containerRef) {
  const [remountKey, setRemountKey] = useState(0)
  const restoringRef = useRef(false)

  const triggerGuard = useCallback(() => {
    if (restoringRef.current) return

    logEasterEgg()
    restoringRef.current = true

    const root = containerRef.current
    if (root) {
      resetProtectedStyles(root)
    }

    setRemountKey((key) => key + 1)

    window.setTimeout(() => {
      restoringRef.current = false
    }, RESTORE_DELAY_MS)
  }, [containerRef])

  useEffect(() => {
    const root = containerRef.current
    if (!root) return undefined

    const observer = new MutationObserver((mutations) => {
      if (restoringRef.current) return

      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.removedNodes) {
            if (isProtectedElement(node)) {
              triggerGuard()
              return
            }
          }
        }

        if (mutation.type === 'attributes' && isProtectedElement(mutation.target)) {
          triggerGuard()
          return
        }
      }
    })

    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'hidden', 'aria-hidden'],
    })

    return () => observer.disconnect()
  }, [containerRef, triggerGuard, remountKey])

  return remountKey
}

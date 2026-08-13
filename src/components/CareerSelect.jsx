import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import '../styles/waitlist-select.css'

function ChevronIcon() {
  return (
    <svg
      className="waitlist-select__chevron"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="waitlist-select__check" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function getMenuPosition(triggerEl, menuEl) {
  if (!triggerEl) return null

  const rect = triggerEl.getBoundingClientRect()
  const gap = 6
  const viewportPadding = 12
  const menuHeight = menuEl?.offsetHeight ?? 220
  const spaceBelow = window.innerHeight - rect.bottom - viewportPadding
  const spaceAbove = rect.top - viewportPadding
  const openUpward = spaceBelow < menuHeight && spaceAbove > spaceBelow

  const maxHeight = openUpward
    ? Math.max(120, spaceAbove - gap)
    : Math.max(120, spaceBelow - gap)

  return {
    position: 'fixed',
    left: rect.left,
    width: rect.width,
    top: openUpward ? undefined : rect.bottom + gap,
    bottom: openUpward ? window.innerHeight - rect.top + gap : undefined,
    maxHeight,
    zIndex: 200,
    openUpward,
  }
}

function toMenuStyle(position) {
  if (!position) return null
  const { openUpward, ...style } = position
  return style
}

export default function CareerSelect({
  id,
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
  required = false,
  isOpen = false,
  onOpenChange,
}) {
  const listboxId = useId()
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const [menuStyle, setMenuStyle] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [opensUpward, setOpensUpward] = useState(false)

  const selectedOption = options.find((option) => option.value === value)
  const displayLabel = selectedOption?.label ?? placeholder

  const updateMenuPosition = useCallback(() => {
    if (!isOpen) return
    const nextPosition = getMenuPosition(triggerRef.current, menuRef.current)
    if (nextPosition) {
      setOpensUpward(nextPosition.openUpward)
      setMenuStyle(toMenuStyle(nextPosition))
    }
  }, [isOpen])

  useLayoutEffect(() => {
    if (!isOpen) {
      setIsVisible(false)
      setMenuStyle(null)
      return undefined
    }

    updateMenuPosition()
    const frame = requestAnimationFrame(() => {
      updateMenuPosition()
      setIsVisible(true)
    })
    return () => cancelAnimationFrame(frame)
  }, [isOpen, updateMenuPosition])

  useLayoutEffect(() => {
    if (isOpen && isVisible) {
      updateMenuPosition()
    }
  }, [isOpen, isVisible, options.length, updateMenuPosition])

  useEffect(() => {
    if (!isOpen) return undefined

    const handlePointerDown = (event) => {
      if (
        rootRef.current?.contains(event.target) ||
        menuRef.current?.contains(event.target)
      ) {
        return
      }
      onOpenChange?.(false)
    }

    const handleReposition = () => updateMenuPosition()

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition, true)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition, true)
    }
  }, [isOpen, onOpenChange, updateMenuPosition])

  useEffect(() => {
    if (!isOpen) {
      setHighlightIndex(-1)
      return
    }

    const selectedIndex = options.findIndex((option) => option.value === value)
    setHighlightIndex(selectedIndex >= 0 ? selectedIndex : 0)
  }, [isOpen, options, value])

  const selectOption = (option) => {
    onChange(option.value)
    onOpenChange?.(false)
    triggerRef.current?.focus()
  }

  const handleTriggerKeyDown = (event) => {
    if (disabled) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen) {
          onOpenChange?.(true)
          return
        }
        setHighlightIndex((current) => Math.min(current + 1, options.length - 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!isOpen) {
          onOpenChange?.(true)
          return
        }
        setHighlightIndex((current) => Math.max(current - 1, 0))
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (!isOpen) {
          onOpenChange?.(true)
          return
        }
        if (highlightIndex >= 0 && options[highlightIndex]) {
          selectOption(options[highlightIndex])
        }
        break
      case 'Escape':
        if (isOpen) {
          event.preventDefault()
          event.stopPropagation()
          onOpenChange?.(false)
        }
        break
      case 'Home':
        if (isOpen) {
          event.preventDefault()
          setHighlightIndex(0)
        }
        break
      case 'End':
        if (isOpen) {
          event.preventDefault()
          setHighlightIndex(options.length - 1)
        }
        break
      default:
        break
    }
  }

  const menu =
    isOpen && menuStyle
      ? createPortal(
          <ul
            ref={menuRef}
            id={listboxId}
            role="listbox"
            aria-label={label}
            className={[
              'waitlist-select__menu',
              isVisible ? 'waitlist-select__menu--visible' : '',
              opensUpward ? 'waitlist-select__menu--upward' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={menuStyle}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value
              const isHighlighted = index === highlightIndex

              return (
                <li
                  key={option.value}
                  id={`${listboxId}-option-${option.value}`}
                  role="option"
                  aria-selected={isSelected}
                  className={[
                    'waitlist-select__option',
                    isSelected ? 'waitlist-select__option--selected' : '',
                    isHighlighted ? 'waitlist-select__option--highlighted' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onMouseEnter={() => setHighlightIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectOption(option)}
                >
                  <span className="waitlist-select__option-label">{option.label}</span>
                  {isSelected ? <CheckIcon /> : null}
                </li>
              )
            })}
          </ul>,
          document.body,
        )
      : null

  return (
    <div
      ref={rootRef}
      className={`waitlist-select${isOpen ? ' waitlist-select--open' : ''}${disabled ? ' waitlist-select--disabled' : ''}`}
    >
      <input
        type="text"
        className="visually-hidden"
        tabIndex={-1}
        aria-hidden="true"
        value={value}
        required={required}
        disabled={disabled}
        readOnly
      />
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        className="waitlist-select__trigger"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? listboxId : undefined}
        aria-label={label}
        aria-required={required || undefined}
        disabled={disabled}
        onClick={() => {
          if (!disabled) onOpenChange?.(!isOpen)
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        <span
          className={`waitlist-select__value${selectedOption ? '' : ' waitlist-select__value--placeholder'}`}
        >
          {displayLabel}
        </span>
        <ChevronIcon />
      </button>
      {menu}
    </div>
  )
}

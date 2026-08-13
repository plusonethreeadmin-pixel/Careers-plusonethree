// iOS Safari doesn't support `text-justify: inter-character`, so full-width
// letter distribution is done by splitting into per-character flex items.
export default function StretchText({ text, className = '' }) {
  return (
    <p className={`${className} text-stretch`} aria-label={text}>
      {[...text].map((char, i) => (
        <span key={i} aria-hidden="true">
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </p>
  )
}

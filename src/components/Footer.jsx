import { SITE_COPY } from '../constants/site'

export default function Footer() {
  return (
    <footer className="site-footer footer-glass">
      <div className="footer-inner">
        <p className="copyright">
          {SITE_COPY.copyrightLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        <p className="footer-tagline">{SITE_COPY.footerTagline}</p>
      </div>
    </footer>
  )
}

import { SITE_COPY } from '../constants/site'
import { ASSETS } from '../constants/assets'

export default function Header() {
  return (
    <header className="site-header header-glass">
      <div className="header-inner">
        <a href="/" className="logo-link" aria-label={`${SITE_COPY.brandName} home`}>
          <img
            src={ASSETS.logo}
            alt={SITE_COPY.brandName}
            className="logo"
            width={2839}
            height={356}
          />
        </a>
      </div>
    </header>
  )
}

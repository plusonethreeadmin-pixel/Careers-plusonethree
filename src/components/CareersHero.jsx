import { SITE_COPY } from '../constants/site'
import StretchText from './StretchText'

export default function CareersHero() {
  return (
    <section className="hero careers-hero">
      <div className="hero-content">
        <div className="hero-heading">
          <h1 className="display-title">
            <span>{SITE_COPY.careersTitle}</span>
          </h1>
          <StretchText className="tagline" text={SITE_COPY.careersTagline} />
        </div>
        <p className="careers-hero__body">{SITE_COPY.careersBody}</p>
      </div>
    </section>
  )
}

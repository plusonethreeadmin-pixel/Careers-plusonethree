import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroLogoLayer from '../components/HeroLogoLayer'
import BrandGradientLayer from '../components/BrandGradientLayer'
import CareersHero from '../components/CareersHero'
import ApplicationForm from '../components/ApplicationForm'

import '../styles/background.css'
import '../styles/typography.css'
import '../styles/layout.css'
import '../styles/waitlist-select.css'
import '../styles/careers-page.css'
import '../styles/careers-form.css'

export default function CareersPage() {
  return (
    <div className="page page--careers">
      <div className="blend-scene" aria-hidden="true">
        <div className="page-bg" />
        <BrandGradientLayer />
        <HeroLogoLayer />
        <div className="grain-overlay" aria-hidden="true" />
      </div>

      <div className="page-shell">
        <Header />
        <main className="careers-main">
          <CareersHero />
          <div className="careers-form-col">
            <ApplicationForm />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

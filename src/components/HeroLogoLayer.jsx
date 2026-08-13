import { ASSETS } from '../constants/assets'

export default function HeroLogoLayer() {
  return (
    <div className="hero-logo-mark" aria-hidden="true">
      <img
        src={ASSETS.logo}
        alt=""
        className="hero-logo-mark__image"
        width={2839}
        height={356}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

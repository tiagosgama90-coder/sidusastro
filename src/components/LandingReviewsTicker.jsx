import { useEffect, useMemo, useState } from 'react'
import { Star } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { mergeLandingReviews } from '../lib/landingSeedReviews.js'

export function LandingReviewsTicker() {
  const { t } = useLanguage()
  const [realReviews, setRealReviews] = useState([])

  useEffect(() => {
    let cancelado = false
    fetch('/api/reviews-list')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelado) setRealReviews(d.reviews || [])
      })
      .catch(() => {})
    return () => { cancelado = true }
  }, [])

  const items = useMemo(() => mergeLandingReviews(realReviews), [realReviews])
  const tickerItems = useMemo(() => [...items, ...items], [items])

  return (
    <footer className="landing-reviews-ticker" aria-label={t('landing.reviewsTickerAria')}>
      <div className="landing-reviews-ticker__viewport">
        <div className="landing-reviews-ticker__track">
          {tickerItems.map((review, i) => (
            <figure key={`${review.id}-${i}`} className="landing-reviews-ticker__item">
              <div className="landing-reviews-ticker__stars" aria-hidden="true">
                {Array.from({ length: review.rating || 5 }).map((_, j) => (
                  <Star key={j} size={10} fill="#DFB76C" color="#DFB76C" />
                ))}
              </div>
              <blockquote className="landing-reviews-ticker__quote">
                &ldquo;{review.text}&rdquo;
              </blockquote>
              <figcaption className="landing-reviews-ticker__author">
                {review.name}{review.meta ? `, ${review.meta}` : ''}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </footer>
  )
}

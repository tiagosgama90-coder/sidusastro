export async function fetchDailyContent({ fasePt, faseEn, transit }) {
  const params = new URLSearchParams()
  if (fasePt) params.set('fasePt', fasePt)
  if (faseEn) params.set('faseEn', faseEn)
  if (transit) params.set('transit', transit)
  const qs = params.toString()
  const res = await fetch(`/api/daily-content${qs ? `?${qs}` : ''}`)
  if (!res.ok) throw new Error('daily-content fail')
  return res.json()
}

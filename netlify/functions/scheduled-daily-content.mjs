import { ensureDailyContent } from './_shared/dailyContentStore.mjs'

/** Gera horóscopo + sugestões redes sociais todos os dias (~06:00 UTC). */
export default async () => {
  const date = new Date().toISOString().slice(0, 10)
  try {
    const data = await ensureDailyContent({
      date,
      fasePt: 'Céu actualizado automaticamente',
      faseEn: 'Sky updated automatically',
      transitSummary: 'Daily Sidus refresh',
    })
    console.log('[scheduled-daily-content] OK', date, data?.source)
    return new Response(JSON.stringify({ ok: true, date, source: data?.source }), { status: 200 })
  } catch (e) {
    console.error('[scheduled-daily-content]', e?.message)
    return new Response(JSON.stringify({ ok: false, error: e?.message }), { status: 500 })
  }
}

export const config = {
  schedule: '0 6 * * *',
}

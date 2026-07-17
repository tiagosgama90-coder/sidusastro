/** E-mails de seguimento desactivados — registo e marketing usam apenas Firebase / lista local. */
export default async () => {
  console.info('[scheduled-followup-emails] Resend marketing desactivado — sem envios automáticos')
  return new Response(JSON.stringify({ ok: true, skipped: true, reason: 'resend_disabled' }), { status: 200 })
}

export const config = {
  schedule: '0 9 * * *',
}

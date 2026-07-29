import { Crown, Check } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { getBeneficiosVip } from '../lib/i18n/ferramentasData.js'
import { formatPrecoCompleto, precoPremiumVitrine, PRECO_PREMIUM_UNICO } from '../lib/pricing.js'
import { PremiumComparacao } from './PremiumComparacao.jsx'

const CORES = {
  fundo: '#0B071E',
  dourado: '#DFB76C',
  douradoEscuro: '#B8944F',
  branco: '#FFFFFF',
  brancoSuave: 'rgba(255,255,255,0.85)',
  brancoMuted: 'rgba(255,255,255,0.55)',
  vidroBorda: 'rgba(223,183,108,0.22)',
}

/**
 * Conteúdo VIP partilhado: comparação grátis/VIP, benefícios completos, preço e programa de afiliados.
 */
export function VipPaywallBody({
  onCta,
  onPromo,
  isBrasil = false,
  oraclePerguntasUsadas = 0,
  leiturasTarotUsadas = 0,
  ctaText,
  titleKey = 'vip.title',
  subtitleKey = 'vip.subtitle',
  showHeader = true,
  compact = false,
  showFullTable = false,
}) {
  const { t, lang } = useLanguage()
  const beneficios = getBeneficiosVip(lang)
  const precoVitrine = precoPremiumVitrine(isBrasil)
  const precoLabel = formatPrecoCompleto(precoVitrine.valor, precoVitrine.currency)
  const precoCartaoBr = formatPrecoCompleto(PRECO_PREMIUM_UNICO, 'eur')

  return (
    <>
      {showHeader && (
        <div style={{ textAlign: compact ? 'left' : 'center', marginBottom: compact ? 14 : 20 }}>
          {!compact && <div style={{ fontSize: 32, marginBottom: 8 }}>✨</div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: compact ? 'flex-start' : 'center', marginBottom: 6 }}>
            <Crown size={compact ? 18 : 22} color={CORES.dourado} />
            <h2 style={{ fontSize: compact ? 15 : 22, fontWeight: 700, color: CORES.dourado, margin: 0 }}>
              {t(titleKey)}
            </h2>
          </div>
          {subtitleKey && (
            <p style={{ fontSize: compact ? 12 : 13, color: CORES.brancoMuted, margin: 0, lineHeight: 1.55 }}>
              {t(subtitleKey)}
            </p>
          )}
        </div>
      )}

      <PremiumComparacao
        isPremium={false}
        oracleUsadas={oraclePerguntasUsadas}
        tarotUsadas={leiturasTarotUsadas}
        isBrasil={isBrasil}
        compact={compact}
        showFullTable={showFullTable}
      />

      <div style={{
        padding: compact ? '14px 16px' : 24,
        marginTop: 14,
        marginBottom: 14,
        borderRadius: 14,
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${CORES.vidroBorda}`,
      }}>
        {beneficios.map((b) => (
          <div key={b} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
            <Check size={14} color={CORES.dourado} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: compact ? 12 : 14, color: CORES.brancoSuave, lineHeight: 1.5 }}>{b}</span>
          </div>
        ))}
      </div>

      <div style={{
        textAlign: 'center',
        padding: compact ? '12px 14px' : 24,
        marginBottom: 14,
        borderRadius: 14,
        background: 'rgba(0,0,0,0.2)',
        border: `1px solid ${CORES.dourado}`,
      }}>
        <div style={{ fontSize: compact ? 26 : 36, fontWeight: 700, color: CORES.branco }}>
          {precoLabel} {isBrasil ? <span style={{ fontSize: compact ? 12 : 14, color: '#34D399', fontWeight: 600 }}>{t('vip.pixLabel')}</span> : null}
          {!isBrasil ? <span style={{ fontSize: compact ? 12 : 14, color: CORES.brancoMuted, fontWeight: 400 }}> {t('common.oneTime')}</span> : null}
        </div>
        {isBrasil ? (
          <p style={{ fontSize: 11, color: '#34D399', marginTop: 8, fontWeight: 600 }}>{t('vip.priceBrPixNote', { preco: precoLabel, precoEur: precoCartaoBr })}</p>
        ) : null}
        <p style={{ fontSize: 11, color: CORES.brancoMuted, marginTop: 6, marginBottom: 0 }}>{t('vip.oneTimeAccess')}</p>
      </div>

      <button
        type="button"
        onClick={onCta}
        style={{
          width: '100%',
          padding: compact ? '13px 16px' : '15px 20px',
          border: 'none',
          borderRadius: 12,
          cursor: 'pointer',
          background: `linear-gradient(135deg, ${CORES.dourado}, ${CORES.douradoEscuro})`,
          color: CORES.fundo,
          fontSize: compact ? 14 : 15,
          fontWeight: 700,
        }}
      >
        {ctaText || (isBrasil ? t('vip.ctaBr', { preco: precoLabel }) : t('vip.cta'))}
      </button>

      <p style={{ textAlign: 'center', fontSize: 11, color: CORES.brancoMuted, marginTop: 10, marginBottom: 0, lineHeight: 1.5 }}>
        {isBrasil ? t('vip.paymentMethodsBr', { precoPix: precoLabel, precoEur: precoCartaoBr }) : t('vip.paymentMethods')}
      </p>

      {onPromo ? (
        <div style={{ marginTop: 14 }}>
          <p style={{ fontSize: 11, color: CORES.brancoMuted, textAlign: 'center', margin: '0 0 10px', lineHeight: 1.55 }}>
            {t('vipPromo.lead')}
          </p>
          <button
            type="button"
            onClick={onPromo}
            style={{
              width: '100%',
              background: 'rgba(223,183,108,0.1)',
              border: `1px solid ${CORES.vidroBorda}`,
              borderRadius: 12,
              color: CORES.dourado,
              fontSize: compact ? 12 : 13,
              fontWeight: 600,
              padding: '12px 16px',
              cursor: 'pointer',
              lineHeight: 1.45,
            }}
          >
            {t('vip.promoLink')}
          </button>
        </div>
      ) : null}
    </>
  )
}

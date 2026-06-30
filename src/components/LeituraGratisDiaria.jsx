import { useState, useEffect, useMemo } from 'react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { localizeArcano } from '../lib/i18n/tarotArcana.js'
import { indiceCartaDoDia, frasePersonalizadaDia } from '../lib/leituraDiaria.js'
const CORES = {
  dourado: '#DFB76C',
  branco: '#FFFFFF',
  brancoSuave: 'rgba(255, 255, 255, 0.85)',
  brancoMuted: 'rgba(255, 255, 255, 0.55)',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
}

const ARCANOS_BASE = [
  { id: 0, nome: 'O Louco', simb: '🃏', palavras: ['aventura', 'liberdade', 'começo'], luz: 'Abertura total ao desconhecido. Um salto de fé abre portas inesperadas.' },
  { id: 1, nome: 'O Mago', simb: '🎩', palavras: ['poder', 'vontade', 'manifestação'], luz: 'Tens todos os recursos que precisas. A tua força de vontade transforma pensamentos em realidade.' },
  { id: 2, nome: 'A Papisa', simb: '📖', palavras: ['intuição', 'mistério', 'sabedoria'], luz: 'A tua voz interior é precisa. Confia no que sentes antes do que vês.' },
  { id: 3, nome: 'A Imperatriz', simb: '👑', palavras: ['abundância', 'amor', 'fertilidade'], luz: 'Ciclo de prosperidade e criatividade. Nutre os teus projectos com amor.' },
  { id: 4, nome: 'O Imperador', simb: '⚔️', palavras: ['autoridade', 'estrutura', 'proteção'], luz: 'Momento de assumir as rédeas. A disciplina constrói o teu legado.' },
  { id: 5, nome: 'O Hierofante', simb: '✝️', palavras: ['tradição', 'fé', 'ensinamento'], luz: 'Um mentor ou ensinamento surge. Valores profundos guiam as decisões.' },
  { id: 6, nome: 'Os Amantes', simb: '💞', palavras: ['amor', 'escolha', 'harmonia'], luz: 'Uma união ou escolha define o teu caminho. O coração sabe o que a mente tarda a aceitar.' },
  { id: 7, nome: 'O Carro', simb: '🏆', palavras: ['vitória', 'determinação', 'controlo'], luz: 'A tua vontade supera obstáculos. Foco e velocidade garantem a vitória.' },
  { id: 8, nome: 'A Força', simb: '🦁', palavras: ['coragem', 'compaixão', 'domínio'], luz: 'A força verdadeira nasce do amor. Domas os medos com gentileza.' },
  { id: 9, nome: 'O Eremita', simb: '🕯️', palavras: ['reflexão', 'solidão', 'guia'], luz: 'Recolhimento frutífero. A tua luz interior ilumina quando tudo parece escuro.' },
  { id: 10, nome: 'Roda da Fortuna', simb: '☸️', palavras: ['destino', 'ciclos', 'mudança'], luz: 'O ciclo vira a teu favor. Uma reviravolta traz nova sorte.' },
  { id: 11, nome: 'A Justiça', simb: '⚖️', palavras: ['equilíbrio', 'verdade', 'karma'], luz: 'A verdade prevalece. Cada acção tem a sua consequência - colhes o que plantaste.' },
  { id: 12, nome: 'O Enforcado', simb: '🔄', palavras: ['sacrifício', 'perspetiva', 'pausa'], luz: 'Uma pausa necessária revela o que estava oculto. O sacrifício abre novas perspetivas.' },
  { id: 13, nome: 'A Morte', simb: '🌑', palavras: ['transformação', 'fim', 'renascimento'], luz: 'Uma fase encerra para que algo mais elevado nasça. A transformação é libertadora.' },
  { id: 14, nome: 'A Temperança', simb: '🌊', palavras: ['equilíbrio', 'paciência', 'alquimia'], luz: 'A mistura perfeita cria algo extraordinário. Paciência é a tua aliada.' },
  { id: 15, nome: 'O Diabo', simb: '⛓️', palavras: ['apego', 'ilusão', 'libertação'], luz: 'Reconhecer o que te prende é o primeiro passo para a liberdade.' },
  { id: 16, nome: 'A Torre', simb: '⚡', palavras: ['ruptura', 'revelação', 'reconstrução'], luz: 'O que se destrói era falso. A ruptura abre espaço para a verdade.' },
  { id: 17, nome: 'A Estrela', simb: '⭐', palavras: ['esperança', 'cura', 'inspiração'], luz: 'Depois de qualquer tempestade surge a luz. Cura profunda chega agora.' },
  { id: 18, nome: 'A Lua', simb: '🌙', palavras: ['intuição', 'inconsciente', 'sonhos'], luz: 'Os teus sonhos e intuições carregam mensagens reais.' },
  { id: 19, nome: 'O Sol', simb: '☀️', palavras: ['alegria', 'sucesso', 'clareza'], luz: 'Clareza total. A alegria surge quando ages com plena autenticidade.' },
  { id: 20, nome: 'O Julgamento', simb: '📯', palavras: ['despertar', 'redenção', 'chamado'], luz: 'Um despertar espiritual profundo. Estás a ser chamado ao teu propósito maior.' },
  { id: 21, nome: 'O Mundo', simb: '🌍', palavras: ['conclusão', 'integração', 'plenitude'], luz: 'Ciclo completado com sucesso. Tens tudo o que precisas para viver plenamente.' },
]

function localeForLang(lang) {
  if (lang === 'es') return 'es-ES'
  if (lang === 'it') return 'it-IT'
  if (lang === 'de') return 'de-DE'
  if (lang === 'fr') return 'fr-FR'
  if (lang === 'en') return 'en-GB'
  return 'pt-PT'
}

/**
 * Carta do dia + frase personalizada Sol/Lua.
 * @param {{ solar?: { nome: string }, lunar?: { nome: string }, compact?: boolean }} props
 */
export function LeituraGratisDiaria({ solar, lunar, compact = false }) {
  const { lang, t, ts } = useLanguage()
  const [dataHoje, setDataHoje] = useState(() => new Date().toISOString().slice(0, 10))

  useEffect(() => {
    const verificar = () => {
      const hoje = new Date().toISOString().slice(0, 10)
      if (hoje !== dataHoje) setDataHoje(hoje)
    }
    verificar()
    const id = setInterval(verificar, 60000)
    return () => clearInterval(id)
  }, [dataHoje])

  const carta = useMemo(() => {
    const idx = indiceCartaDoDia(new Date(dataHoje + 'T12:00:00'))
    return localizeArcano(ARCANOS_BASE[idx], lang)
  }, [dataHoje, lang])

  const [ano, mes, dia] = dataHoje.split('-').map(Number)
  const dataFormatada = new Date(Date.UTC(ano, mes - 1, dia)).toLocaleDateString(localeForLang(lang))

  const fraseSol = solar?.nome ? frasePersonalizadaDia('sol', solar.nome, lang) : null
  const fraseLua = lunar?.nome ? frasePersonalizadaDia('lua', lunar.nome, lang) : null

  if (!carta?.nome) return null

  return (
    <div
      className={compact ? 'leitura-gratis leitura-gratis--compact' : 'leitura-gratis'}
      style={{
        background: 'rgba(255, 255, 255, 0.06)',
        padding: compact ? '14px 16px' : '18px 20px',
        marginBottom: compact ? 12 : 16,
        background: 'rgba(223,183,108,0.05)',
        border: '1px solid rgba(223,183,108,0.35)',
        borderRadius: 16,
      }}
    >
      <div style={{ fontSize: 10, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: compact ? 8 : 12 }}>
        {t('leituraGratis.title', { date: dataFormatada })}
      </div>

      <div style={{ display: 'flex', alignItems: compact ? 'flex-start' : 'center', gap: compact ? 12 : 16, flexWrap: 'wrap' }}>
        <div style={{
          width: compact ? 48 : 56,
          height: compact ? 76 : 90,
          borderRadius: 8,
          flexShrink: 0,
          background: 'linear-gradient(160deg,#1a0d3a,#0B071E)',
          border: `1.5px solid ${CORES.dourado}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 4px',
          boxShadow: '0 0 20px rgba(223,183,108,0.25)',
        }}>
          <div style={{ fontSize: 7, color: CORES.dourado, opacity: 0.7, fontFamily: 'Georgia,serif' }}>{carta.id === 0 ? '☽' : String(carta.id)}</div>
          <div style={{ fontSize: compact ? 22 : 26 }}>{carta.simb}</div>
          <div style={{ fontSize: 6, color: CORES.dourado, textAlign: 'center', lineHeight: 1.2 }}>{carta.nome.toUpperCase()}</div>
        </div>

        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: compact ? 15 : 17, fontWeight: 700, color: CORES.branco, marginBottom: 4 }}>{carta.nome}</div>
          {!compact && (
            <div style={{ display: 'flex', gap: 5, marginBottom: 8, flexWrap: 'wrap' }}>
              {carta.palavras.map((p) => (
                <span key={p} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'rgba(223,183,108,0.1)', color: CORES.dourado, border: '1px solid rgba(223,183,108,0.2)' }}>{p}</span>
              ))}
            </div>
          )}
          <p style={{ fontSize: compact ? 11 : 12, color: CORES.brancoMuted, lineHeight: 1.6, margin: 0 }}>{carta.luz}</p>
        </div>
      </div>

      {(fraseSol || fraseLua) && (
        <div style={{ marginTop: compact ? 10 : 14, paddingTop: compact ? 10 : 14, borderTop: `1px solid ${CORES.vidroBorda}` }}>
          <div style={{ fontSize: 10, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {t('leituraGratis.personal')}
          </div>
          {fraseSol && (
            <p style={{ fontSize: 12, color: CORES.brancoSuave, lineHeight: 1.55, margin: '0 0 6px' }}>
              <span style={{ color: '#FCD34D' }}>☉ {ts(solar.nome)}</span> — {fraseSol}
            </p>
          )}
          {fraseLua && (
            <p style={{ fontSize: 12, color: CORES.brancoSuave, lineHeight: 1.55, margin: 0 }}>
              <span style={{ color: '#C4B5FD' }}>☽ {ts(lunar.nome)}</span> — {fraseLua}
            </p>
          )}
          <p style={{ fontSize: 10, color: CORES.brancoMuted, marginTop: 8, marginBottom: 0, fontStyle: 'italic' }}>
            {t('leituraGratis.returnTomorrow')}
          </p>
        </div>
      )}
    </div>
  )
}

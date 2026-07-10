/** Campo de cidade com autocomplete (partilhado). */
import { useState, useEffect, useRef } from 'react'
import { Check, Loader2, MapPin } from 'lucide-react'
import { pesquisarCidades } from '../lib/geocoding.js'

const CORES = {
  dourado: '#DFB76C',
  brancoMuted: 'rgba(255,255,255,0.55)',
  brancoSuave: 'rgba(255,255,255,0.85)',
  vidroBorda: 'rgba(223,183,108,0.22)',
}

const inputStyle = {
  width: '100%',
  padding: '12px 40px 12px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${CORES.vidroBorda}`,
  borderRadius: 10,
  color: CORES.brancoSuave,
  fontSize: 14,
  boxSizing: 'border-box',
}

export function CampoCidadeField({ label, valor, localizacao, onChange, onSelect, placeholder, erro }) {
  const [sugestoes, setSugestoes] = useState([])
  const [aPesquisar, setAPesquisar] = useState(false)
  const [aberto, setAberto] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const ok = localizacao && (localizacao.nome === valor || localizacao.nome?.startsWith(valor))
    if (!valor || valor.length < 2 || ok) {
      setSugestoes([])
      return undefined
    }
    const timer = setTimeout(async () => {
      setAPesquisar(true)
      try {
        const r = await pesquisarCidades(valor)
        setSugestoes(r)
        setAberto(r.length > 0)
      } catch {
        setSugestoes([])
      } finally {
        setAPesquisar(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [valor, localizacao])

  useEffect(() => {
    const fechar = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setAberto(false)
    }
    document.addEventListener('pointerdown', fechar)
    return () => document.removeEventListener('pointerdown', fechar)
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {label && (
        <label style={{ fontSize: 11, color: CORES.brancoMuted, display: 'block', marginBottom: 6 }}>{label}</label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          value={valor}
          translate="no"
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => sugestoes.length > 0 && setAberto(true)}
          placeholder={placeholder}
          style={{
            ...inputStyle,
            borderColor: erro ? 'rgba(248,113,113,0.7)' : localizacao ? 'rgba(74,222,128,0.5)' : CORES.vidroBorda,
          }}
        />
        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
          {aPesquisar ? <Loader2 size={16} color={CORES.dourado} style={{ animation: 'spin 1s linear infinite' }} />
            : localizacao ? <Check size={16} color="#4ADE80" /> : <MapPin size={16} color={CORES.brancoMuted} />}
        </div>
      </div>
      {erro && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#F87171' }}>{erro}</p>}
      {aberto && sugestoes.length > 0 && (
        <ul style={{
          position: 'absolute', left: 0, right: 0, top: '100%', listStyle: 'none', margin: '4px 0 0', padding: 4,
          background: 'rgba(11,7,30,0.98)', border: `1px solid ${CORES.vidroBorda}`, borderRadius: 10,
          maxHeight: 180, overflowY: 'auto', zIndex: 30,
        }}>
          {sugestoes.map((s) => (
            <li key={s.placeId}>
              <button
                type="button"
                translate="no"
                onPointerDown={(e) => { e.preventDefault(); onSelect(s); setAberto(false) }}
                style={{
                  width: '100%', background: 'none', border: 'none', color: CORES.brancoSuave,
                  fontSize: 13, textAlign: 'left', padding: '10px 12px', cursor: 'pointer',
                }}
              >
                {s.nome}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

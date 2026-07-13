/**
 * Componente de anúncios Adsterra - Social Bar + Popunder Estratégico
 * 
 * Social Bar: visível em todo o site (exceto Premium) - monetização passiva
 * Popunder: ativa apenas em páginas de conteúdo após interação - maior receita
 * 
 * Ambos são ocultados para utilizadores Premium (sem anúncios)
 */
import { useEffect, useRef } from 'react'

/**
 * Hook para controlar o Social Bar (index.html) baseado no estado Premium
 * Esconder/mostrar o #adsterra-social-bar
 */
export function useSocialBar(isPremium) {
  const socialBarVisivel = useRef(false)

  useEffect(() => {
    const bar = document.getElementById('adsterra-social-bar')
    if (!bar) return

    if (isPremium) {
      // Premium → esconder anúncios
      bar.classList.remove('ads-visible')
      socialBarVisivel.current = false
    } else {
      // Não Premium → mostrar
      bar.classList.add('ads-visible')
      socialBarVisivel.current = true
    }

    return () => {
      // Limpeza: se o componente desmontar, esconder
      bar.classList.remove('ads-visible')
    }
  }, [isPremium])
}

/**
 * Hook para Popunder estratégico (abre em background, só após interação)
 * @param {Object} options
 * @param {boolean} options.enabled - Se o popunder pode ser ativado
 * @param {'scroll'|'click'|'afterDelay'} options.trigger - Quando ativar
 * @param {number} options.scrollThreshold - % do scroll para ativar (0-100)
 * @param {number} options.delayMs - Delay em ms se trigger for 'afterDelay'
 */
export function usePopunder(options = {}) {
  const {
    enabled = false,
    trigger = 'scroll',
    scrollThreshold = 60,
  } = options

  const jaAtivou = useRef(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!enabled || jaAtivou.current) return

    let popunderScript = null

    const ativarPopunder = () => {
      if (jaAtivou.current) return
      jaAtivou.current = true

      // Injetar o script Popunder dinamicamente (só uma vez por sessão em cada página)
      if (!document.getElementById('adsterra-popunder')) {
        popunderScript = document.createElement('script')
        popunderScript.id = 'adsterra-popunder'
        popunderScript.src = 'https://pl30343615.effectivecpmnetwork.com/53/2b/c7/532bc72e4830b283c1c8dae08a6ef6dd.js'
        popunderScript.async = true
        document.body.appendChild(popunderScript)
      }
    }

    if (trigger === 'scroll') {
      const handleScroll = () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        if (scrollPercent >= scrollThreshold) {
          ativarPopunder()
          window.removeEventListener('scroll', handleScroll)
        }
      }
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }

    if (trigger === 'click') {
      const handleClick = () => {
        ativarPopunder()
        document.removeEventListener('click', handleClick)
      }
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }

    if (trigger === 'afterDelay') {
      timerRef.current = setTimeout(ativarPopunder, options.delayMs || 5000)
      return () => clearTimeout(timerRef.current)
    }

    // Trigger manual - ativar imediatamente
    if (trigger === 'immediate') {
      ativarPopunder()
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [enabled, trigger, scrollThreshold, options.delayMs])
}

/**
 * Componente Popunder manual - para usar em páginas específicas
 * Ativa o popunder apenas quando o utilizador interage com conteúdo
 */
export function PopunderTrigger({ isPremium, onAction, children }) {
  const jaAtivou = useRef(false)

  const handleAction = () => {
    if (isPremium) {
      // Premium: não mostra anúncio, só executa a ação
      onAction?.()
      return
    }

    if (jaAtivou.current) {
      onAction?.()
      return
    }

    jaAtivou.current = true

    // Injetar popunder
    const script = document.createElement('script')
    script.src = 'https://pl30343615.effectivecpmnetwork.com/53/2b/c7/532bc72e4830b283c1c8dae08a6ef6dd.js'
    script.async = true
    document.body.appendChild(script)

    // Executar ação depois
    setTimeout(() => onAction?.(), 100)
  }

  // Clonar o children com onClick modificado
  return (
    <div onClick={handleAction} style={{ display: 'contents' }}>
      {children}
    </div>
  )
}
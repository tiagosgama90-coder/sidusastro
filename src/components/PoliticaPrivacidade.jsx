const CORES = {
  fundo:'#0B071E', dourado:'#DFB76C',
  branco:'#FFFFFF', brancoSuave:'rgba(255,255,255,0.85)',
  brancoMuted:'rgba(255,255,255,0.55)', vidroBorda:'rgba(223,183,108,0.22)',
}

export function PoliticaPrivacidade({ onVoltar }) {
  return (
    <div style={{ padding:'20px 20px 110px', maxWidth:680, margin:'0 auto' }}>
      <button type="button" onClick={onVoltar} style={{background:'none',border:'none',color:CORES.dourado,cursor:'pointer',fontSize:13,marginBottom:20,padding:0}}>
        ← Voltar
      </button>

      <h1 style={{fontSize:22,fontWeight:700,color:CORES.dourado,marginBottom:4}}>Política de Privacidade</h1>
      <p style={{fontSize:12,color:CORES.brancoMuted,marginBottom:28}}>Sidus – Última actualização: Junho 2026</p>

      {[
        {
          titulo:'1. Quem somos',
          texto:`A aplicação Sidus é um serviço de astrologia digital desenvolvido para fins informativos e de entretenimento espiritual. O responsável pelo tratamento de dados é o operador da aplicação Sidus ("nós", "nosso").\n\nContacto: suporte.sidusapp@gmail.com`,
        },
        {
          titulo:'2. Dados recolhidos',
          texto:`Recolhemos os seguintes dados pessoais para prestar os nossos serviços:\n\n• Nome e apelido\n• Data, hora e local de nascimento (necessários para calcular o mapa astral)\n• Endereço de e-mail e palavra-passe (para autenticação)\n• Foto de perfil (opcional, guardada localmente no dispositivo)\n• Histórico de leituras de tarot (guardado localmente)\n• Dados de pagamento (processados por parceiros — não armazenados nos nossos servidores)\n\nNão recolhemos dados sensíveis como informações de saúde, orientação sexual ou convicções religiosas.`,
        },
        {
          titulo:'3. Como usamos os seus dados',
          texto:`Os seus dados são utilizados para:\n\n• Calcular e exibir o seu mapa astral natal com precisão astronómica\n• Personalizar as leituras de tarot e respostas do Oráculo IA\n• Autenticação segura na aplicação\n• Melhorar os nossos serviços e algoritmos de cálculo\n• Comunicar actualizações e novidades relevantes (apenas com o seu consentimento)`,
        },
        {
          titulo:'4. Parceiros e terceiros',
          texto:`Trabalhamos com os seguintes parceiros:\n\n• Firebase / Google (autenticação e base de dados em nuvem) — Política: firebase.google.com/support/privacy\n• OpenStreetMap Nominatim (geocodificação de cidades) — sem dados pessoais transmitidos\n• Open-Meteo (fuso horário histórico) — sem dados pessoais transmitidos\n• Google Gemini AI (respostas do Oráculo) — as perguntas podem ser processadas pela API do Google\n• Google AdSense (publicidade) — pode utilizar cookies para personalizar anúncios\n• Stripe (pagamentos) — os dados de pagamento são processados directamente pela Stripe`,
        },
        {
          titulo:'5. Publicidade (Google AdSense)',
          texto:`Utilizamos o Google AdSense para exibir anúncios relevantes. O Google pode utilizar cookies para personalizar os anúncios com base nas suas visitas anteriores a este e a outros sites.\n\nPode desactivar a personalização de anúncios em: myaccount.google.com/data-and-privacy\n\nOs anúncios exibidos são identificados como "Publicidade" ou "Anúncio".`,
        },
        {
          titulo:'6. Cookies',
          texto:`Utilizamos cookies estritamente necessários para o funcionamento da aplicação (autenticação, preferências) e cookies de terceiros do Google AdSense para personalização de anúncios.\n\nAo continuar a usar a aplicação, aceita o uso de cookies. Pode gerir os cookies nas definições do seu browser.`,
        },
        {
          titulo:'7. Os seus direitos (RGPD)',
          texto:`Se é residente na União Europeia, tem os seguintes direitos:\n\n• Direito de acesso: obter uma cópia dos seus dados\n• Direito de rectificação: corrigir dados incorrectos\n• Direito ao apagamento: solicitar a eliminação dos seus dados\n• Direito de portabilidade: receber os seus dados em formato legível\n• Direito de oposição: opor-se ao tratamento para fins de marketing\n\nPara exercer qualquer destes direitos, contacte-nos em: suporte.sidusapp@gmail.com`,
        },
        {
          titulo:'8. Segurança dos dados',
          texto:`Os seus dados são armazenados de forma segura na infraestrutura Firebase do Google, protegida por encriptação em trânsito (HTTPS/TLS) e em repouso. As palavras-passe são geridas exclusivamente pelo Firebase Authentication e nunca são armazenadas em texto claro nos nossos servidores.`,
        },
        {
          titulo:'9. Retenção de dados',
          texto:`Mantemos os seus dados enquanto a sua conta estiver activa. Se eliminar a sua conta, os seus dados são apagados dos nossos servidores no prazo de 30 dias. Os dados guardados localmente no dispositivo (foto de perfil, histórico local) são eliminados quando desinstalar a aplicação ou limpar os dados do browser.`,
        },
        {
          titulo:'10. Menores',
          texto:`A aplicação Sidus destina-se a utilizadores com 16 anos ou mais. Não recolhemos conscientemente dados de menores de 16 anos. Se souber que um menor nos forneceu dados pessoais, contacte-nos para os eliminarmos.`,
        },
        {
          titulo:'11. Alterações a esta política',
          texto:`Podemos actualizar esta Política de Privacidade periodicamente. Quando o fizermos, actualizamos a data de "última actualização" no topo. Recomendamos que reveja esta política regularmente.`,
        },
        {
          titulo:'12. Contacto',
          texto:`Para qualquer questão sobre esta política ou sobre os seus dados:\n\nE-mail: suporte.sidusapp@gmail.com\nWebsite: sidusastro.com\n\nTemos o compromisso de responder a qualquer solicitação no prazo de 30 dias.`,
        },
      ].map(s=>(
        <div key={s.titulo} style={{marginBottom:24}}>
          <h3 style={{fontSize:15,fontWeight:700,color:CORES.dourado,marginBottom:8,borderBottom:`1px solid rgba(223,183,108,0.15)`,paddingBottom:6}}>
            {s.titulo}
          </h3>
          <p style={{fontSize:13,color:CORES.brancoSuave,lineHeight:1.8,margin:0,whiteSpace:'pre-wrap'}}>
            {s.texto}
          </p>
        </div>
      ))}
    </div>
  )
}

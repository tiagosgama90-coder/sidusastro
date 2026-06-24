const SECTIONS_PT = [
  {
    titulo: '1. Quem somos',
    texto: `A aplicação Sidus é um serviço de astrologia digital desenvolvido para fins informativos e de entretenimento espiritual. O responsável pelo tratamento de dados é o operador da aplicação Sidus ("nós", "nosso").\n\nContacto: suporte.sidusapp@gmail.com`,
  },
  {
    titulo: '2. Dados recolhidos',
    texto: `Recolhemos os seguintes dados pessoais para prestar os nossos serviços:\n\n• Nome e apelido\n• Data, hora e local de nascimento (necessários para calcular o mapa astral)\n• Endereço de e-mail e palavra-passe (para autenticação)\n• Foto de perfil (opcional, guardada localmente no dispositivo)\n• Histórico de leituras de tarot (guardado localmente)\n• Dados de pagamento (processados por parceiros — não armazenados nos nossos servidores)\n\nNão recolhemos dados sensíveis como informações de saúde, orientação sexual ou convicções religiosas.`,
  },
  {
    titulo: '3. Como usamos os seus dados',
    texto: `Os seus dados são utilizados para:\n\n• Calcular e exibir o seu mapa astral natal com precisão astronómica\n• Personalizar as leituras de tarot e respostas do Oráculo IA\n• Autenticação segura na aplicação\n• Melhorar os nossos serviços e algoritmos de cálculo\n• Comunicar actualizações e novidades relevantes (apenas com o seu consentimento)`,
  },
  {
    titulo: '4. Parceiros e terceiros',
    texto: `Trabalhamos com os seguintes parceiros:\n\n• Firebase / Google (autenticação e base de dados em nuvem) — Política: firebase.google.com/support/privacy\n• Google Analytics (estatísticas de visitas, apenas com o teu consentimento) — Política: policies.google.com/privacy\n• OpenStreetMap Nominatim (geocodificação de cidades) — sem dados pessoais transmitidos\n• Open-Meteo (fuso horário histórico) — sem dados pessoais transmitidos\n• Google Gemini AI (respostas do Oráculo) — as perguntas podem ser processadas pela API do Google\n• Google AdSense (publicidade) — pode utilizar cookies para personalizar anúncios\n• Stripe (pagamentos) — os dados de pagamento são processados directamente pela Stripe`,
  },
  {
    titulo: '5. Publicidade (Google AdSense)',
    texto: `Utilizamos o Google AdSense para exibir anúncios relevantes. O Google pode utilizar cookies para personalizar os anúncios com base nas suas visitas anteriores a este e a outros sites.\n\nPode desactivar a personalização de anúncios em: myaccount.google.com/data-and-privacy\n\nOs anúncios exibidos são identificados como "Publicidade" ou "Anúncio".`,
  },
  {
    titulo: '6. Cookies',
    texto: `Utilizamos cookies estritamente necessários para o funcionamento da aplicação (autenticação, preferências), cookies de análise do Google Analytics (apenas se aceitares todos os cookies) e cookies de terceiros do Google AdSense para personalização de anúncios.\n\nAo continuar a usar a aplicação, aceita o uso de cookies. Pode gerir os cookies nas definições do seu browser.`,
  },
  {
    titulo: '7. Os seus direitos (RGPD)',
    texto: `Se é residente na União Europeia, tem os seguintes direitos:\n\n• Direito de acesso: obter uma cópia dos seus dados\n• Direito de rectificação: corrigir dados incorrectos\n• Direito ao apagamento: solicitar a eliminação dos seus dados\n• Direito de portabilidade: receber os seus dados em formato legível\n• Direito de oposição: opor-se ao tratamento para fins de marketing\n\nPara exercer qualquer destes direitos, contacte-nos em: suporte.sidusapp@gmail.com`,
  },
  {
    titulo: '8. Segurança dos dados',
    texto: `Os seus dados são armazenados de forma segura na infraestrutura Firebase do Google, protegida por encriptação em trânsito (HTTPS/TLS) e em repouso. As palavras-passe são geridas exclusivamente pelo Firebase Authentication e nunca são armazenadas em texto claro nos nossos servidores.`,
  },
  {
    titulo: '9. Retenção de dados',
    texto: `Mantemos os seus dados enquanto a sua conta estiver activa. Se eliminar a sua conta, os seus dados são apagados dos nossos servidores no prazo de 30 dias. Os dados guardados localmente no dispositivo (foto de perfil, histórico local) são eliminados quando desinstalar a aplicação ou limpar os dados do browser.`,
  },
  {
    titulo: '10. Menores',
    texto: `A aplicação Sidus destina-se a utilizadores com 16 anos ou mais. Não recolhemos conscientemente dados de menores de 16 anos. Se souber que um menor nos forneceu dados pessoais, contacte-nos para os eliminarmos.`,
  },
  {
    titulo: '11. Alterações a esta política',
    texto: `Podemos actualizar esta Política de Privacidade periodicamente. Quando o fizermos, actualizamos a data de "última actualização" no topo. Recomendamos que reveja esta política regularmente.`,
  },
  {
    titulo: '12. Contacto',
    texto: `Para qualquer questão sobre esta política ou sobre os seus dados:\n\nE-mail: suporte.sidusapp@gmail.com\nWebsite: sidusastro.com\n\nTemos o compromisso de responder a qualquer solicitação no prazo de 30 dias.`,
  },
]

const SECTIONS_EN = [
  {
    titulo: '1. Who we are',
    texto: `The Sidus app is a digital astrology service developed for informational and spiritual entertainment purposes. The data controller is the operator of the Sidus application ("we", "our").\n\nContact: suporte.sidusapp@gmail.com`,
  },
  {
    titulo: '2. Data collected',
    texto: `We collect the following personal data to provide our services:\n\n• First and last name\n• Date, time and place of birth (required to calculate the natal chart)\n• Email address and password (for authentication)\n• Profile photo (optional, stored locally on the device)\n• Tarot reading history (stored locally)\n• Payment data (processed by partners — not stored on our servers)\n\nWe do not collect sensitive data such as health information, sexual orientation or religious beliefs.`,
  },
  {
    titulo: '3. How we use your data',
    texto: `Your data is used to:\n\n• Calculate and display your natal chart with astronomical precision\n• Personalise tarot readings and AI Oracle responses\n• Secure authentication in the app\n• Improve our services and calculation algorithms\n• Communicate relevant updates and news (only with your consent)`,
  },
  {
    titulo: '4. Partners and third parties',
    texto: `We work with the following partners:\n\n• Firebase / Google (authentication and cloud database) — Policy: firebase.google.com/support/privacy\n• Google Analytics (visit statistics, only with your consent) — Policy: policies.google.com/privacy\n• OpenStreetMap Nominatim (city geocoding) — no personal data transmitted\n• Open-Meteo (historical time zone) — no personal data transmitted\n• Google Gemini AI (Oracle responses) — questions may be processed by Google's API\n• Google AdSense (advertising) — may use cookies to personalise ads\n• Stripe (payments) — payment data is processed directly by Stripe`,
  },
  {
    titulo: '5. Advertising (Google AdSense)',
    texto: `We use Google AdSense to display relevant ads. Google may use cookies to personalise ads based on your previous visits to this and other sites.\n\nYou can disable ad personalisation at: myaccount.google.com/data-and-privacy\n\nAds displayed are identified as "Advertising" or "Ad".`,
  },
  {
    titulo: '6. Cookies',
    texto: `We use strictly necessary cookies for the app to function (authentication, preferences), Google Analytics cookies (only if you accept all cookies) and third-party Google AdSense cookies for ad personalisation.\n\nBy continuing to use the app, you accept the use of cookies. You can manage cookies in your browser settings.`,
  },
  {
    titulo: '7. Your rights (GDPR)',
    texto: `If you are a resident of the European Union, you have the following rights:\n\n• Right of access: obtain a copy of your data\n• Right to rectification: correct inaccurate data\n• Right to erasure: request deletion of your data\n• Right to portability: receive your data in a readable format\n• Right to object: object to processing for marketing purposes\n\nTo exercise any of these rights, contact us at: suporte.sidusapp@gmail.com`,
  },
  {
    titulo: '8. Data security',
    texto: `Your data is stored securely on Google's Firebase infrastructure, protected by encryption in transit (HTTPS/TLS) and at rest. Passwords are managed exclusively by Firebase Authentication and are never stored in plain text on our servers.`,
  },
  {
    titulo: '9. Data retention',
    texto: `We keep your data while your account is active. If you delete your account, your data is removed from our servers within 30 days. Data stored locally on the device (profile photo, local history) is deleted when you uninstall the app or clear browser data.`,
  },
  {
    titulo: '10. Minors',
    texto: `The Sidus app is intended for users aged 16 or over. We do not knowingly collect data from children under 16. If you know a minor has provided us with personal data, contact us so we can delete it.`,
  },
  {
    titulo: '11. Changes to this policy',
    texto: `We may update this Privacy Policy periodically. When we do, we update the "last updated" date at the top. We recommend reviewing this policy regularly.`,
  },
  {
    titulo: '12. Contact',
    texto: `For any questions about this policy or your data:\n\nEmail: suporte.sidusapp@gmail.com\nWebsite: sidusastro.com\n\nWe are committed to responding to any request within 30 days.`,
  },
]

export function getPrivacySections(lang) {
  return lang === 'en' ? SECTIONS_EN : SECTIONS_PT
}

export function getPrivacyMeta(lang) {
  if (lang === 'en') {
    return {
      title: 'Privacy Policy',
      updated: 'Sidus – Last updated: June 2026',
    }
  }
  return {
    title: 'Política de Privacidade',
    updated: 'Sidus – Última actualização: Junho 2026',
  }
}

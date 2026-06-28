/** Marca Sidus - estrela de quatro pontas + detalhes (como logotipo original). */
export function SidusLogoMark({ size = 22, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M16 5.5 18.2 13.8 26.5 16 18.2 18.2 16 26.5 13.8 18.2 5.5 16 13.8 13.8 16 5.5Z"
        stroke="#DFB76C"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <circle cx="11.5" cy="21.5" r="1.15" fill="#DFB76C" />
      <path
        d="M22.5 10.5h1.6M23.3 9.7v3.6"
        stroke="#DFB76C"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  )
}

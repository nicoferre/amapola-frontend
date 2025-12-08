function LogoIcon({ size = 80 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="logo-svg"
    >
      <defs>
        {/* Máscara para crear el segmento removido del lado derecho */}
        <mask id="pomegranate-mask">
          <rect width="120" height="120" fill="white" />
          {/* Segmento curvado removido del lado derecho */}
          <path
            d="M 75 45 Q 90 60 75 75"
            stroke="black"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
        </mask>
      </defs>
      
      {/* Cuerpo circular de la granada - centrado */}
      <circle
        cx="60"
        cy="65"
        r="42"
        fill="white"
        mask="url(#pomegranate-mask)"
      />
      
      {/* Corona superior pequeña tipo corona */}
      <path
        d="M 45 50 
           L 48 30
           L 52 27
           L 60 25
           L 68 27
           L 72 30
           L 75 50"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Pequeños puntos decorativos en la corona */}
      <circle cx="50" cy="32" r="2" fill="white" />
      <circle cx="60" cy="28" r="2" fill="white" />
      <circle cx="70" cy="32" r="2" fill="white" />
    </svg>
  )
}

export default LogoIcon


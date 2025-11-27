interface PixelCharacterProps {
  color?: string
  size?: number
  animate?: boolean
}

export function PixelCharacter({ color = "#FF69B4", size = 40, animate = false }: PixelCharacterProps) {
  return (
    <div className={animate ? "dashboard-pixel-walk" : ""}>
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        {/* Head */}
        <rect x="5" y="2" width="6" height="6" fill={color} />
        {/* Eyes */}
        <rect x="6" y="4" width="1" height="1" fill="black" />
        <rect x="9" y="4" width="1" height="1" fill="black" />
        {/* Body */}
        <rect x="4" y="8" width="8" height="4" fill={color} />
        {/* Arms */}
        <rect x="2" y="9" width="2" height="2" fill={color} />
        <rect x="12" y="9" width="2" height="2" fill={color} />
        {/* Legs */}
        <rect x="5" y="12" width="2" height="3" fill={color} />
        <rect x="9" y="12" width="2" height="3" fill={color} />
      </svg>
    </div>
  )
}

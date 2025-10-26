export function PixelClouds() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Cloud 1 */}
      <div className="absolute top-12 left-[10%] pixel-cloud" style={{ animationDelay: "0s" }}>
        <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
          <rect x="20" y="20" width="10" height="10" fill="white" opacity="0.8" />
          <rect x="30" y="10" width="10" height="10" fill="white" opacity="0.8" />
          <rect x="40" y="10" width="10" height="10" fill="white" opacity="0.8" />
          <rect x="50" y="20" width="10" height="10" fill="white" opacity="0.8" />
          <rect x="10" y="30" width="10" height="10" fill="white" opacity="0.8" />
          <rect x="20" y="30" width="40" height="10" fill="white" opacity="0.8" />
        </svg>
      </div>

      {/* Cloud 2 */}
      <div className="absolute top-32 right-[15%] pixel-cloud" style={{ animationDelay: "1s" }}>
        <svg width="100" height="50" viewBox="0 0 100 50" fill="none">
          <rect x="30" y="20" width="10" height="10" fill="white" opacity="0.7" />
          <rect x="40" y="10" width="20" height="10" fill="white" opacity="0.7" />
          <rect x="60" y="20" width="10" height="10" fill="white" opacity="0.7" />
          <rect x="20" y="30" width="60" height="10" fill="white" opacity="0.7" />
          <rect x="10" y="40" width="80" height="10" fill="white" opacity="0.7" />
        </svg>
      </div>

      {/* Cloud 3 */}
      <div className="absolute top-64 left-[60%] pixel-cloud" style={{ animationDelay: "2s" }}>
        <svg width="70" height="35" viewBox="0 0 70 35" fill="none">
          <rect x="20" y="15" width="10" height="10" fill="white" opacity="0.6" />
          <rect x="30" y="5" width="10" height="10" fill="white" opacity="0.6" />
          <rect x="40" y="15" width="10" height="10" fill="white" opacity="0.6" />
          <rect x="10" y="25" width="50" height="10" fill="white" opacity="0.6" />
        </svg>
      </div>
    </div>
  )
}

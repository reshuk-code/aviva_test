export function OrbitDecoration({ className, mirrored = false }: { className: string; mirrored?: boolean }) {
  return <span className={`${className} orbit-decoration ambient-motion`} aria-hidden="true">
    <svg viewBox="0 0 450 345" fill="none" style={{ transform: mirrored ? "scaleX(-1)" : undefined }}>
      <path className="orbit-trail" d="M-15 319C51 242 110 267 171 277C293 304 345 249 315 151C303 112 302 41 254 31C197 19 157 94 173 147C190 208 270 204 325 172C384 137 413 86 465 64" stroke="#c9c8c5" strokeWidth="1.5" strokeDasharray="4 5" />
      <g className="orbit-star"><path d="M244 94C242 112 240 113 225 115C240 117 242 119 244 137C246 119 248 117 263 115C248 113 246 112 244 94Z" fill="#1d1c1b" /></g>
    </svg>
  </span>;
}

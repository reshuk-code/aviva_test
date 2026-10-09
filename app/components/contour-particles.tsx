import type { CSSProperties } from "react";

const ring = "M218 35C315 10 392 90 362 198S239 385 126 349S39 232 83 153S154 56 218 35Z";
const terrain = "M249 13C303 2 332 45 372 50S445 39 464 91S438 165 467 202S500 253 475 294S450 339 444 390S377 411 348 450S272 484 233 466S173 492 136 459S122 399 72 385S26 326 39 286S5 217 31 178S88 161 100 110S167 76 192 42S218 19 249 13Z";

export function ContourParticles({ className, shape = "ring" }: { className: string; shape?: "ring" | "terrain" }) {
  return <span className={`${className} contour-decoration ${shape === "terrain" ? "terrain-lines" : ""} ambient-motion`} aria-hidden="true">
    {shape === "terrain" && <svg className="contour-lines" viewBox="0 0 500 500" fill="none">
      {Array.from({ length: 12 }, (_, index) => <g key={index} transform={`translate(250 250) scale(${1 - index * .073}) translate(-250 -250)`}>
        <path d={terrain} style={{ animationDirection: index % 2 ? "reverse" : "normal", animationDuration: `${18 + index * .7}s` }} />
      </g>)}
    </svg>}
    <svg className="contour-particles" viewBox={shape === "ring" ? "0 0 431 410" : "0 0 500 500"}>
      {[0, 1, 2, 3].map(index => <g key={index} transform={`translate(${shape === "ring" ? 215 : 250} ${shape === "ring" ? 205 : 250}) scale(${1 - index * .11}) translate(${shape === "ring" ? -215 : -250} ${shape === "ring" ? -205 : -250})`}>
        <circle r={index % 2 ? 1.8 : 2.5} style={{ offsetPath: `path('${shape === "ring" ? ring : terrain}')`, "--particle-delay": `${index * -8}s`, "--particle-duration": `${28 + index * 5}s` } as CSSProperties} />
      </g>)}
    </svg>
  </span>;
}

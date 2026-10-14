import type { CSSProperties } from "react";
import home from "../home.module.css";
import p from "../pages.module.css";
import { Header } from "./interactive";

type Variant = "posts" | "works" | "article" | "project" | "contact";

function Line({ width = "100%", height, className = "" }: { width?: string; height?: number; className?: string }) {
  return <span className={`${p.bone} ${p.boneLine} ${className}`} style={{ width, height } as CSSProperties} />;
}

function Card({ tall }: { tall?: boolean }) {
  return <li className={p.boneCard}>{tall ? <><span className={`${p.bone} ${p.boneTall}`} /><Line width="35%" /><Line width="70%" height={20} /></> : <><Line width="35%" /><Line width="85%" height={20} /><span className={`${p.bone} ${p.boneWide}`} /></>}</li>;
}

function Lines({ count }: { count: number }) {
  return <>{Array.from({ length: count }, (_, index) => <Line key={index} width={index === count - 1 ? "60%" : "100%"} />)}</>;
}

/** Loading state for the inner pages: the real header, then grey shapes in the layout the page will have. */
export function PageSkeleton({ variant }: { variant: Variant }) {
  return <main className={`${home.page} ${p.inner} site-shell`} aria-busy="true">
    <Header variant="inner" />
    <div className={`${p.banner} ${p.bone}`} />
    <div className={p.content}>
      <div className={p.container}>
        {(variant === "posts" || variant === "works") && <ul className={p.grid}>{Array.from({ length: 6 }, (_, index) => <Card key={index} tall={variant === "works"} />)}</ul>}
        {variant === "article" && <div className={p.details}>
          <div className={p.mainColumn}><div><Line width="80%" height={22} /><Lines count={5} /><span className={`${p.bone} ${p.boneImage}`} /><Lines count={4} /></div><span className={`${p.bone} ${p.boneForm}`} /></div>
          <div className={p.sidebar}><span className={`${p.bone} ${p.boneSearch}`} /><div><Line width="40%" height={20} /><Lines count={6} /></div></div>
        </div>}
        {variant === "project" && <div className={p.project}><span className={`${p.bone} ${p.projectImage}`} /><div><Line width="30%" /><Line width="80%" height={36} /><Lines count={3} /><Line width="45%" height={48} /></div></div>}
        {variant === "contact" && <div className={p.contact}><div><Line width="40%" /><Line width="75%" height={34} /><Lines count={4} /></div><span className={`${p.bone} ${p.boneForm}`} /></div>}
      </div>
    </div>
    <p className="sr-only" role="status">Loading page…</p>
  </main>;
}

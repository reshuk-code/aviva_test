"use client";

import type { ReactNode } from "react";
import c from "../cms.module.css";
import s from "../studio.module.css";
import { Icon } from "./ui";

/** A reorderable list of small forms (FAQs, steps, highlights…). */
export function Repeater<T>({ label, itemLabel, items, onChange, create, render, hint }: { label: string; itemLabel: string; items: T[]; onChange: (items: T[]) => void; create: () => T; render: (item: T, update: (item: T) => void, index: number) => ReactNode; hint?: string }) {
  const move = (index: number, direction: -1 | 1) => { const next = [...items]; [next[index], next[index + direction]] = [next[index + direction], next[index]]; onChange(next); };
  return <fieldset className={c.repeater}>
    <legend>{label}</legend>
    {hint && <p className={c.hint}>{hint}</p>}
    {items.map((item, index) => <div className={c.repeaterItem} key={index}>
      <div className={c.repeaterTop}>
        <span>{itemLabel} {index + 1}</span>
        <span>
          <button type="button" aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} up`} disabled={index === 0} onClick={() => move(index, -1)}><Icon name="up" /></button>
          <button type="button" aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} down`} disabled={index === items.length - 1} onClick={() => move(index, 1)}><Icon name="down" /></button>
          <button type="button" aria-label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`} onClick={() => onChange(items.filter((_, current) => current !== index))}><Icon name="trash" /></button>
        </span>
      </div>
      {render(item, (next) => onChange(items.map((current, position) => position === index ? next : current)), index)}
    </div>)}
    <button type="button" className={s.secondaryButton} onClick={() => onChange([...items, create()])}><Icon name="plus" />Add {itemLabel.toLowerCase()}</button>
  </fieldset>;
}

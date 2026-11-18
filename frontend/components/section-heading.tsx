import type { ReactNode } from "react";

export function SectionHeading({ index, eyebrow, title, copy, action }: { index?: string; eyebrow: string; title: string; copy?: string; action?: ReactNode }) {
  return (
    <div className="section-heading">
      <div className="section-heading-top">
        <span className="eyebrow">{eyebrow}</span>
        {index ? <span className="section-index">{index}</span> : null}
      </div>
      <div className="section-heading-body">
        <h2>{title}</h2>
        {copy ? <p>{copy}</p> : null}
        {action ? <div className="section-heading-action">{action}</div> : null}
      </div>
    </div>
  );
}

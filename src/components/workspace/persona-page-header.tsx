import type { ReactNode } from "react";

export function PersonaPageHeader({ title, description, children }: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return <header className="persona-page-header">
    <div className="persona-page-heading-group">
      <h1 className="persona-page-title" data-page-heading>{title}</h1>
      {description && <p className="persona-page-description">{description}</p>}
    </div>
    {children && <div className="persona-page-actions">{children}</div>}
  </header>;
}

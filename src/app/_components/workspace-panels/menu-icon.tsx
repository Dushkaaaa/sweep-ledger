export type MenuIconName =
  | "home"
  | "employees"
  | "clients"
  | "finance"
  | "stats"
  | "week"
  | "month"
  | "settings"
  | "logout";

export function MenuIcon({ name }: { name: MenuIconName }) {
  const commonProps = {
    className: "h-6 w-6",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "home") {
    return (
      <svg {...commonProps}>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M10 20v-6h4v6" />
      </svg>
    );
  }

  if (name === "employees") {
    return (
      <svg {...commonProps}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  if (name === "clients") {
    return (
      <svg {...commonProps}>
        <path d="M4 6h16" />
        <path d="M4 12h10" />
        <path d="M4 18h6" />
        <circle cx="17" cy="16" r="3" />
        <path d="m19 14 1 1" />
      </svg>
    );
  }

  if (name === "finance") {
    return (
      <svg {...commonProps}>
        <rect x="2" y="6" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
        <path d="M6 15h.01" />
        <path d="M10 15h4" />
      </svg>
    );
  }

  if (name === "stats") {
    return (
      <svg {...commonProps}>
        <path d="M4 19h16" />
        <path d="M7 15v-4" />
        <path d="M12 15V8" />
        <path d="M17 15v-7" />
      </svg>
    );
  }

  if (name === "week") {
    return (
      <svg {...commonProps}>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <path d="M3 10h18" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
      </svg>
    );
  }

  if (name === "month") {
    return (
      <svg {...commonProps}>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M8 16v-5" />
        <path d="M12 16V8" />
        <path d="M16 16v-3" />
      </svg>
    );
  }

  if (name === "settings") {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.04.04a2 2 0 1 1-2.82 2.82l-.04-.04A1.8 1.8 0 0 0 15 19.4a1.8 1.8 0 0 0-1 .6 1.8 1.8 0 0 0-.5 1.2V21a2 2 0 1 1-4 0v-.1a1.8 1.8 0 0 0-.5-1.2 1.8 1.8 0 0 0-1-.6 1.8 1.8 0 0 0-1.98.36l-.04.04a2 2 0 1 1-2.82-2.82l.04-.04A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-.6-1 1.8 1.8 0 0 0-1.2-.5H3a2 2 0 1 1 0-4h.1a1.8 1.8 0 0 0 1.2-.5 1.8 1.8 0 0 0 .6-1 1.8 1.8 0 0 0-.36-1.98l-.04-.04A2 2 0 1 1 7.32 3.16l.04.04A1.8 1.8 0 0 0 9 4.6a1.8 1.8 0 0 0 1-.6 1.8 1.8 0 0 0 .5-1.2V3a2 2 0 1 1 4 0v.1a1.8 1.8 0 0 0 .5 1.2 1.8 1.8 0 0 0 1 .6 1.8 1.8 0 0 0 1.98-.36l.04-.04a2 2 0 1 1 2.82 2.82l-.04.04A1.8 1.8 0 0 0 19.4 9c0 .38.22.72.6 1 .33.25.76.5 1.2.5h.8a2 2 0 1 1 0 4h-.8a1.8 1.8 0 0 0-1.2.5 1.8 1.8 0 0 0-.6 1Z" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M10 17 15 12 10 7" />
      <path d="M15 12H3" />
      <path d="M21 3v18" />
    </svg>
  );
}

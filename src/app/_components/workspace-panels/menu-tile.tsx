import { MenuIcon, type MenuIconName } from "./menu-icon";

export function MenuTile({
  title,
  hint,
  icon,
  badge,
  danger = false,
  disabled = false,
  onClick,
}: {
  title: string;
  hint: string;
  icon: MenuIconName;
  badge?: string;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group flex min-h-28 flex-col justify-between rounded-lg border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
        danger
          ? "border-rose-200 bg-rose-50 hover:border-rose-300 hover:bg-rose-100"
          : "border-slate-200 bg-slate-50 hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-[0_24px_50px_-30px_rgba(14,165,233,0.45)]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            danger
              ? "bg-rose-600 text-white"
              : "bg-slate-950 text-white group-hover:bg-sky-600"
          }`}
        >
          <MenuIcon name={icon} />
        </span>
        {badge ? (
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
            {badge}
          </span>
        ) : null}
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
        <p className="mt-1 text-sm leading-4 text-slate-500">{hint}</p>
      </div>
    </button>
  );
}
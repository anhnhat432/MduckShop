import { Link } from "react-router-dom";

function EmptyStateCard({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  icon,
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-soft">
      {icon && (
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-700">
          <span aria-hidden="true">{icon}</span>
        </div>
      )}
      {eyebrow && (
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
          {eyebrow}
        </p>
      )}
      <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
        {title}
      </h3>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
        {description}
      </p>
      {(actionLabel && actionTo) || (actionLabel && onAction) ? (
        actionTo ? (
          <Link to={actionTo} className="btn-secondary mt-6">
            {actionLabel}
          </Link>
        ) : (
          <button type="button" onClick={onAction} className="btn-secondary mt-6">
            {actionLabel}
          </button>
        )
      ) : null}
    </div>
  );
}

export default EmptyStateCard;
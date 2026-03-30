import { Link } from "react-router-dom";

function SectionHeading({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
  action,
  align = "between",
}) {
  return (
    <div
      className={`flex flex-wrap gap-4 ${
        align === "between"
          ? "items-end justify-between"
          : "items-start justify-between"
      }`}
    >
      <div className="max-w-2xl">
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            {description}
          </p>
        )}
      </div>

      {action ||
        (actionLabel &&
          actionTo && (
            <Link to={actionTo} className="btn-ghost">
              {actionLabel}
            </Link>
          ))}
    </div>
  );
}

export default SectionHeading;
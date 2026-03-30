const iconMap = {
  shipping: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm7.5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h11.1c.414 0 .75.336.75.75v8.25H6.878a2.625 2.625 0 00-2.475 1.74L3.75 16.5V5.25c0-.414.336-.75.75-.75z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5h2.379c.398 0 .779.158 1.06.44l1.371 1.37c.282.282.44.663.44 1.061v3.129h-5.25V7.5z" />
    </svg>
  ),
  returns: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992V4.356" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.985 19.644v-4.992h4.992" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.93 11.036A8.25 8.25 0 0118.622 7.42l2.393 1.928M19.07 12.964A8.25 8.25 0 015.378 16.58l-2.393-1.928" />
    </svg>
  ),
  secure: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.875a4.5 4.5 0 10-9 0V10.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 10.5h10.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75v-7.5a.75.75 0 01.75-.75z" />
    </svg>
  ),
  authentic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l2.25 2.25L15 9.75" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
    </svg>
  ),
  support: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9a3.375 3.375 0 116.75 0c0 1.762-1.25 2.625-2.188 3.188-.938.562-1.562 1.125-1.562 2.062v.375" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.008v.008H12V18z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
  ),
  payment: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M3.75 5.25h16.5A1.5 1.5 0 0121.75 6.75v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 15h2.25" />
    </svg>
  ),
  size: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 17.25h16.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75V4.5m0 15V17.25m7.5-10.5V4.5m0 15V17.25" />
    </svg>
  ),
};

function TrustBar({ items, compact = false, className = "" }) {
  return (
    <div
      className={`grid gap-3 ${
        compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"
      } ${className}`}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-4 shadow-soft"
        >
          <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
            {iconMap[item.icon] || iconMap.authentic}
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">{item.label}</p>
            {item.description && (
              <p className="mt-1 text-xs leading-6 text-slate-500">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrustBar;
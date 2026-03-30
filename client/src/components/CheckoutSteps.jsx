import { Link } from "react-router-dom";

const steps = [
  { label: "Giao hàng", path: "/shipping" },
  { label: "Thanh toán", path: "/payment" },
  { label: "Đặt hàng", path: "/placeorder" },
];

function CheckoutSteps({ step1, step2, step3 }) {
  const activeSteps = [step1, step2, step3];
  const currentStepIndex = activeSteps.lastIndexOf(true);

  return (
    <nav aria-label="Tiến trình thanh toán" className="mb-8">
      <ol className="flex items-center gap-2 sm:gap-3">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isActive = activeSteps[index];
          const isLast = index === steps.length - 1;

          return (
            <li key={step.label} className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                {isActive ? (
                  <Link
                    to={step.path}
                    aria-current={isCurrent ? "step" : undefined}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition ${
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isCurrent
                          ? "bg-orange-500 text-white shadow-[0_12px_24px_-14px_rgba(234,88,12,0.9)]"
                          : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {isCompleted ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </Link>
                ) : (
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
                    {index + 1}
                  </span>
                )}

                <span
                  className={`hidden text-sm font-semibold sm:block ${
                    isCurrent
                      ? "text-orange-600"
                      : isCompleted
                        ? "text-emerald-600"
                        : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {!isLast && (
                <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full transition-colors ${
                      isCompleted ? "bg-emerald-400" : "bg-slate-200"
                    }`}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default CheckoutSteps;
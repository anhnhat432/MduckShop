import { useEffect } from "react";

function ImageLightbox({
  open,
  images = [],
  activeIndex = 0,
  onClose,
  onSelectIndex,
  alt,
}) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight" && images.length > 1) {
        onSelectIndex((activeIndex + 1) % images.length);
      }

      if (event.key === "ArrowLeft" && images.length > 1) {
        onSelectIndex((activeIndex - 1 + images.length) % images.length);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, images.length, onClose, onSelectIndex, open]);

  if (!open || images.length === 0) {
    return null;
  }

  const hasMultipleImages = images.length > 1;
  const goToPrevious = () =>
    onSelectIndex((activeIndex - 1 + images.length) % images.length);
  const goToNext = () => onSelectIndex((activeIndex + 1) % images.length);

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/92 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Phóng to ảnh sản phẩm">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Đóng phóng to ảnh"
        onClick={onClose}
      />

      <div className="relative flex h-full flex-col justify-center px-4 py-5 sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
              Product gallery
            </p>
            <p className="mt-1 text-sm text-white/72">
              Ảnh {activeIndex + 1}/{images.length}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white transition hover:bg-white/12"
            aria-label="Đóng lightbox"
          >
            x
          </button>
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 items-center justify-center">
          {hasMultipleImages && (
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15 sm:inline-flex"
              aria-label="Ảnh trước"
            >
              ‹
            </button>
          )}

          <div className="flex h-full max-h-[78vh] w-full items-center justify-center px-10 sm:px-16">
            <img
              src={images[activeIndex]}
              alt={alt}
              className="max-h-full w-auto max-w-full object-contain"
            />
          </div>

          {hasMultipleImages && (
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-0 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15 sm:inline-flex"
              aria-label="Ảnh sau"
            >
              ›
            </button>
          )}
        </div>

        {hasMultipleImages && (
          <div className="mx-auto mt-4 flex w-full max-w-4xl gap-2 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => onSelectIndex(index)}
                aria-label={`Xem ảnh sản phẩm ${index + 1}`}
                aria-pressed={index === activeIndex}
                className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                  index === activeIndex
                    ? "border-orange-400"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <img src={image} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageLightbox;
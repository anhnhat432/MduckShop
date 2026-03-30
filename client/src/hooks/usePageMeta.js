import { useEffect } from "react";

const DEFAULT_TITLE = "ShoeStore | Cửa hàng giày online";
const DEFAULT_DESCRIPTION =
  "Khám phá các mẫu giày hot, chọn size phù hợp và đặt hàng nhanh trên ShoeStore.";
const DEFAULT_OG_IMAGE =
  "https://dummyimage.com/1200x630/e2e8f0/0f172a&text=ShoeStore";

const upsertMetaTag = (selector, attributes) => {
  let tag = document.head.querySelector(selector);

  if (!tag) {
    tag = document.createElement("meta");
    document.head.appendChild(tag);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    tag.setAttribute(key, value);
  });
};

function usePageMeta({ title, description, image, type = "website" }) {
  useEffect(() => {
    const nextTitle = title ? `${title} | ShoeStore` : DEFAULT_TITLE;
    const nextDescription = description || DEFAULT_DESCRIPTION;
    const nextImage = image || DEFAULT_OG_IMAGE;

    document.documentElement.lang = "vi";
    document.title = nextTitle;

    upsertMetaTag('meta[name="description"]', {
      name: "description",
      content: nextDescription,
    });
    upsertMetaTag('meta[property="og:title"]', {
      property: "og:title",
      content: nextTitle,
    });
    upsertMetaTag('meta[property="og:description"]', {
      property: "og:description",
      content: nextDescription,
    });
    upsertMetaTag('meta[property="og:type"]', {
      property: "og:type",
      content: type,
    });
    upsertMetaTag('meta[property="og:image"]', {
      property: "og:image",
      content: nextImage,
    });
    upsertMetaTag('meta[property="og:url"]', {
      property: "og:url",
      content: window.location.href,
    });
  }, [description, image, title, type]);
}

export default usePageMeta;

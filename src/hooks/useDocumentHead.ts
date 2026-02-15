import { useEffect } from "react";

interface DocumentHeadOptions {
  title: string;
  description: string;
  path?: string;
}

const BASE_URL = "https://jordanrivera.dev";
const SITE_NAME = "Jordan Rivera Portfolio";

/**
 * Updates document head meta tags for the current page.
 * Restores defaults on unmount.
 */
export function useDocumentHead({ title, description, path = "/" }: DocumentHeadOptions) {
  useEffect(() => {
    const fullTitle = `${title} — ${SITE_NAME}`;
    const url = `${BASE_URL}${path}`;

    document.title = fullTitle;

    setMeta("description", description);
    setMeta("title", fullTitle);

    setMetaProperty("og:title", fullTitle);
    setMetaProperty("og:description", description);
    setMetaProperty("og:url", url);

    setMetaProperty("twitter:title", fullTitle);
    setMetaProperty("twitter:description", description);
    setMetaProperty("twitter:url", url);

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = url;
  }, [title, description, path]);
}

function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function setMetaProperty(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.content = content;
}

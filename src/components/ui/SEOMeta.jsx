import { useEffect } from 'react';

const SITE_NAME = 'Альма';
const BASE_URL  = 'https://alma-retreat.ru';
const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1200&auto=format&fit=crop';

/**
 * Обновляет мета-теги страницы без сторонних библиотек.
 *
 * Использование в любом page-компоненте:
 *   <SEOMeta
 *     title="Территория | Альма"
 *     description="Барнхаусы, купели и лес..."
 *     path="/territory"
 *   />
 *
 * Пропсы:
 *   title       — полный title вкладки
 *   description — мета-описание (до 160 символов)
 *   image       — абсолютный URL og:image (по умолчанию — hero сайта)
 *   path        — путь страницы для canonical и og:url (например "/territory")
 *   noindex     — true для страниц, которые не должны индексироваться
 */
export default function SEOMeta({
  title,
  description,
  image = DEFAULT_IMAGE,
  path = '',
  noindex = false,
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const url = `${BASE_URL}${path}`;

    // title
    document.title = fullTitle;

    // Вспомогательная: обновить или создать мета-тег
    const setMeta = (selector, content) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [attr, val] = selector.replace(/[\[\]"]/g, ' ').trim().split(/\s+/);
        el.setAttribute(attr, val);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]',        description ?? '');
    setMeta('meta[name="robots"]',             noindex ? 'noindex, nofollow' : 'index, follow');

    setMeta('meta[property="og:title"]',       fullTitle);
    setMeta('meta[property="og:description"]', description ?? '');
    setMeta('meta[property="og:url"]',         url);
    setMeta('meta[property="og:image"]',       image);

    setMeta('meta[name="twitter:title"]',       fullTitle);
    setMeta('meta[name="twitter:description"]', description ?? '');
    setMeta('meta[name="twitter:image"]',       image);

    // canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [title, description, image, path, noindex]);

  return null;
}

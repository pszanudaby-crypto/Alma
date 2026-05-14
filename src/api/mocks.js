/**
 * Прокси-файл для обратной совместимости.
 * Страницы (Home, Territory, Philosophy) импортируют данные отсюда —
 * теперь они прозрачно идут через content.js (static fallback).
 *
 * Изменять этот файл не нужно. Для работы с данными — см. src/api/content.js.
 */
export {
  fetchHomeAudience,
  fetchTerritoryIntro,
  fetchTerritoryFeatures,
  fetchPhilosophySupportRoles,
} from './content.js';

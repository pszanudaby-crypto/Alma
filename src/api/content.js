import {
  HOME_AUDIENCE,
  TERRITORY_INTRO,
  TERRITORY_FEATURES,
  PHILOSOPHY_SUPPORT_ROLES,
} from '../data/static.js';

/**
 * Контент-сервис со статическими данными.
 *
 * Редактируемый контент можно подключить позднее через собственные API endpoints,
 * но публичные страницы уже сейчас работают без обращения к внешнему backend.
 */

/** Аудитория для главной страницы. */
export function fetchHomeAudience() {
  return HOME_AUDIENCE;
}

/** Вводный текст для страницы «Территория». */
export async function fetchTerritoryIntro() {
  return TERRITORY_INTRO;
}

/** Карточки секций на странице «Территория». */
export function fetchTerritoryFeatures() {
  return TERRITORY_FEATURES;
}

/** Специалисты на странице «Реабилитация». */
export function fetchPhilosophySupportRoles() {
  return PHILOSOPHY_SUPPORT_ROLES;
}

import { supabase, isSupabaseConfigured } from './supabase.js';
import {
  HOME_AUDIENCE,
  TERRITORY_INTRO,
  TERRITORY_FEATURES,
  PHILOSOPHY_SUPPORT_ROLES,
} from '../data/static.js';

/**
 * Контент-сервис с паттерном «Supabase-first, статика как fallback».
 *
 * Логика:
 *   1. Если Supabase не настроен → сразу возвращаем статические данные.
 *   2. Если таблица существует и вернула данные → используем их.
 *   3. Если таблицы нет / ошибка / пустой результат → возвращаем статику.
 *
 * Это позволяет сайту работать без единой строки в БД,
 * а позднее переключить контент на редактируемый через Supabase Dashboard.
 */

async function fromSupabase(table, transform, fallback) {
  if (!isSupabaseConfigured || !supabase) return fallback;

  try {
    const { data, error } = await supabase.from(table).select('*').order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) return fallback;
    return transform(data);
  } catch {
    return fallback;
  }
}

/** Аудитория для главной страницы. Таблица: `home_audience` (sort_order, title, description). */
export function fetchHomeAudience() {
  return fromSupabase(
    'home_audience',
    (rows) => rows.map((r) => ({ t: r.title, d: r.description })),
    HOME_AUDIENCE,
  );
}

/** Вводный текст для страницы «Территория». Таблица: `territory_intro` (sort_order, text). */
export async function fetchTerritoryIntro() {
  if (!isSupabaseConfigured || !supabase) return TERRITORY_INTRO;
  try {
    const { data, error } = await supabase
      .from('territory_intro')
      .select('text')
      .order('sort_order')
      .limit(1)
      .maybeSingle();
    if (error || !data?.text) return TERRITORY_INTRO;
    return data.text;
  } catch {
    return TERRITORY_INTRO;
  }
}

/**
 * Карточки секций на странице «Территория».
 * Таблица: `territory_features` (sort_order, kind, image_src, image_alt, image_class_name, tag, title, description).
 */
export function fetchTerritoryFeatures() {
  return fromSupabase(
    'territory_features',
    (rows) =>
      rows.map((r) => ({
        kind: r.kind,
        imageSrc: r.image_src,
        imageAlt: r.image_alt,
        imageClassName: r.image_class_name ?? '',
        tag: r.tag,
        title: r.title,
        description: r.description,
      })),
    TERRITORY_FEATURES,
  );
}

/**
 * Специалисты на странице «Реабилитация».
 * Таблица: `philosophy_support_roles` (sort_order, icon, title, description).
 */
export function fetchPhilosophySupportRoles() {
  return fromSupabase(
    'philosophy_support_roles',
    (rows) => rows.map((r) => ({ icon: r.icon, title: r.title, description: r.description })),
    PHILOSOPHY_SUPPORT_ROLES,
  );
}

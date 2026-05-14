import { supabase } from './supabase.js';

/**
 * Сервисный слой для работы с таблицами `posts` и `comments`.
 * Компоненты импортируют функции отсюда — прямых вызовов supabase в UI нет.
 *
 * Схема таблиц (минимальная):
 *   posts    — id, title, content, category, media_url, created_at, author_id
 *   comments — id, post_id, user_id, content, created_at
 *   profiles — id, display_name, role, email
 */

// ─── SELECT-запрос с join профилей через PostgREST ──────────────────────────
const POSTS_FULL_SELECT =
  '*, profiles:author_id(display_name), comments(*, profiles:user_id(display_name))';

/**
 * Нормализует ответ PostgREST: вложенные объекты `profiles` превращаются
 * в плоские `users`, чтобы UI работал с единым форматом.
 */
function normalizePosts(rows = []) {
  return rows.map((post) => {
    const authorRaw = post.profiles ?? post.users;
    const authorOne = Array.isArray(authorRaw) ? authorRaw[0] : authorRaw;
    const users =
      authorOne && typeof authorOne === 'object'
        ? { id: authorOne.id ?? post.author_id, display_name: authorOne.display_name }
        : authorOne ?? null;

    const comments = (post.comments ?? [])
      .map((c) => {
        const profRaw = c.profiles ?? c.users;
        const profOne = Array.isArray(profRaw) ? profRaw[0] : profRaw;
        return {
          ...c,
          users:
            profOne && typeof profOne === 'object'
              ? { id: profOne.id ?? c.user_id, display_name: profOne.display_name }
              : profOne ?? null,
        };
      })
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    return { ...post, users, comments };
  });
}

/**
 * Запасной путь: загружает посты и комментарии отдельными запросами,
 * затем соединяет их в памяти. Нужен при отсутствии прав на join или FK.
 */
async function fetchPostsFallback() {
  const { data: postList, error: errPosts } = await supabase
    .from('posts')
    .select('id, title, content, category, media_url, created_at, author_id')
    .order('created_at', { ascending: false });

  if (errPosts) throw errPosts;

  const posts = postList ?? [];
  const postIds = posts.map((p) => p.id);

  let comments = [];
  if (postIds.length > 0) {
    // Пробуем с join профилей, при неудаче — без него
    let res = await supabase
      .from('comments')
      .select('id, post_id, user_id, content, created_at, profiles:user_id(display_name)')
      .in('post_id', postIds);

    if (res.error) {
      res = await supabase
        .from('comments')
        .select('id, post_id, user_id, content, created_at')
        .in('post_id', postIds);
    }
    if (res.error) throw res.error;
    comments = res.data ?? [];
  }

  // Загружаем профили одним запросом
  const allUserIds = [
    ...new Set([
      ...posts.map((p) => p.author_id),
      ...comments.map((c) => c.user_id),
    ].filter(Boolean)),
  ];

  const profileMap = {};
  if (allUserIds.length > 0) {
    const { data: profileRows, error: errProf } = await supabase
      .from('profiles')
      .select('id, display_name')
      .in('id', allUserIds);
    if (errProf) throw errProf;
    for (const p of profileRows ?? []) profileMap[p.id] = p;
  }

  // Группируем комментарии по посту
  const commentsByPost = {};
  for (const c of comments) {
    const embedded = c.profiles ?? null;
    const profOne = Array.isArray(embedded) ? embedded[0] : embedded;
    const users = profOne
      ? { id: profOne.id ?? c.user_id, display_name: profOne.display_name }
      : profileMap[c.user_id]
        ? { id: profileMap[c.user_id].id, display_name: profileMap[c.user_id].display_name }
        : null;

    (commentsByPost[c.post_id] ??= []).push({ ...c, users });
  }

  return posts.map((post) => {
    const author = profileMap[post.author_id];
    const sortedComments = (commentsByPost[post.id] ?? []).sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at),
    );
    return {
      ...post,
      users: author ? { id: author.id, display_name: author.display_name } : null,
      comments: sortedComments,
    };
  });
}

// ─── PUBLIC API ──────────────────────────────────────────────────────────────

/**
 * Загружает все посты со вложенными комментариями и профилями авторов.
 * Пробует полный join; при ошибке — fallback с раздельными запросами.
 */
export async function fetchPosts() {
  if (!supabase) return [];

  const { data: rows, error } = await supabase
    .from('posts')
    .select(POSTS_FULL_SELECT)
    .order('created_at', { ascending: false });

  if (!error && rows) return normalizePosts(rows);

  // Fallback: join не сработал (RLS / схема), пробуем раздельные запросы
  console.warn('[posts] Full select failed, switching to fallback:', error?.message);
  return fetchPostsFallback();
}

/** Удаляет пост по id. */
export async function deletePost(postId) {
  if (!supabase) throw new Error('Supabase не подключён');
  const { error } = await supabase.from('posts').delete().eq('id', postId);
  if (error) throw error;
}

/**
 * Создаёт комментарий. Возвращает созданную запись с профилем пользователя.
 */
export async function createComment({ postId, userId, content }) {
  if (!supabase) throw new Error('Supabase не подключён');

  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, user_id: userId, content })
    .select('id, content, created_at, user_id, profiles:user_id(display_name)')
    .single();

  if (error) throw error;

  // Нормализуем профиль в users
  const profRaw = data?.profiles ?? null;
  const profOne = Array.isArray(profRaw) ? profRaw[0] : profRaw;
  const users = profOne?.display_name
    ? { id: profOne.id ?? userId, display_name: profOne.display_name }
    : null;

  return { ...data, users };
}

/** Удаляет комментарий по id. */
export async function deleteComment(commentId) {
  if (!supabase) throw new Error('Supabase не подключён');
  const { error } = await supabase.from('comments').delete().eq('id', commentId);
  if (error) throw error;
}

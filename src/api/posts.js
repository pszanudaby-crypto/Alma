import { apiRequest } from './client.js';

// ─── PUBLIC API ──────────────────────────────────────────────────────────────

/**
 * Загружает все посты со вложенными комментариями и профилями авторов.
 * Пробует полный join; при ошибке — fallback с раздельными запросами.
 */
export async function fetchPosts() {
  return apiRequest('/api/posts');
}

/** Удаляет пост по id. */
export async function deletePost(postId) {
  return apiRequest(`/api/posts/${postId}`, { method: 'DELETE' });
}

/**
 * Создаёт комментарий. Возвращает созданную запись с профилем пользователя.
 */
export async function createComment({ postId, userId, content }) {
  return apiRequest(`/api/posts/${postId}/comments`, {
    method: 'POST',
    body: { userId, content },
  });
}

/** Удаляет комментарий по id. */
export async function deleteComment(commentId) {
  return apiRequest(`/api/comments/${commentId}`, { method: 'DELETE' });
}

export async function savePost({ id, title, content, category, media_url: mediaUrl }) {
  return apiRequest(id ? `/api/posts/${id}` : '/api/posts', {
    method: id ? 'PATCH' : 'POST',
    body: {
      title,
      content,
      category,
      media_url: mediaUrl,
    },
  });
}

export async function uploadMedia(file) {
  const form = new FormData();
  form.append('file', file);
  return apiRequest('/api/media', {
    method: 'POST',
    body: form,
  });
}

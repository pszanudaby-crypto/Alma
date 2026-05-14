import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createComment, deleteComment, deletePost, fetchPosts } from '../api/posts.js';
import { isApiConfigured } from '../api/client.js';

/** Ключ кеша — используется при инвалидации и optimistic updates. */
export const POSTS_QUERY_KEY = ['posts'];

// ─── READ ────────────────────────────────────────────────────────────────────

/**
 * Загружает список постов с комментариями и профилями авторов.
 * Автоматически обновляется в фоне каждые 60 секунд.
 * При API = null сразу возвращает пустой массив без запроса.
 */
export function usePosts() {
  return useQuery({
    queryKey: POSTS_QUERY_KEY,
    queryFn: fetchPosts,
    staleTime: 60_000,
    enabled: isApiConfigured,
    placeholderData: [],
  });
}

// ─── MUTATIONS ───────────────────────────────────────────────────────────────

/**
 * Добавляет комментарий с optimistic update:
 *   1. Сразу вставляет временный комментарий в кеш (мгновенная реакция UI).
 *   2. При ошибке — откатывает кеш к предыдущему состоянию.
 *   3. При успехе или ошибке — синхронизирует данные с сервером.
 *
 * Использование:
 *   const { mutate: addComment, isPending } = useAddComment();
 *   addComment({ postId, userId, content, optimisticUser });
 */
export function useAddComment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId, content }) => createComment({ postId, userId, content }),

    onMutate: async ({ postId, userId, content, optimisticUser }) => {
      // Отменяем любые текущие запросы на посты, чтобы не перетереть optimistic update
      await qc.cancelQueries({ queryKey: POSTS_QUERY_KEY });
      const previous = qc.getQueryData(POSTS_QUERY_KEY);

      const tempComment = {
        id: `temp-${Date.now()}`,
        post_id: postId,
        user_id: userId,
        content,
        created_at: new Date().toISOString(),
        users: optimisticUser,
      };

      qc.setQueryData(POSTS_QUERY_KEY, (old = []) =>
        old.map((p) =>
          p.id === postId
            ? { ...p, comments: [...(p.comments ?? []), tempComment] }
            : p,
        ),
      );

      return { previous, tempId: tempComment.id };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(POSTS_QUERY_KEY, context.previous);
      }
    },

    onSuccess: (serverComment, { postId }, context) => {
      // Заменяем temp-запись на подтверждённую с сервера
      qc.setQueryData(POSTS_QUERY_KEY, (old = []) =>
        old.map((p) =>
          p.id !== postId
            ? p
            : {
                ...p,
                comments: (p.comments ?? [])
                  .filter((c) => c.id !== context.tempId)
                  .concat(serverComment)
                  .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
              },
        ),
      );
    },

    onSettled: () => {
      // Финальная синхронизация с сервером
      qc.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
}

/**
 * Удаляет пост. Мгновенно убирает его из UI (optimistic), откатывает при ошибке.
 *
 * Использование:
 *   const { mutate: removePost } = useDeletePost();
 *   removePost(postId);
 */
export function useDeletePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deletePost,

    onMutate: async (postId) => {
      await qc.cancelQueries({ queryKey: POSTS_QUERY_KEY });
      const previous = qc.getQueryData(POSTS_QUERY_KEY);
      qc.setQueryData(POSTS_QUERY_KEY, (old = []) => old.filter((p) => p.id !== postId));
      return { previous };
    },

    onError: (_err, _postId, context) => {
      if (context?.previous) qc.setQueryData(POSTS_QUERY_KEY, context.previous);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
}

/**
 * Удаляет комментарий. Мгновенно убирает из UI, откатывает при ошибке.
 *
 * Использование:
 *   const { mutate: removeComment } = useDeleteComment();
 *   removeComment({ postId, commentId });
 */
export function useDeleteComment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }) => deleteComment(commentId),

    onMutate: async ({ postId, commentId }) => {
      await qc.cancelQueries({ queryKey: POSTS_QUERY_KEY });
      const previous = qc.getQueryData(POSTS_QUERY_KEY);

      qc.setQueryData(POSTS_QUERY_KEY, (old = []) =>
        old.map((p) =>
          p.id !== postId
            ? p
            : { ...p, comments: (p.comments ?? []).filter((c) => c.id !== commentId) },
        ),
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) qc.setQueryData(POSTS_QUERY_KEY, context.previous);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
}

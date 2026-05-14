import React, { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Loader2, Lock, MessageCircle, Send, Trash2, User } from 'lucide-react';
import { useAddComment, useDeleteComment } from '../../../hooks/usePosts.js';

function formatDate(iso) {
  if (!iso) return '';
  try {
    return format(new Date(iso), 'd MMMM yyyy, HH:mm', { locale: ru });
  } catch {
    return iso;
  }
}

/**
 * Секция комментариев к записи дневника.
 *
 * Пропсы:
 *   postId       — id поста
 *   comments     — массив комментариев (уже нормализованных)
 *   sessionUser  — текущий пользователь (null если не залогинен)
 *   isAdmin      — показывать ли кнопки удаления
 *   onJoinClick  — callback для открытия JoinModal
 */
export default function CommentSection({ postId, comments, sessionUser, isAdmin, onJoinClick }) {
  const [text, setText] = useState('');

  const { mutate: addComment, isPending: submitting, error: commentError } = useAddComment();
  const { mutate: removeComment } = useDeleteComment();

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!sessionUser || !content || submitting) return;

    const optimisticUser = {
      id: sessionUser.id,
      display_name:
        sessionUser.user_metadata?.display_name ??
        sessionUser.user_metadata?.full_name ??
        (sessionUser.email ? sessionUser.email.split('@')[0] : 'Вы'),
    };

    addComment(
      { postId, userId: sessionUser.id, content, optimisticUser },
      { onSuccess: () => setText('') },
    );
  };

  return (
    <div className="mt-10 pt-10 border-t border-[#E5E3DB]">
      <div className="flex items-center gap-2 text-[#2D332F] mb-6">
        <MessageCircle className="w-5 h-5 text-[#4A5D4E]" />
        <span className="font-serif text-lg">Обсуждение</span>
        <span className="text-xs text-[#5A635D]/70">({comments.length})</span>
      </div>

      {/* Список комментариев */}
      <ul className="space-y-4 mb-8">
        {comments.length === 0 && (
          <li className="text-sm text-[#5A635D]/70 italic">Комментариев пока нет.</li>
        )}
        {comments.map((c) => (
          <li
            key={c.id}
            className="rounded-2xl border border-[#E5E3DB] bg-[#F5F4F0]/50 px-5 py-4 flex gap-4 items-start"
          >
            <div className="shrink-0 w-10 h-10 rounded-full bg-[#E5E3DB] flex items-center justify-center text-[#4A5D4E]">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex flex-wrap items-baseline gap-x-2 min-w-0">
                  <span className="text-sm font-semibold text-[#2D332F]">
                    {c.users?.display_name ?? 'Участник'}
                  </span>
                  <time className="text-[11px] text-[#5A635D]/70 uppercase tracking-wider">
                    {formatDate(c.created_at)}
                  </time>
                </div>
                {isAdmin && !String(c.id).startsWith('temp-') && (
                  <button
                    type="button"
                    onClick={() => removeComment({ postId, commentId: c.id })}
                    className="shrink-0 p-1.5 rounded-lg text-[#5A635D] hover:text-red-900/85 opacity-50 hover:opacity-100 transition-opacity"
                    aria-label="Удалить комментарий"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                )}
              </div>
              <p className="text-sm text-[#5A635D] leading-relaxed">{c.content}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* CTA для незалогиненных */}
      {!sessionUser && (
        <div className="rounded-[1.75rem] border border-white/30 bg-white/40 backdrop-blur-xl px-6 py-8 md:px-10 shadow-[0_20px_50px_-24px_rgba(45,51,47,0.35)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#4A5D4E]/15 flex items-center justify-center border border-[#4A5D4E]/20">
                <Lock className="w-6 h-6 text-[#4A5D4E]" />
              </div>
              <div>
                <p className="font-serif text-lg text-[#2D332F] mb-1">Участвуйте в обсуждении</p>
                <p className="text-sm text-[#5A635D] font-light leading-relaxed">
                  Войдите через email и пароль, чтобы оставлять комментарии.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onJoinClick}
              className="shrink-0 px-8 py-3.5 rounded-full bg-[#2D332F] text-[#F5F4F0] text-sm font-semibold hover:bg-[#4A5D4E] transition-colors shadow-lg text-center"
            >
              Войти, чтобы присоединиться
            </button>
          </div>
        </div>
      )}

      {/* Форма комментария для залогиненных */}
      {sessionUser && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#E5E3DB] bg-[#F5F4F0]/40 p-5 md:p-6"
        >
          <label htmlFor={`comment-${postId}`} className="sr-only">Ваш комментарий</label>
          <textarea
            id={`comment-${postId}`}
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submitting}
            placeholder="Напишите комментарий…"
            className="w-full rounded-xl bg-white border border-[#E5E3DB] px-4 py-3 text-sm text-[#2D332F] placeholder:text-[#5A635D]/45 focus:outline-none focus:ring-2 focus:ring-[#4A5D4E] resize-y min-h-[100px] disabled:opacity-60"
          />
          {commentError && (
            <p className="mt-3 text-sm text-red-800 font-medium leading-relaxed">
              {commentError.message ?? 'Не удалось отправить комментарий.'}
            </p>
          )}
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#4A5D4E] text-[#F5F4F0] text-sm font-semibold hover:bg-[#3d4d41] disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-md"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Отправить
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

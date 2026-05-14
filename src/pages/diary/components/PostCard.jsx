import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Pencil, Trash2 } from 'lucide-react';
import { useDeletePost } from '../../../hooks/usePosts.js';
import CommentSection from './CommentSection.jsx';

function formatDate(iso) {
  if (!iso) return '';
  try {
    return format(new Date(iso), 'd MMMM yyyy, HH:mm', { locale: ru });
  } catch {
    return iso;
  }
}

function getMediaKind(url) {
  if (!url || typeof url !== 'string') return null;
  const path = url.split('?')[0].toLowerCase();
  if (['.mp4', '.webm', '.mov', '.m4v', '.ogv', '.ogg'].some((e) => path.endsWith(e))) return 'video';
  return 'image';
}

/**
 * Карточка одной записи дневника стройки.
 *
 * Пропсы:
 *   post         — объект поста (нормализованный через posts.js)
 *   sessionUser  — текущий пользователь
 *   isAdmin      — показывать ли кнопки редактирования/удаления
 *   onEdit       — callback (post) => void для открытия PostModal
 *   onJoinClick  — callback для JoinModal
 */
export default function PostCard({ post, sessionUser, isAdmin, onEdit, onJoinClick }) {
  const { mutate: removePost } = useDeletePost();

  return (
    <article className="rounded-[2rem] bg-white p-8 md:p-10 shadow-[0_8px_44px_-20px_rgba(45,51,47,0.18)] border border-[#E5E3DB]/80 relative overflow-hidden hover:shadow-[0_12px_48px_-18px_rgba(45,51,47,0.22)] transition-shadow duration-500">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[radial-gradient(circle_at_100%_0%,#4A5D4E_0%,transparent_55%)]" />

      <div className="relative">
        {/* Мета: категория, дата, admin-кнопки */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#8F9779]">
            <span className="px-3 py-1 rounded-full bg-[#F5F4F0] border border-[#E5E3DB] text-[#4A5D4E] font-medium tracking-[0.14em]">
              {post.category?.trim() || 'Стройка'}
            </span>
            <time className="text-[#5A635D]/80">{formatDate(post.created_at)}</time>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => onEdit(post)}
                className="p-2 rounded-full text-[#5A635D] hover:text-[#2D332F] hover:bg-[#F5F4F0] opacity-50 hover:opacity-100 transition-all"
                aria-label="Редактировать запись"
              >
                <Pencil className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => removePost(post.id)}
                className="p-2 rounded-full text-[#5A635D] hover:text-red-900/90 hover:bg-red-50/60 opacity-50 hover:opacity-100 transition-all"
                aria-label="Удалить запись"
              >
                <Trash2 className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>

        {/* Заголовок и автор */}
        <h2 className="text-2xl md:text-3xl font-serif text-[#2D332F] mb-4 leading-tight">
          {post.title}
        </h2>
        <p className="text-sm text-[#5A635D] mb-8">
          Автор:{' '}
          <span className="text-[#2D332F] font-medium">
            {post.users?.display_name ?? 'Команда Альма'}
          </span>
        </p>

        {/* Контент */}
        <p className="text-[#5A635D] font-light leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Медиа */}
        {post.media_url && (
          getMediaKind(post.media_url) === 'video' ? (
            <video src={post.media_url} controls className="w-full rounded-xl mt-4" />
          ) : (
            <img src={post.media_url} alt="Медиа стройки" className="w-full rounded-xl mt-4 object-cover" />
          )
        )}

        {/* Комментарии */}
        <CommentSection
          postId={post.id}
          comments={post.comments ?? []}
          sessionUser={sessionUser}
          isAdmin={isAdmin}
          onJoinClick={onJoinClick}
        />
      </div>
    </article>
  );
}

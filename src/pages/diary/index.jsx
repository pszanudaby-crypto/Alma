import React, { useState } from 'react';
import { BookOpen, Loader2, Plus, Sparkles } from 'lucide-react';
import FadeUp from '../../components/ui/FadeUp.jsx';
import SEOMeta from '../../components/ui/SEOMeta.jsx';
import PostModal from '../../components/auth/PostModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePosts } from '../../hooks/usePosts.js';
import PostCard from './components/PostCard.jsx';
import JoinModal from './components/JoinModal.jsx';

/**
 * Страница «Дневник стройки» (/construction-diary).
 *
 * Структура:
 *   Hero-секция        → заголовок и описание
 *   Посты              → список записей через PostCard
 *     └─ PostCard      → контент + медиа + CommentSection
 *   JoinModal          → вход по magic-link (OTP)
 *   PostModal          → создание / редактирование записи (только admin)
 */
export default function ConstructionDiary() {
  const { session, role, loading: authLoading, hasPersistedAuthHint, signInWithOtp, signOut, isSupabaseConfigured } = useAuth();
  const sessionUser = session?.user ?? null;
  const isAdmin = role === 'admin';

  const { data: posts = [], isLoading: loadingPosts, error: postsError, refetch } = usePosts();

  const [joinOpen, setJoinOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [postForModal, setPostForModal] = useState(null);

  const authAreaReady = !authLoading || sessionUser || (authLoading && hasPersistedAuthHint);
  const authHydrating = authLoading && !sessionUser && hasPersistedAuthHint;

  const openNewPost = () => { setPostForModal(null); setPostModalOpen(true); };
  const openEditPost = (post) => { setPostForModal(post); setPostModalOpen(true); };
  const closePostModal = () => { setPostModalOpen(false); setPostForModal(null); };

  return (
    <div className="page-transition min-h-screen bg-gradient-to-b from-[#EDEAE3] via-[#F5F4F0] to-[#F5F4F0] text-[#2D332F] relative overflow-hidden">
      <SEOMeta
        title="Дневник стройки"
        description="Живые отчёты и фотографии с площадки «Альма» — следите за ходом строительства и присоединяйтесь к сообществу проекта."
        path="/construction-diary"
      />
      {/* Декоративный фон */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234A5D4E' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,#4A5D4E_0%,transparent_55%),radial-gradient(circle_at_90%_20%,#8F9779_0%,transparent_32%)]" />

      {/* Hero */}
      <section className="relative pt-24 sm:pt-28 pb-12 md:pb-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <div className="rounded-[2rem] border border-[#E5E3DB]/90 bg-white/55 backdrop-blur-xl p-8 md:p-12 shadow-[0_4px_40px_-12px_rgba(45,51,47,0.15)]">
              <div className="h-px w-16 bg-gradient-to-r from-[#4A5D4E] to-transparent mb-8 rounded-full" aria-hidden />
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5F4F0]/90 border border-[#E5E3DB] text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#2D332F] mb-8 shadow-sm font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#4A5D4E]" />
                Комьюнити Альма
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2D332F] leading-[1.12] mb-6 tracking-tight">
                Дневник <span className="text-[#4A5D4E] italic font-normal">стройки</span>
              </h1>
              <p className="max-w-2xl text-lg md:text-xl text-[#4A5D4E] font-light leading-relaxed border-l-2 border-[#8F9779]/40 pl-6">
                Новости с площадки, решения команды и обсуждения — в спокойной тональности проекта «Альма».
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Список постов */}
      <section className="relative pb-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Кнопка «Добавить запись» для admin */}
          {isAdmin && isSupabaseConfigured && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={openNewPost}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E5E3DB] bg-white/70 text-sm font-serif text-[#2D332F] tracking-wide hover:border-[#4A5D4E]/35 hover:bg-white transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#4A5D4E]" strokeWidth={1.75} />
                Добавить новую запись
              </button>
            </div>
          )}

          {/* Предупреждение об отсутствии Supabase */}
          {!isSupabaseConfigured && (
            <div className="rounded-[2rem] border border-amber-200/80 bg-amber-50/90 backdrop-blur-md px-6 py-5 text-sm text-amber-950 shadow-sm">
              В <code>.env</code> не заданы переменные Supabase — дневник недоступен. Добавьте{' '}
              <code className="text-xs bg-white/70 px-1.5 py-0.5 rounded">VITE_SUPABASE_URL</code> и{' '}
              <code className="text-xs bg-white/70 px-1.5 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code>, затем перезапустите dev-сервер.
            </div>
          )}

          {/* Строка текущего пользователя */}
          {authAreaReady && !authHydrating && sessionUser && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
              <span className="text-sm text-[#5A635D] text-right sm:order-1 sm:mr-2">{sessionUser.email}</span>
              <button
                type="button"
                onClick={() => signOut()}
                className="text-sm font-medium text-[#5A635D] hover:text-[#2D332F] border border-[#E5E3DB] bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full transition-colors shadow-sm sm:order-2"
              >
                Выйти
              </button>
            </div>
          )}

          {/* Скелетон загрузки */}
          {loadingPosts && (
            <div className="space-y-8">
              {[0, 1].map((key) => (
                <div key={key} className="animate-pulse rounded-[2rem] h-64 bg-gray-200/90 border border-[#E5E3DB]" />
              ))}
            </div>
          )}

          {/* Ошибка загрузки */}
          {!loadingPosts && postsError && (
            <div className="rounded-[2rem] border border-red-200 bg-red-50/90 backdrop-blur-xl p-8 text-center shadow-sm">
              <p className="text-sm text-red-900 mb-2">{postsError.message ?? 'Не удалось загрузить дневник'}</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#4A5D4E] text-[#F5F4F0] text-sm hover:bg-[#3d4d41] transition-colors"
              >
                Повторить
              </button>
            </div>
          )}

          {/* Пустое состояние */}
          {!loadingPosts && !postsError && posts.length === 0 && (
            <div className="rounded-[2.5rem] border border-[#E5E3DB] bg-white/90 backdrop-blur-sm p-12 md:p-16 text-center shadow-[0_12px_40px_-24px_rgba(45,51,47,0.14)]">
              <BookOpen className="w-10 h-10 mx-auto mb-6 text-[#4A5D4E] opacity-70" />
              <h2 className="text-2xl font-serif text-[#2D332F] mb-3">Пока нет записей</h2>
              <p className="text-[#5A635D] text-sm max-w-md mx-auto leading-relaxed">
                Когда в базе появятся посты об этапах стройки, они отобразятся здесь.
              </p>
            </div>
          )}

          {/* Посты */}
          {!loadingPosts && !postsError && posts.map((post, idx) => (
            <FadeUp key={post.id} delay={idx * 60}>
              <PostCard
                post={post}
                listIndex={idx}
                sessionUser={sessionUser}
                isAdmin={isAdmin}
                onEdit={openEditPost}
                onJoinClick={() => setJoinOpen(true)}
              />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Модалка создания/редактирования (только admin) */}
      {postModalOpen && isAdmin && sessionUser && (
        <PostModal
          isOpen={postModalOpen}
          onClose={closePostModal}
          post={postForModal}
          userId={sessionUser.id}
          onSaved={refetch}
        />
      )}

      {/* Модалка входа по magic-link */}
      <JoinModal
        isOpen={joinOpen}
        onClose={() => setJoinOpen(false)}
        onSubmit={signInWithOtp}
      />
    </div>
  );
}

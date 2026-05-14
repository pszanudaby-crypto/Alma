import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, Loader2, Paperclip, X } from 'lucide-react';
import { savePost, uploadMedia } from '../../api/posts.js';

const defaultForm = () => ({ title: '', content: '', category: '' });

/**
 * Модалка создания / редактирования записи в дневнике стройки.
 * Пропсы: isOpen, onClose, post (для режима редактирования), userId, onSaved.
 */
export default function PostModal({ isOpen, onClose, post, userId, onSaved }) {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(defaultForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setSelectedFile(null);
    setIsUploadingMedia(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setForm(post?.id ? { title: post.title ?? '', content: post.content ?? '', category: post.category ?? '' } : defaultForm());
  }, [isOpen, post]);

  if (!isOpen) return null;

  const isEdit = Boolean(post?.id);

  const handlePickFile = () => fileInputRef.current?.click();
  const handleFileChange = (e) => { setSelectedFile(e.target.files?.[0] ?? null); setError(null); };
  const clearFile = () => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    const title = form.title.trim();
    const content = form.content.trim();
    const category = form.category.trim();
    if (!title || !content) { setError('Заполните заголовок и текст записи.'); return; }

    setSaving(true);
    setError(null);
    let mediaUrl = isEdit ? (post.media_url ?? null) : null;

    try {
      if (selectedFile) {
        setIsUploadingMedia(true);
        const uploadData = await uploadMedia(selectedFile);
        setIsUploadingMedia(false);
        mediaUrl = uploadData?.url ?? null;
        if (!mediaUrl) throw new Error('Не удалось получить публичную ссылку на файл.');
      }

      await savePost({ id: post?.id, title, content, category: category || null, media_url: mediaUrl });
      await onSaved?.();
      onClose();
    } catch (err) {
      console.error('[PostModal]', err);
      setError(err.message ?? 'Не удалось сохранить запись.');
    } finally {
      setIsUploadingMedia(false);
      setSaving(false);
    }
  };

  const busy = saving || isUploadingMedia;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#2D332F]/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="post-modal-title">
      <div className="relative w-full max-w-lg rounded-[1.75rem] border border-[#E5E3DB] bg-[#F5F4F0]/95 backdrop-blur-2xl shadow-[0_24px_80px_-32px_rgba(45,51,47,0.35)] overflow-hidden max-h-[min(90vh,720px)] flex flex-col">
        <button type="button" onClick={() => !busy && onClose()} className="absolute top-4 right-4 p-2 rounded-full bg-white/60 hover:bg-white border border-[#E5E3DB] text-[#2D332F] transition-colors z-10" aria-label="Закрыть" disabled={busy}>
          <X className="w-5 h-5" />
        </button>

        <div className="px-8 pt-10 pb-6 border-b border-[#E5E3DB]/80 shrink-0">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#8F9779] mb-2 font-semibold">Дневник</p>
          <h2 id="post-modal-title" className="text-2xl font-serif text-[#2D332F] tracking-tight">{isEdit ? 'Редактировать запись' : 'Новая запись'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-8 py-6 space-y-5 overflow-y-auto flex-1">
            {[
              { id: 'post-title', label: 'Заголовок', key: 'title', type: 'input', placeholder: 'Название записи', extra: 'font-serif' },
              { id: 'post-category', label: 'Категория', key: 'category', type: 'input', placeholder: 'Например: Стройка, Благоустройство' },
            ].map(({ id, label, key, placeholder, extra = '' }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-[10px] uppercase tracking-[0.2em] text-[#5A635D] mb-2 font-medium">{label}</label>
                <input
                  id={id} type="text" value={form[key]} disabled={busy} placeholder={placeholder}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className={`w-full rounded-xl bg-white border border-[#E5E3DB] px-4 py-3 text-sm text-[#2D332F] placeholder:text-[#5A635D]/35 focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]/40 focus:border-[#4A5D4E]/30 disabled:opacity-50 ${extra}`}
                />
              </div>
            ))}

            <div>
              <label htmlFor="post-content" className="block text-[10px] uppercase tracking-[0.2em] text-[#5A635D] mb-2 font-medium">Контент</label>
              <textarea
                id="post-content" rows={8} value={form.content} disabled={busy} placeholder="Текст записи…"
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                className="w-full rounded-xl bg-white border border-[#E5E3DB] px-4 py-3 text-sm text-[#2D332F] leading-relaxed placeholder:text-[#5A635D]/35 focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]/40 focus:border-[#4A5D4E]/30 resize-y min-h-[160px] disabled:opacity-50"
              />
            </div>

            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-[#5A635D] mb-2 font-medium">Медиа</span>
              <input ref={fileInputRef} type="file" accept="image/*,video/*" className="sr-only" onChange={handleFileChange} disabled={busy} />
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={handlePickFile} disabled={busy} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#E5E3DB] bg-white/80 text-sm text-[#2D332F] hover:border-[#4A5D4E]/35 hover:bg-white transition-colors disabled:opacity-45">
                  <Paperclip className="w-4 h-4 text-[#4A5D4E]" strokeWidth={1.5} />
                  Прикрепить файл
                </button>
                {selectedFile && (
                  <>
                    <span className="text-xs text-[#5A635D] truncate max-w-[200px]" title={selectedFile.name}>{selectedFile.name}</span>
                    <button type="button" onClick={clearFile} disabled={busy} className="text-xs uppercase tracking-wider text-[#8F9779] hover:text-[#2D332F] disabled:opacity-40">Сбросить</button>
                  </>
                )}
                {isEdit && post?.media_url && !selectedFile && (
                  <span className="text-xs text-[#5A635D] flex items-center gap-1.5">
                    <ImagePlus className="w-3.5 h-3.5 text-[#8F9779]" strokeWidth={1.5} />
                    Текущий файл сохранится, если не выбрать новый
                  </span>
                )}
              </div>
              {isUploadingMedia && (
                <p className="mt-3 text-sm text-[#4A5D4E] flex items-center gap-2 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" /> Загрузка файла…
                </p>
              )}
            </div>

            {error && <p className="text-sm text-red-800/90 border border-red-200/80 bg-red-50/80 rounded-xl px-4 py-3">{error}</p>}
          </div>

          <div className="px-8 py-5 border-t border-[#E5E3DB]/80 flex justify-end gap-3 shrink-0 bg-[#F5F4F0]/80">
            <button type="button" onClick={() => !busy && onClose()} disabled={busy} className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.15em] text-[#5A635D] border border-[#E5E3DB] hover:bg-white/80 transition-colors disabled:opacity-40">Отмена</button>
            <button type="submit" disabled={busy} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2D332F] text-[#F5F4F0] text-xs font-semibold uppercase tracking-[0.15em] hover:bg-[#4A5D4E] transition-colors disabled:opacity-45 shadow-sm">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? 'Сохранить' : 'Опубликовать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

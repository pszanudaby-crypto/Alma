# Перенос данных из Supabase

1. В Supabase Table Editor или SQL Editor экспортируйте CSV для таблиц:
   - `profiles` или `users`
   - `posts`
   - `comments`
2. Создайте PostgreSQL на Amvera и задайте `DATABASE_URL`.
3. Выполните миграции:

   ```bash
   npm run migrate
   ```

4. Импортируйте пользователей в таблицу `users`.
   Пароли из Supabase Auth выгрузить нельзя, поэтому пользователям нужно создать новые пароли
   или зарегистрироваться заново. Для админа проще создать аккаунт первым или указать email в
   `ADMIN_EMAILS`.
5. Импортируйте `posts` и `comments`, сопоставив `author_id` / `user_id` с новыми id пользователей.
6. Медиа из Supabase Storage нужно скачать отдельно и положить в persistent storage Amvera
   (`/data/uploads`) либо перезагрузить через админку сайта.

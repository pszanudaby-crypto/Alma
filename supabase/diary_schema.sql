-- Альма: дневник стройки и комьюнити
-- Выполните целиком в SQL Editor проекта Supabase (Dashboard → SQL → New query).

-- Расширение для gen_random_uuid (обычно уже включено в Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Профили пользователей (синхронизация с auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'))
);

CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  author_id uuid NOT NULL,
  CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts (id) ON DELETE CASCADE,
  CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments (post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments (created_at);

-- Триггер: новая запись в public.users после регистрации в auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'full_name', split_part(COALESCE(NEW.email, ''), '@', 1)),
    'user'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- users: чтение для всех (имена авторов в ленте); обновление своей строки
DROP POLICY IF EXISTS "users_select_all" ON public.users;
CREATE POLICY "users_select_all"
  ON public.users
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- posts: читать всем; создавать/менять/удалять только admin
DROP POLICY IF EXISTS "posts_select_all" ON public.posts;
CREATE POLICY "posts_select_all"
  ON public.posts
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "posts_insert_admin" ON public.posts;
CREATE POLICY "posts_insert_admin"
  ON public.posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "posts_update_admin" ON public.posts;
CREATE POLICY "posts_update_admin"
  ON public.posts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "posts_delete_admin" ON public.posts;
CREATE POLICY "posts_delete_admin"
  ON public.posts
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = 'admin'
    )
  );

-- comments: читать всем; создавать — любой авторизованный (своим user_id)
DROP POLICY IF EXISTS "comments_select_all" ON public.comments;
CREATE POLICY "comments_select_all"
  ON public.comments
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "comments_insert_authenticated" ON public.comments;
CREATE POLICY "comments_insert_authenticated"
  ON public.comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Тестовые посты: создаются от имени первого зарегистрированного пользователя в public.users
-- (сначала зарегистрируйте хотя бы одного пользователя через приложение или Auth, затем выполните скрипт целиком
-- или повторите только этот блок, если таблицы уже созданы).
DO $$
DECLARE
  seed_author uuid;
BEGIN
  SELECT id INTO seed_author FROM public.users ORDER BY created_at ASC LIMIT 1;
  IF seed_author IS NULL THEN
    RAISE NOTICE 'Нет строк в public.users — сначала создайте пользователя (регистрация в приложении), затем снова выполните вставку постов вручную.';
  ELSE
    IF NOT EXISTS (SELECT 1 FROM public.posts LIMIT 1) THEN
      INSERT INTO public.posts (title, content, author_id) VALUES
        (
          'Старт подготовки участка',
          'Провели первичное обследование территории, обозначили зону под будущие барнхаусы и общие пространства. Погода держится — можно планировать выезд инженеров на съёмку рельефа.',
          seed_author
        ),
        (
          'Логистика и согласования',
          'Сверяем поставки древесины и график подъезда техники. Параллельно согласуем временные въезды с местными службами, чтобы не мешать жителям поселка.',
          seed_author
        );
    END IF;
  END IF;
END $$;

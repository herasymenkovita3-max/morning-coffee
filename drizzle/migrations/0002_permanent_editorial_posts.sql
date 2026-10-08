ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_pinned boolean NOT NULL DEFAULT false;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS editorial_badge text;
COMMENT ON COLUMN public.posts.is_pinned IS 'Editorial picks remain visible beyond the rolling 24-hour feed window.';
COMMENT ON COLUMN public.posts.editorial_badge IS 'Editorial sticker: hot, important, or top; not a reader vote.';
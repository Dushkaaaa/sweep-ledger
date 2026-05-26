alter table public.profiles
add column if not exists preferred_language text
check (preferred_language in ('uk', 'en', 'pl'));


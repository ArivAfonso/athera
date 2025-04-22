alter table "public"."users" drop constraint "users_username_key";

alter table "public"."watch_history" drop constraint "watch_history_post_fkey";

alter table "public"."watch_history" drop constraint "unique_post_user";

drop function if exists "public"."match_news"(query_embedding vector, match_threshold double precision, match_count integer, filter_option text);

drop index if exists "public"."users_username_key";

drop index if exists "public"."unique_post_user";

create table "public"."source_suggestions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "background" text,
    "image" text,
    "ignore_prefixes" text,
    "url" text not null,
    "sitemap" text
);


alter table "public"."source_suggestions" enable row level security;

alter table "public"."sources" add column "country" text not null default 'general'::text;

alter table "public"."topics" alter column "color" set not null;

alter table "public"."users" drop column "username";

alter table "public"."watch_history" drop column "post";

alter table "public"."watch_history" add column "news" uuid not null;

alter table "public"."watch_history" alter column "user_id" set not null;

CREATE UNIQUE INDEX source_suggestions_name_key ON public.source_suggestions USING btree (name);

CREATE UNIQUE INDEX source_suggestions_pkey ON public.source_suggestions USING btree (id);

CREATE UNIQUE INDEX source_suggestions_url_key ON public.source_suggestions USING btree (url);

CREATE UNIQUE INDEX unique_post_user ON public.watch_history USING btree (user_id, news);

alter table "public"."source_suggestions" add constraint "source_suggestions_pkey" PRIMARY KEY using index "source_suggestions_pkey";

alter table "public"."source_suggestions" add constraint "source_suggestions_name_key" UNIQUE using index "source_suggestions_name_key";

alter table "public"."source_suggestions" add constraint "source_suggestions_url_key" UNIQUE using index "source_suggestions_url_key";

alter table "public"."watch_history" add constraint "watch_history_news_fkey" FOREIGN KEY (news) REFERENCES news(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."watch_history" validate constraint "watch_history_news_fkey";

alter table "public"."watch_history" add constraint "unique_post_user" UNIQUE using index "unique_post_user";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_titles(news_titles text[])
 RETURNS text[]
 LANGUAGE plpgsql
 STABLE
AS $function$
DECLARE
    unused_titles text[] := '{}'; -- Initialize empty array
BEGIN
    -- Find titles that are NOT in the news table
    SELECT array_agg(title)
    INTO unused_titles
    FROM unnest(news_titles) AS t(title)
    WHERE NOT EXISTS (
        SELECT 1 FROM news WHERE news.title = t.title
    );

    RETURN COALESCE(unused_titles, '{}'); -- Return empty array if none are missing
END;
$function$
;

CREATE OR REPLACE FUNCTION public.match_news(query_embedding vector, match_threshold double precision, match_count integer, filter_option text)
 RETURNS TABLE(id uuid, title text, created_at timestamp with time zone, description text, summary text, likecount jsonb, commentcount jsonb, likes jsonb, bookmarks jsonb, image text, author text, source jsonb, news_topics jsonb, similarity double precision)
 LANGUAGE sql
 STABLE
AS $function$
  SELECT
    news.id,
    news.title,
    news.created_at,
    news.summary,
    news.description,

    json_build_array(
      json_build_object('count', COUNT(DISTINCT likes.news))
    ) AS likecount,

    json_build_array(
      json_build_object('count', COUNT(DISTINCT comments.news))
    ) AS commentcount,

    json_agg(DISTINCT jsonb_build_object('id', likes.liker)) FILTER (WHERE likes.liker IS NOT NULL) AS likes,
    json_agg(DISTINCT jsonb_build_object('id', bookmarks.user)) FILTER (WHERE bookmarks.user IS NOT NULL) AS bookmarks,

    news.image,
    news.author,

    jsonb_build_object(
      'id', sources.id,
      'name', sources.name,
      'url', sources.url,
      'image', sources.image
    ) AS source,

    json_agg(
      DISTINCT jsonb_build_object(
        'topic',
        jsonb_build_object(
          'name', topics.name,
          'color', topics.color
        )
      )
    ) FILTER (WHERE topics.name IS NOT NULL) AS news_topics,

    1 - (news.embeddings <=> query_embedding) AS similarity

  FROM news
  LEFT JOIN likes ON news.id = likes.news
  LEFT JOIN bookmarks ON news.id = bookmarks.news
  LEFT JOIN news_topics ON news.id = news_topics.news
  LEFT JOIN topics ON news_topics.topic = topics.id
  LEFT JOIN comments ON news.id = comments.news
  LEFT JOIN sources ON news.source = sources.id

  WHERE 1 - (news.embeddings <=> query_embedding) > match_threshold

  GROUP BY news.id, sources.id, sources.name, sources.url, sources.image

  ORDER BY
    CASE
      WHEN filter_option = 'most_relevant' THEN 1 - (news.embeddings <=> query_embedding)
      WHEN filter_option = 'most_commented' THEN COUNT(DISTINCT comments.news)
      WHEN filter_option = 'most_recent' THEN extract(epoch from news.created_at)
      WHEN filter_option = 'most_liked' THEN COUNT(DISTINCT likes.news)
      ELSE 1 - (news.embeddings <=> query_embedding)
    END DESC

  LIMIT match_count;
$function$
;

grant delete on table "public"."source_suggestions" to "anon";

grant insert on table "public"."source_suggestions" to "anon";

grant references on table "public"."source_suggestions" to "anon";

grant select on table "public"."source_suggestions" to "anon";

grant trigger on table "public"."source_suggestions" to "anon";

grant truncate on table "public"."source_suggestions" to "anon";

grant update on table "public"."source_suggestions" to "anon";

grant delete on table "public"."source_suggestions" to "authenticated";

grant insert on table "public"."source_suggestions" to "authenticated";

grant references on table "public"."source_suggestions" to "authenticated";

grant select on table "public"."source_suggestions" to "authenticated";

grant trigger on table "public"."source_suggestions" to "authenticated";

grant truncate on table "public"."source_suggestions" to "authenticated";

grant update on table "public"."source_suggestions" to "authenticated";

grant delete on table "public"."source_suggestions" to "service_role";

grant insert on table "public"."source_suggestions" to "service_role";

grant references on table "public"."source_suggestions" to "service_role";

grant select on table "public"."source_suggestions" to "service_role";

grant trigger on table "public"."source_suggestions" to "service_role";

grant truncate on table "public"."source_suggestions" to "service_role";

grant update on table "public"."source_suggestions" to "service_role";

create policy "Enable insert for authenticated users only"
on "public"."source_suggestions"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."source_suggestions"
as permissive
for select
to authenticated
using (true);




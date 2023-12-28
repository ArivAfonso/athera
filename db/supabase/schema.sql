
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "public";

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "public";

CREATE TYPE "public"."authortype" AS (
	"id" "text",
	"name" "text",
	"followercount" integer,
	"isfollowing" boolean,
	"username" "text",
	"bio" "text",
	"website" "text",
	"avatar" "text",
	"postcount" integer,
	"verified" boolean
);

ALTER TYPE "public"."authortype" OWNER TO "postgres";

CREATE TYPE "public"."categorytype" AS (
	"name" "text",
	"postcount" "json"[],
	"color" "text"
);

ALTER TYPE "public"."categorytype" OWNER TO "postgres";

CREATE TYPE "public"."posttype" AS (
	"id" "text",
	"title" "text",
	"image" "text",
	"created_at" "text",
	"estimatedreadingtime" integer,
	"description" "text",
	"text" "text",
	"rawtext" "text",
	"author" "json",
	"post_categories" "json"[],
	"likecount" "json"[],
	"commentcount" "json"[],
	"isliked" boolean,
	"isbookmarked" boolean
);

ALTER TYPE "public"."posttype" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_home_data"() RETURNS TABLE("popular_posts" "public"."posttype"[], "most_followed_users" "public"."authortype"[], "most_post_categories" "public"."categorytype"[])
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Logic for getting popular posts
  SELECT
    array_to_json(array_agg(JSON_BUILD_OBJECT(
      'id', p.id,
      'title', p.title,
      'image', p.image,
      'created_at', p.created_at,
      'author', JSON_BUILD_OBJECT(
        'id', u.id,
        'verified', u.verified,
        'name', u.name,
        'username', u.username,
        'avatar', u.avatar,
        'description', u.bio
      ),
      'post_categories', (
        SELECT
          array_to_json(array_agg(JSON_BUILD_OBJECT(
            'category', JSON_BUILD_OBJECT(
              'name', c.name,
              'color', c.color
            )
          )))
        FROM categories c
        JOIN post_categories pc ON c.id = pc.category
        WHERE pc.post = p.id
      ),
      'likeCount', (
        SELECT
          json_build_object('count', COUNT(*))
        FROM likes
        WHERE post = p.id
      ),
      'commentCount', (
        SELECT
          json_build_object('count', COUNT(*))
        FROM comments
        WHERE post = p.id
      ),
      'isliked', (
        SELECT
          EXISTS (
            SELECT 1
            FROM likes
            WHERE post = p.id
            AND liker = current_user
          )
      ),
      'isBookmarked', (
        SELECT
          EXISTS (
            SELECT 1
            FROM bookmarks
            WHERE post = p.id
            AND user_id = current_user
          )
      )
    )))
  INTO popular_posts
  FROM posts p
  JOIN users u ON p.author = u.id::UUID
  LIMIT 10;

  -- Logic for getting most followed users
  SELECT
    array_to_json(array_agg(JSON_BUILD_OBJECT(
      'id', u.id,
      'name', u.name,
      'followerCount', (
        SELECT
          COUNT(*)
        FROM followers
        WHERE following = u.id::UUID
      ),
      'isFollowing', (
        SELECT
          EXISTS (
            SELECT 1
            FROM followers
            WHERE follower = current_user
            AND following = u.id::UUID
          )
      ),
      'username', u.username,
      'bio', u.bio,
      'website', u.website,
      'avatar', u.avatar,
      'postCount', (
        SELECT
          COUNT(*)
        FROM posts
        WHERE author = u.id::UUID
      ),
      'verified', u.verified
    )))
  INTO most_followed_users
  FROM users u
  JOIN followers f ON u.id = f.following
  GROUP BY u.id
  ORDER BY COUNT(f.id) DESC
  LIMIT 10;

  -- Logic for getting categories with the most posts
  SELECT
    array_to_json(array_agg(JSON_BUILD_OBJECT(
      'name', c.name,
      'postCount', (
        SELECT
          COUNT(*)
        FROM post_categories
        WHERE category = c.id::UUID
      ),
      'color', c.color
    )))
  INTO most_post_categories
  FROM categories c
  JOIN post_categories pc ON c.id = pc.category
  GROUP BY c.id
  ORDER BY COUNT(pc.id) DESC
  LIMIT 10;

  RETURN;
END;
$$;

ALTER FUNCTION "public"."get_home_data"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_home_data"("current_user_uuid" "uuid") RETURNS TABLE("popular_posts" "public"."posttype"[], "most_followed_users" "public"."authortype"[], "most_post_categories" "public"."categorytype"[])
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Logic for getting popular posts
  popular_posts := (
    SELECT JSON_BUILD_OBJECT(
      'id', p.id,
      'title', p.title,
      'image', p.image,
      'created_at', p.created_at,
      'author', JSON_BUILD_OBJECT(
        'id', u.id::text,
        'verified', u.verified,
        'name', u.name,
        'username', u.username,
        'avatar', u.avatar,
        'description', u.bio
      ),
      'post_categories', (
        SELECT ARRAY_TO_JSON(ARRAY_AGG(JSON_BUILD_OBJECT('category', JSON_BUILD_OBJECT('name', c.name, 'color', c.color))))
        FROM categories c
        JOIN post_categories pc ON c.id = pc.category
        WHERE pc.post = p.id
      ),
      'likeCount', (
        SELECT JSON_BUILD_OBJECT('count', COUNT(*))
        FROM likes
        WHERE post = p.id
      ),
      'commentCount', (
        SELECT JSON_BUILD_OBJECT('count', COUNT(*))
        FROM comments
        WHERE post = p.id
      )
    ) FROM posts p
    JOIN users u ON p.author = u.id
    LIMIT 10
  );

  -- Logic for getting most followed users
  most_followed_users := (
    SELECT JSON_BUILD_OBJECT(
      'id', u.id::text,
      'name', u.name,
      'followerCount', (
        SELECT COUNT(*)
        FROM followers
        WHERE following = u.id
      ),
      'username', u.username,
      'bio', u.bio,
      'website', u.website,
      'avatar', u.avatar,
      'postCount', (
        SELECT COUNT(*)
        FROM posts
        WHERE author = u.id
      ),
      'verified', u.verified
    ) FROM users u
    JOIN followers f ON u.id = f.following
    GROUP BY u.id
    ORDER BY COUNT(f.id) DESC
    LIMIT 10
  );

  -- Logic for getting categories with the most posts
  most_post_categories := (
    SELECT JSON_BUILD_OBJECT(
      'name', c.name,
      'id', c.id,
      'postCount', (
        SELECT COUNT(*)
        FROM post_categories
        WHERE category = c.id
      ),
      'color', c.color
    ) FROM categories c
    JOIN post_categories pc ON c.id = pc.category
    GROUP BY c.id
    ORDER BY COUNT(pc.id) DESC
    LIMIT 10
  );

  RETURN;
END;
$$;

ALTER FUNCTION "public"."get_home_data"("current_user_uuid" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.users (id, name, avatar)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."match_posts"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer) RETURNS TABLE("id" "uuid", "title" "text", "created_at" timestamp with time zone, "description" "text", "likecount" "jsonb", "commentcount" "jsonb", "likes" "jsonb", "bookmarks" "jsonb", "image" "text", "author" "jsonb", "post_categories" "jsonb", "similarity" double precision)
    LANGUAGE "sql" STABLE
    AS $$
  SELECT
    posts.id,
    posts.title,
    posts.created_at,
    posts.description,
    CASE
      WHEN COUNT(likes.post) = 0 THEN json_build_array(json_build_object('count', 0))
      ELSE json_build_array(json_build_object('count', COUNT(likes.post)))
    END AS likecount,
    CASE
      WHEN COUNT(comments.post) = 0 THEN json_build_array(json_build_object('count', 0))
      ELSE json_build_array(json_build_object('count', COUNT(comments.post)))
    END AS commentcount,
    json_agg(json_build_object('id', users.id)) AS likes,
    json_agg(json_build_object('id', users.id)) AS bookmarks,
    posts.image,
    json_build_object(
      'name', users.name,
      'username', users.username,
      'id', users.id,
      'verified', users.verified,
      'avatar', users.avatar
    ) AS author,
    json_agg(
      json_build_object(
        'category',
        json_build_object(
          'name', categories.name,
          'color', categories.color
        )
      )
    ) AS post_categories,
    1 - (posts.embeddings <=> query_embedding) AS similarity
  FROM posts
  LEFT JOIN users ON posts.author = users.id
  LEFT JOIN post_categories ON posts.id = post_categories.post
  LEFT JOIN categories ON post_categories.category = categories.id
  LEFT JOIN comments ON posts.id = comments.post
  LEFT JOIN likes ON posts.id = likes.post
  WHERE 1 - (posts.embeddings <=> query_embedding) > match_threshold
  GROUP BY posts.id, users.name, users.username, users.avatar, users.id, users.verified
  LIMIT match_count;
$$;

ALTER FUNCTION "public"."match_posts"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."match_posts"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "filter_option" "text") RETURNS TABLE("id" "uuid", "title" "text", "created_at" timestamp with time zone, "description" "text", "likecount" "jsonb", "commentcount" "jsonb", "likes" "jsonb", "bookmarks" "jsonb", "image" "text", "author" "jsonb", "post_categories" "jsonb", "similarity" double precision)
    LANGUAGE "sql" STABLE
    AS $$
  SELECT
    posts.id,
    posts.title,
    posts.created_at,
    posts.description,
    CASE
      WHEN COUNT(likes.post) = 0 THEN json_build_array(json_build_object('count', 0))
      ELSE json_build_array(json_build_object('count', COUNT(likes.post)))
    END AS likecount,
    CASE
      WHEN COUNT(comments.post) = 0 THEN json_build_array(json_build_object('count', 0))
      ELSE json_build_array(json_build_object('count', COUNT(comments.post)))
    END AS commentcount,
    json_agg(json_build_object('id', users.id)) AS likes,
    json_agg(json_build_object('id', users.id)) AS bookmarks,
    posts.image,
    json_build_object(
      'name', users.name,
      'username', users.username,
      'id', users.id,
      'verified', users.verified,
      'avatar', users.avatar
    ) AS author,
    json_agg(
      json_build_object(
        'category',
        json_build_object(
          'name', categories.name,
          'color', categories.color
        )
      )
    ) AS post_categories,
    1 - (posts.embeddings <=> query_embedding) AS similarity
  FROM posts
  LEFT JOIN users ON posts.author = users.id
  LEFT JOIN post_categories ON posts.id = post_categories.post
  LEFT JOIN categories ON post_categories.category = categories.id
  LEFT JOIN comments ON posts.id = comments.post
  LEFT JOIN likes ON posts.id = likes.post
  WHERE 1 - (posts.embeddings <=> query_embedding) > match_threshold
  GROUP BY posts.id, users.name, users.username, users.avatar, users.id, users.verified
  ORDER BY
    CASE
      WHEN filter_option = 'most_relevant' THEN 1 - (posts.embeddings <=> query_embedding)
      WHEN filter_option = 'most_commented' THEN COUNT(comments.post)
      WHEN filter_option = 'most_recent' THEN extract(epoch from posts.created_at)
      WHEN filter_option = 'most_liked' THEN COUNT(likes.post)
      ELSE 1 - (posts.embeddings <=> query_embedding)
    END DESC
  LIMIT match_count;
$$;

ALTER FUNCTION "public"."match_posts"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "filter_option" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."notify_on_comment"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    -- Check if notifications column is set to true for the user_id in the users table
    if (select notifications from users where id = (select author from posts where id = new.post)) then
        -- Insert a new row into the notifications table when a comment is added
        insert into notifications (id, created_at, avatar, type, user_id, notifier, post)
        select gen_random_uuid(), now(), u.avatar, 'comment', p.author, new.commenter, p.id
        from users u
        join posts p on p.id = new.post
        where u.id = new.commenter;
    end if;
    return new;
end;
$$;

ALTER FUNCTION "public"."notify_on_comment"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."notify_on_follow"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    -- Check if notifications column is set to true for the user_id in the users table
    if (select notifications from users where id = new.following) then
        -- Insert a new row into the notifications table when a user is followed
        insert into notifications (id, created_at, avatar, type, user_id, notifier)
        select gen_random_uuid(), now(), u.avatar, 'follow', new.following, new.follower
        from users u
        where u.id = new.follower;
    end if;
    return new;
end;
$$;

ALTER FUNCTION "public"."notify_on_follow"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."notify_on_like"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    -- Check if notifications column is set to true for the user_id in the users table
    if (select notifications from users u
        join posts p on p.id = new.post_id
        where u.id = p.author) then
        -- Insert a new row into the notifications table when a post is liked
        insert into notifications (id, created_at, avatar, type, user_id, notifier_id)
        select gen_random_uuid(), now(), new.liker_avatar, 'like', p.author, new.liker_id
        from posts p
        where p.id = new.post_id;
    end if;
    return new;
end;
$$;

ALTER FUNCTION "public"."notify_on_like"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."related_posts"("post_id" "uuid", "match_threshold" double precision, "match_count" integer) RETURNS TABLE("id" "uuid", "title" "text", "created_at" timestamp with time zone, "description" "text", "likecount" "jsonb", "commentcount" "jsonb", "likes" "jsonb", "bookmarks" "jsonb", "image" "text", "author" "jsonb", "post_categories" "jsonb", "similarity" double precision)
    LANGUAGE "sql" STABLE
    AS $$
  SELECT
    posts.id,
    posts.title,
    posts.created_at,
    posts.description,
    json_build_array(
      json_build_object('count', coalesce(count(*) OVER (PARTITION BY posts.id), 0))
    ) AS likecount,
    json_build_array(
      json_build_object('count', coalesce(count(*) OVER (PARTITION BY posts.id), 0))
    ) AS commentcount,
    json_agg(json_build_object('id', users.id)) AS likes,
    json_agg(json_build_object('id', users.id)) AS bookmarks,
    posts.image,
    json_build_object('name', users.name, 'username', users.username, 'avatar', users.avatar) AS author,
    (
      SELECT json_agg(
        json_build_object(
          'category',
          json_build_object(
            'name',
            categories.name,
            'color',
            categories.color
          )
        )
      )
      FROM post_categories pc2
      LEFT JOIN categories ON pc2.category = categories.id
      WHERE pc2.post = posts.id
    ) AS post_categories,
    1 - (posts.embeddings <=> posts.embeddings) AS similarity
  FROM posts
  LEFT JOIN users ON posts.author = users.id
  LEFT JOIN post_categories ON posts.id = post_categories.post
  LEFT JOIN categories ON post_categories.category = categories.id
  LEFT JOIN comments ON posts.id = comments.post
  LEFT JOIN post_categories pc ON pc.post = posts.id
  LEFT JOIN posts related_posts ON related_posts.id = pc.post
  WHERE related_posts.id = post_id
    AND posts.id <> post_id -- Exclude the post with the same ID
    AND 1 - (posts.embeddings <=> posts.embeddings) > match_threshold
  GROUP BY posts.id, users.name, users.username, users.avatar
  LIMIT match_count;
$$;

ALTER FUNCTION "public"."related_posts"("post_id" "uuid", "match_threshold" double precision, "match_count" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."remove_comment_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    -- Delete the corresponding row in the notifications table when a comment is deleted
    delete from notifications
    where user_id = (select author from posts where id = old.post) and notifier = old.commenter;
    return old;
end;
$$;

ALTER FUNCTION "public"."remove_comment_notification"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."remove_follow_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    -- Delete the corresponding row in the notifications table when a user is unfollowed
    delete from notifications
    where user_id = old.following and notifier = old.follower;
    return old;
end;
$$;

ALTER FUNCTION "public"."remove_follow_notification"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."remove_like_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    -- Delete the corresponding row in the notifications table when a post is unliked
    delete from notifications
    where user_id = (select author from posts where id = old.post_id) and notifier_id = old.liker_id;
    return old;
end;
$$;

ALTER FUNCTION "public"."remove_like_notification"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."bookmarks" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user" "uuid",
    "post" "uuid"
);

ALTER TABLE "public"."bookmarks" OWNER TO "postgres";

ALTER TABLE "public"."bookmarks" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."bookmarks_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying,
    "color" character varying DEFAULT 'blue'::character varying,
    "image" "text"
);

ALTER TABLE "public"."categories" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."comment_likes" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "liker" "uuid",
    "comment" bigint
);

ALTER TABLE "public"."comment_likes" OWNER TO "postgres";

ALTER TABLE "public"."comment_likes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."comment_likes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."comment_reports" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "reporter" "uuid",
    "comment" bigint
);

ALTER TABLE "public"."comment_reports" OWNER TO "postgres";

ALTER TABLE "public"."comment_reports" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."comment_reports_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "commenter" "uuid",
    "post" "uuid",
    "comment" "text" NOT NULL
);

ALTER TABLE "public"."comments" OWNER TO "postgres";

ALTER TABLE "public"."comments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."comments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."followers" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "follower" "uuid",
    "following" "uuid"
);

ALTER TABLE "public"."followers" OWNER TO "postgres";

ALTER TABLE "public"."followers" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."followers_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."likes" (
    "id" bigint NOT NULL,
    "post" "uuid",
    "liker" "uuid"
);

ALTER TABLE "public"."likes" OWNER TO "postgres";

ALTER TABLE "public"."likes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."likes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "avatar" "text",
    "type" "text",
    "user_id" "uuid",
    "notifier" "uuid",
    "read_at" timestamp with time zone,
    "post" "uuid",
    CONSTRAINT "notifications_type_check" CHECK (("length"("type") < 50))
);

ALTER TABLE "public"."notifications" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."post_categories" (
    "id" bigint NOT NULL,
    "post" "uuid",
    "category" "uuid"
);

ALTER TABLE "public"."post_categories" OWNER TO "postgres";

ALTER TABLE "public"."post_categories" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."post-categories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."post_reports" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "post" "uuid",
    "type" character varying,
    "reason" "text",
    "reporter" "uuid"
);

ALTER TABLE "public"."post_reports" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "text" "text",
    "rawText" "text",
    "author" "uuid" NOT NULL,
    "image" "text",
    "estimatedReadingTime" integer DEFAULT 0,
    "embeddings" "public"."vector"
);

ALTER TABLE "public"."posts" OWNER TO "postgres";

ALTER TABLE "public"."post_reports" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."reports_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."team_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "team" "uuid",
    "user_id" "uuid"
);

ALTER TABLE "public"."team_members" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."teams" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "admin" "uuid",
    "image" character varying,
    "name" character varying,
    "description" "text"
);

ALTER TABLE "public"."teams" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "avatar" "text",
    "username" "text",
    "tiktok" character varying,
    "facebook" character varying,
    "twitter" character varying,
    "phone" character varying,
    "bio" "text",
    "website" "text",
    "verified" boolean DEFAULT false NOT NULL,
    "pinterest" character varying,
    "github" character varying,
    "linkedin" character varying,
    "twitch" character varying,
    "youtube" character varying,
    "instagram" character varying,
    "notifications" boolean DEFAULT true,
    "background" "text"
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."comment_likes"
    ADD CONSTRAINT "comment_likes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."comment_reports"
    ADD CONSTRAINT "comment_reports_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."followers"
    ADD CONSTRAINT "followers_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."post_categories"
    ADD CONSTRAINT "post-categories_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."post_reports"
    ADD CONSTRAINT "reports_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "topics_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");

CREATE OR REPLACE TRIGGER "comment_notification_trigger" AFTER INSERT ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."notify_on_comment"();

CREATE OR REPLACE TRIGGER "follow_notification_trigger" AFTER INSERT ON "public"."followers" FOR EACH ROW EXECUTE FUNCTION "public"."notify_on_follow"();

CREATE OR REPLACE TRIGGER "like_notification_trigger" AFTER INSERT ON "public"."likes" FOR EACH ROW EXECUTE FUNCTION "public"."notify_on_like"();

CREATE OR REPLACE TRIGGER "postEmbeddings" AFTER INSERT OR UPDATE ON "public"."posts" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://vkruooaeaacsdxvfxwpu.functions.supabase.co/post-embeddings', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrcnVvb2FlYWFjc2R4dmZ4d3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODUwMDIzODMsImV4cCI6MjAwMDU3ODM4M30.cbPq3zfVeodPOVDHYLQ1tlH9_Ol2gZoCUTJA6aCqUK8"}', '{}', '1000');

CREATE OR REPLACE TRIGGER "remove_comment_notification_trigger" AFTER DELETE ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."remove_comment_notification"();

CREATE OR REPLACE TRIGGER "unfollow_notification_trigger" AFTER DELETE ON "public"."followers" FOR EACH ROW EXECUTE FUNCTION "public"."remove_follow_notification"();

CREATE OR REPLACE TRIGGER "unlike_notification_trigger" AFTER DELETE ON "public"."likes" FOR EACH ROW EXECUTE FUNCTION "public"."remove_like_notification"();

ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_post_fkey" FOREIGN KEY ("post") REFERENCES "public"."posts"("id");

ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_user_fkey" FOREIGN KEY ("user") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."comment_likes"
    ADD CONSTRAINT "comment_likes_comment_fkey" FOREIGN KEY ("comment") REFERENCES "public"."comments"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."comment_likes"
    ADD CONSTRAINT "comment_likes_liker_fkey" FOREIGN KEY ("liker") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."comment_reports"
    ADD CONSTRAINT "comment_reports_comment_fkey" FOREIGN KEY ("comment") REFERENCES "public"."comments"("id");

ALTER TABLE ONLY "public"."comment_reports"
    ADD CONSTRAINT "comment_reports_reporter_fkey" FOREIGN KEY ("reporter") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_commenter_fkey" FOREIGN KEY ("commenter") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_post_fkey" FOREIGN KEY ("post") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."followers"
    ADD CONSTRAINT "followers_follower_fkey" FOREIGN KEY ("follower") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."followers"
    ADD CONSTRAINT "followers_following_fkey" FOREIGN KEY ("following") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_liker_fkey" FOREIGN KEY ("liker") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_post_fkey" FOREIGN KEY ("post") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_notifier_fkey" FOREIGN KEY ("notifier") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_post_fkey" FOREIGN KEY ("post") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."post_categories"
    ADD CONSTRAINT "post_categories_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."post_categories"
    ADD CONSTRAINT "post_categories_post_fkey" FOREIGN KEY ("post") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."post_reports"
    ADD CONSTRAINT "post_reports_post_fkey" FOREIGN KEY ("post") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."post_reports"
    ADD CONSTRAINT "post_reports_reporter_fkey" FOREIGN KEY ("reporter") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_author_fkey" FOREIGN KEY ("author") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_team_fkey" FOREIGN KEY ("team") REFERENCES "public"."teams"("id");

ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_admin_fkey" FOREIGN KEY ("admin") REFERENCES "public"."users"("id");

CREATE POLICY "Anyone can access posts" ON "public"."posts" FOR SELECT USING (true);

CREATE POLICY "Enable delete access based on their id" ON "public"."comments" FOR DELETE USING (("auth"."uid"() = "commenter"));

CREATE POLICY "Enable delete for all" ON "public"."likes" FOR DELETE USING (true);

CREATE POLICY "Enable delete for everyone" ON "public"."post_categories" FOR DELETE USING (true);

CREATE POLICY "Enable delete for users based on their id" ON "public"."followers" FOR DELETE USING (("auth"."uid"() = "follower"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."bookmarks" FOR DELETE USING (true);

CREATE POLICY "Enable delete for users based on user_id" ON "public"."notifications" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."posts" FOR DELETE USING (("auth"."uid"() = "author"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."team_members" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."bookmarks" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."categories" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."comment_likes" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."comments" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."followers" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."likes" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."notifications" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."post_categories" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."post_reports" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."posts" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."team_members" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."users" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "public"."bookmarks" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."categories" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."comment_likes" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."comments" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."followers" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."likes" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."post_categories" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."team_members" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."users" FOR SELECT USING (true);

CREATE POLICY "Enable select access for users based on user_id" ON "public"."notifications" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable update access based on user's id" ON "public"."comments" FOR UPDATE USING (("auth"."uid"() = "commenter")) WITH CHECK (("auth"."uid"() = "commenter"));

CREATE POLICY "Enable update access for users based on user_id" ON "public"."notifications" FOR UPDATE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable update based on user's id" ON "public"."users" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "Enable update for authenticated users only" ON "public"."categories" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "Enable update for users based on their id" ON "public"."posts" FOR UPDATE USING (("auth"."uid"() = "author")) WITH CHECK (("auth"."uid"() = "author"));

ALTER TABLE "public"."bookmarks" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."comment_likes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."comment_reports" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."followers" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."likes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."post_categories" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."post_reports" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."team_members" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."teams" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_home_data"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_home_data"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_home_data"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_home_data"("current_user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_home_data"("current_user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_home_data"("current_user_uuid" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."match_posts"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."match_posts"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_posts"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."match_posts"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "filter_option" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."match_posts"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "filter_option" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_posts"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "filter_option" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."notify_on_comment"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_on_comment"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_on_comment"() TO "service_role";

GRANT ALL ON FUNCTION "public"."notify_on_follow"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_on_follow"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_on_follow"() TO "service_role";

GRANT ALL ON FUNCTION "public"."notify_on_like"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_on_like"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_on_like"() TO "service_role";

GRANT ALL ON FUNCTION "public"."related_posts"("post_id" "uuid", "match_threshold" double precision, "match_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."related_posts"("post_id" "uuid", "match_threshold" double precision, "match_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."related_posts"("post_id" "uuid", "match_threshold" double precision, "match_count" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."remove_comment_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."remove_comment_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."remove_comment_notification"() TO "service_role";

GRANT ALL ON FUNCTION "public"."remove_follow_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."remove_follow_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."remove_follow_notification"() TO "service_role";

GRANT ALL ON FUNCTION "public"."remove_like_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."remove_like_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."remove_like_notification"() TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "service_role";

GRANT ALL ON TABLE "public"."bookmarks" TO "anon";
GRANT ALL ON TABLE "public"."bookmarks" TO "authenticated";
GRANT ALL ON TABLE "public"."bookmarks" TO "service_role";

GRANT ALL ON SEQUENCE "public"."bookmarks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."bookmarks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."bookmarks_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";

GRANT ALL ON TABLE "public"."comment_likes" TO "anon";
GRANT ALL ON TABLE "public"."comment_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."comment_likes" TO "service_role";

GRANT ALL ON SEQUENCE "public"."comment_likes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."comment_likes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."comment_likes_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."comment_reports" TO "anon";
GRANT ALL ON TABLE "public"."comment_reports" TO "authenticated";
GRANT ALL ON TABLE "public"."comment_reports" TO "service_role";

GRANT ALL ON SEQUENCE "public"."comment_reports_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."comment_reports_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."comment_reports_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";

GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."followers" TO "anon";
GRANT ALL ON TABLE "public"."followers" TO "authenticated";
GRANT ALL ON TABLE "public"."followers" TO "service_role";

GRANT ALL ON SEQUENCE "public"."followers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."followers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."followers_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."likes" TO "anon";
GRANT ALL ON TABLE "public"."likes" TO "authenticated";
GRANT ALL ON TABLE "public"."likes" TO "service_role";

GRANT ALL ON SEQUENCE "public"."likes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."likes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."likes_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";

GRANT ALL ON TABLE "public"."post_categories" TO "anon";
GRANT ALL ON TABLE "public"."post_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."post_categories" TO "service_role";

GRANT ALL ON SEQUENCE "public"."post-categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."post-categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."post-categories_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."post_reports" TO "anon";
GRANT ALL ON TABLE "public"."post_reports" TO "authenticated";
GRANT ALL ON TABLE "public"."post_reports" TO "service_role";

GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";

GRANT ALL ON SEQUENCE "public"."reports_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."reports_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."reports_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."team_members" TO "anon";
GRANT ALL ON TABLE "public"."team_members" TO "authenticated";
GRANT ALL ON TABLE "public"."team_members" TO "service_role";

GRANT ALL ON TABLE "public"."teams" TO "anon";
GRANT ALL ON TABLE "public"."teams" TO "authenticated";
GRANT ALL ON TABLE "public"."teams" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;

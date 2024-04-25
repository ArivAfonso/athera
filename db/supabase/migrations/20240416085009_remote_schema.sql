
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

CREATE SCHEMA IF NOT EXISTS "public";

ALTER SCHEMA "public" OWNER TO "pg_database_owner";

CREATE EXTENSION IF NOT EXISTS "vector"
	SCHEMA "public";

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

CREATE OR REPLACE FUNCTION "public"."check_banned_email"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Check if the new user's email is in the banned_users table
    IF EXISTS (SELECT 1 FROM public.banned_users WHERE email = NEW.email) THEN
        -- If the email is banned, delete the user
        DELETE FROM public.users WHERE id = NEW.id;
        DELETE FROM auth.users WHERE email = NEW.email;
    ELSE
        -- If the email is not banned, insert a new row into the notification_settings table
        INSERT INTO public.notification_settings (user_id) VALUES (NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."check_banned_email"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."check_scheduled_posts"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    UPDATE posts
    SET scheduled_at = NULL
    WHERE scheduled_at IS NOT NULL
    AND scheduled_at <= NOW();
END;
$$;

ALTER FUNCTION "public"."check_scheduled_posts"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_author_data"("author_username" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    author_record RECORD;
    author_data JSONB;
    follower_count INT;
    following_count INT;
    post_count INT;
    like_counts INT;
    comment_counts INT;
BEGIN
    -- Fetch follower count
    SELECT COUNT(DISTINCT f1.follower) INTO follower_count
    FROM followers f1
    WHERE f1.following = (SELECT id FROM users WHERE username = author_username);

    -- Fetch following count
    SELECT COUNT(DISTINCT f2.following) INTO following_count
    FROM followers f2
    WHERE f2.follower = (SELECT id FROM users WHERE username = author_username);

    -- Fetch post count
    SELECT COUNT(*) INTO post_count
    FROM posts
    WHERE author = (SELECT id FROM users WHERE username = author_username);

    -- Fetch like counts
    SELECT COUNT(*) INTO like_counts
    FROM likes
    WHERE post IN (SELECT id FROM posts WHERE author = (SELECT id FROM users WHERE username = author_username));

    -- Fetch comment counts
    SELECT COUNT(*) INTO comment_counts
    FROM comments
    WHERE post IN (SELECT id FROM posts WHERE author = (SELECT id FROM users WHERE username = author_username));

    -- Fetch author data
    SELECT
        u.id,
        u.name,
        follower_count AS followerCount,
        following_count AS followingCount,
        (
            SELECT JSONB_AGG(jsonb_build_object('following', f3.following))
            FROM followers f3
            WHERE f3.follower = (SELECT id FROM users WHERE username = author_username)
        ) AS followers,
        EXISTS (
            SELECT 1
            FROM followers f4
            WHERE f4.follower = (SELECT id FROM users WHERE username = author_username) AND f4.following = u.id
        ) AS isFollowing,
        u.username,
        u.background,
        u.bio,
        u.website,
        (
            SELECT JSONB_AGG(jsonb_build_object(
                'id', p.id,
                'title', p.title,
                'image', p.image,
                'created_at', p.created_at,
                'description', p.description,
                'author', jsonb_build_object(
                    'id', u.id,
                    'verified', u.verified,
                    'name', u.name,
                    'username', u.username,
                    'avatar', u.avatar
                ),
                'post_categories', (
                    SELECT JSONB_AGG(jsonb_build_object(
                        'category', jsonb_build_object(
                            'name', c.name,
                            'id', c.id,
                            'color', c.color
                        )
                    ))
                    FROM post_categories pc
                    JOIN categories c ON pc.category = c.id
                    WHERE pc.post = p.id
                ),
                'likeCount', jsonb_build_array(jsonb_build_object('count', like_counts)),
                'commentCount', jsonb_build_array(jsonb_build_object('count', comment_counts))
            ))
            FROM posts p
            WHERE p.author = (SELECT id FROM users WHERE username = author_username)
        ) AS posts,
        u.avatar,
        u.twitter,
        u.facebook,
        u.instagram,
        u.linkedin,
        u.github,
        u.twitch,
        u.youtube,
        u.tiktok,
        u.pinterest,
        post_count AS postCount,
        u.verified
    INTO
        author_record
    FROM
        users u
    WHERE
        u.username = author_username;

    -- Convert record to JSONB
    author_data := jsonb_build_object(
        'id', author_record.id,
        'name', author_record.name,
        'followerCount', author_record.followerCount,
        'followingCount', author_record.followingCount,
        'followers', author_record.followers,
        'isFollowing', author_record.isFollowing,
        'username', author_record.username,
        'background', author_record.background,
        'bio', author_record.bio,
        'website', author_record.website,
        'posts', author_record.posts,
        'avatar', author_record.avatar,
        'twitter', author_record.twitter,
        'facebook', author_record.facebook,
        'instagram', author_record.instagram,
        'linkedin', author_record.linkedin,
        'github', author_record.github,
        'twitch', author_record.twitch,
        'youtube', author_record.youtube,
        'tiktok', author_record.tiktok,
        'pinterest', author_record.pinterest,
        'postCount', author_record.postCount,
        'verified', author_record.verified
    );

    -- Return author data
    RETURN author_data;
END;
$$;

ALTER FUNCTION "public"."get_author_data"("author_username" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_author_data"("author_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    author_record RECORD;
    author_data JSONB;
    follower_count INT;
    following_count INT;
    post_count INT;
    like_counts INT;
    comment_counts INT;
BEGIN
    -- Fetch follower count
    SELECT COUNT(DISTINCT f1.follower) INTO follower_count
    FROM followers f1
    WHERE f1.following = author_id;

    -- Fetch following count
    SELECT COUNT(DISTINCT f2.following) INTO following_count
    FROM followers f2
    WHERE f2.follower = author_id;

    -- Fetch post count
    SELECT COUNT(*) INTO post_count
    FROM posts
    WHERE author = author_id;

    -- Fetch like counts
    SELECT COUNT(*) INTO like_counts
    FROM likes
    WHERE post IN (SELECT id FROM posts WHERE author = author_id);

    -- Fetch comment counts
    SELECT COUNT(*) INTO comment_counts
    FROM comments
    WHERE post IN (SELECT id FROM posts WHERE author = author_id);

    -- Fetch author data
    SELECT
        u.id,
        u.name,
        follower_count AS followerCount,
        following_count AS followingCount,
        (
            SELECT JSONB_AGG(jsonb_build_object('following', f3.following))
            FROM followers f3
            WHERE f3.follower = author_id
        ) AS followers,
        EXISTS (
            SELECT 1
            FROM followers f4
            WHERE f4.follower = author_id AND f4.following = u.id
        ) AS isFollowing,
        u.username,
        u.background,
        u.bio,
        u.website,
        (
            SELECT JSONB_AGG(jsonb_build_object(
                'id', p.id,
                'title', p.title,
                'image', p.image,
                'created_at', p.created_at,
                'description', p.description,
                'author', jsonb_build_object(
                    'id', u.id,
                    'verified', u.verified,
                    'name', u.name,
                    'username', u.username,
                    'avatar', u.avatar
                ),
                'post_categories', (
                    SELECT JSONB_AGG(jsonb_build_object(
                        'category', jsonb_build_object(
                            'name', c.name,
                            'id', c.id,
                            'color', c.color
                        )
                    ))
                    FROM post_categories pc
                    JOIN categories c ON pc.category = c.id
                    WHERE pc.post = p.id
                ),
                'likeCount', jsonb_build_array(jsonb_build_object('count', like_counts)),
                'commentCount', jsonb_build_array(jsonb_build_object('count', comment_counts))
            ))
            FROM posts p
            WHERE p.author = author_id
        ) AS posts,
        u.avatar,
        u.twitter,
        u.facebook,
        u.instagram,
        u.linkedin,
        u.github,
        u.twitch,
        u.youtube,
        u.tiktok,
        u.pinterest,
        post_count AS postCount,
        u.verified
    INTO
        author_record
    FROM
        users u
    WHERE
        u.id = author_id;

    -- Convert record to JSONB
    author_data := jsonb_build_object(
        'id', author_record.id,
        'name', author_record.name,
        'followerCount', author_record.followerCount,
        'followingCount', author_record.followingCount,
        'followers', author_record.followers,
        'isFollowing', author_record.isFollowing,
        'username', author_record.username,
        'background', author_record.background,
        'bio', author_record.bio,
        'website', author_record.website,
        'posts', author_record.posts,
        'avatar', author_record.avatar,
        'twitter', author_record.twitter,
        'facebook', author_record.facebook,
        'instagram', author_record.instagram,
        'linkedin', author_record.linkedin,
        'github', author_record.github,
        'twitch', author_record.twitch,
        'youtube', author_record.youtube,
        'tiktok', author_record.tiktok,
        'pinterest', author_record.pinterest,
        'postCount', author_record.postCount,
        'verified', author_record.verified
    );

    -- Return author data
    RETURN author_data;
END;
$$;

ALTER FUNCTION "public"."get_author_data"("author_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_category_data"("category_id" "uuid") RETURNS TABLE("name" "text", "id" "uuid", "image" "text", "postcount" "jsonb", "post_categories" "jsonb", "color" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.name,
        c.id,
        c.image,
        json_build_array(json_build_object('count', coalesce(pc.count, 0))) AS postCount,
        json_agg(json_build_object('post', json_build_object(
            'id', p.id,
            'title', p.title,
            'created_at', p.created_at,
            'description', p.description,
            'author', json_build_object(
                'id', u.id,
                'name', u.name,
                'username', u.username,
                'avatar', u.avatar,
                'description', u.bio
            ),
            'likeCount', json_build_array(json_build_object('count', coalesce(lc.count, 0))),
            'commentCount', json_build_array(json_build_object('count', coalesce(cc.count, 0))),
            'likes', l.likes,
            'bookmarks', b.bookmarks,
            'image', p.image,
            'post_categories', all_categories.categories
        ))) AS post_categories,
        c.color
    FROM
        categories c
    LEFT JOIN
        post_categories pc ON c.id = pc.category
    LEFT JOIN
        posts p ON pc.post = p.id
    LEFT JOIN
        users u ON p.author = u.id
    LEFT JOIN
        (
            SELECT post, COUNT(*) AS count
            FROM likes
            GROUP BY post
        ) lc ON p.id = lc.post
    LEFT JOIN
        (
            SELECT post, COUNT(*) AS count
            FROM comments
            GROUP BY post
        ) cc ON p.id = cc.post
    LEFT JOIN
        (
            SELECT post, json_agg(json_build_object('id', liker)) AS likes
            FROM likes
            GROUP BY post
        ) l ON p.id = l.post
    LEFT JOIN
        (
            SELECT post, json_agg(json_build_object('id', "user")) AS bookmarks
            FROM bookmarks
            GROUP BY post
        ) b ON p.id = b.post
    LEFT JOIN
        (
            SELECT pc2.post,
                   json_agg(json_build_object('category', json_build_object('name', categories.name, 'id', categories.id, 'color', categories.color))) AS categories
            FROM post_categories pc2
            JOIN categories ON pc2.category = categories.id
            GROUP BY pc2.post
        ) all_categories ON p.id = all_categories.post
    WHERE
        c.id = category_id
    GROUP BY
        c.id, p.id;

END;
$$;

ALTER FUNCTION "public"."get_category_data"("category_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_home_data"() RETURNS TABLE("id" "uuid", "title" "text", "image" "text", "created_at" timestamp with time zone, "author" "jsonb", "post_topics" "jsonb"[], "likecount" "jsonb"[], "commentcount" "jsonb"[], "bookmarkcount" "jsonb"[])
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        p.id,
        p.title,
        p.image,
        p.created_at,
        jsonb_build_object(
            'id', u.id,
            'verified', u.verified,
            'name', u.name,
            'username', u.username,
            'avatar', u.avatar
        ) AS author,
        jsonb_agg(
            jsonb_build_object(
                'topic', jsonb_build_object(
                    'name', c.name,
                    'id', c.id,
                    'color', c.color
                )
            )
        ) AS post_topics,
        jsonb_build_array(jsonb_build_object('count', COALESCE(lc.count, 0))) AS likeCount,
        jsonb_build_array(jsonb_build_object('count', COALESCE(cc.count, 0))) AS commentCount,
        jsonb_build_array(jsonb_build_object('count', COALESCE(bc.count, 0))) AS bookmarkCount
    FROM 
        public.posts p
    JOIN 
        public.users u ON p.author = u.id
    LEFT JOIN LATERAL (
        SELECT COUNT(*) AS count
        FROM public.likes
        WHERE post = p.id
    ) lc ON true
    LEFT JOIN LATERAL (
        SELECT COUNT(*) AS count
        FROM public.comments
        WHERE post = p.id
    ) cc ON true
    LEFT JOIN LATERAL (
        SELECT COUNT(*) AS count
        FROM public.bookmarks
        WHERE post = p.id
    ) bc ON true
    LEFT JOIN public.post_topics pc ON p.id = pc.post
    LEFT JOIN public.topics c ON pc.topic = c.id
    GROUP BY p.id, u.id, u.verified, u.name, u.username, u.avatar
    ORDER BY COALESCE((SELECT COUNT(*) FROM public.likes WHERE post = p.id), 0) DESC
    LIMIT 10; -- Change the limit as needed to get top N most liked posts
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

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."topics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying,
    "color" character varying DEFAULT 'blue'::character varying,
    "image" "text"
);

ALTER TABLE "public"."topics" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_or_create_categories"("input_categories" character varying[]) RETURNS SETOF "public"."topics"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    cat_id uuid;
    cat_color character varying;
    cat_name character varying;
BEGIN
    FOREACH cat_name IN ARRAY categories LOOP
        SELECT id, color INTO cat_id, cat_color FROM categories WHERE name = cat_name;
        IF NOT FOUND THEN
            -- Generate random color
            cat_color := CASE floor(random()*4)::int
                             WHEN 0 THEN 'red'
                             WHEN 1 THEN 'green'
                             WHEN 2 THEN 'blue'
                             ELSE 'yellow'
                         END;
            -- Insert new category
            INSERT INTO categories (id, name, color) VALUES (gen_random_uuid(), cat_name, cat_color) RETURNING id INTO cat_id;
        END IF;
        RETURN NEXT cat_id;
    END LOOP;
    RETURN;
END;
$$;

ALTER FUNCTION "public"."get_or_create_categories"("input_categories" character varying[]) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_post_data"("post_id" "uuid") RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    post_record RECORD;
    post_json JSON;
BEGIN
    -- Fetch post data
    SELECT
        p.id,
        p.title,
        p.image,
        p.created_at,
        p."estimatedReadingTime",
        p.description,
        p.text,
        json_build_object('author_id', u.id, 'verified', u.verified, 'name', u.name, 'username', u.username, 'avatar', u.avatar, 'description', u.bio) AS author,
        (
            SELECT json_agg(
                json_build_object(
                    'category', json_build_object('name', c.name, 'id', c.id, 'color', c.color)
                )
            )
            FROM post_categories pc
            JOIN categories c ON pc.category = c.id
            WHERE pc.post = p.id
        ) AS post_categories,
        (
            SELECT COUNT(*)
            FROM likes
            WHERE post = p.id
        ) AS likeCount,
        (
            SELECT COUNT(*)
            FROM comments
            WHERE post = p.id
        ) AS commentCount,
        (
            SELECT json_agg(
                json_build_object('liker', json_build_object('id', liker))
            )
            FROM likes
            WHERE post = p.id
        ) AS likes,
        EXISTS (
            SELECT 1
            FROM likes
            WHERE post = p.id AND liker = 'current_user_id'
        ) AS isLiked,
        EXISTS (
            SELECT 1
            FROM bookmarks
            WHERE post = p.id AND "user" = 'current_user_id'
        ) AS isBookmarked,
        (
            SELECT COUNT(*)
            FROM bookmarks
            WHERE post = p.id
        ) AS bookmarkCount,
        (
            SELECT json_agg(
                json_build_object('user', json_build_object('id', "user"))
            )
            FROM bookmarks
            WHERE post = p.id
        ) AS bookmarks,
        (
            SELECT json_agg(
                json_build_object(
                    'commenter', json_build_object('name', uc.name, 'username', uc.username, 'image', uc.avatar, 'description', uc.bio), 
                    'comment', cm.comment, 
                    'created_at', cm.created_at
                )
            )
            FROM comments cm
            JOIN users uc ON cm.commenter = uc.id
            WHERE cm.post = p.id
        ) AS comments
    INTO
        post_record
    FROM
        posts p
    LEFT JOIN
        users u ON p.author = u.id
    WHERE
        p.id = post_id;

    -- Convert record to JSON
    SELECT json_build_object(
        'id', post_record.id,
        'title', post_record.title,
        'image', post_record.image,
        'created_at', post_record.created_at,
        'estimatedReadingTime', post_record."estimatedReadingTime",
        'description', post_record.description,
        'text', post_record.text,
        'author', post_record.author,
        'post_categories', post_record.post_categories,
        'likeCount', post_record.likeCount,
        'commentCount', post_record.commentCount,
        'likes', post_record.likes,
        'isLiked', post_record.isLiked,
        'isBookmarked', post_record.isBookmarked,
        'bookmarkCount', post_record.bookmarkCount,
        'bookmarks', post_record.bookmarks,
        'comments', post_record.comments
    ) INTO post_json;

    RETURN post_json;
END;
$$;

ALTER FUNCTION "public"."get_post_data"("post_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_post_data"("post_id" "uuid", "current_user_id" "uuid") RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    post_record RECORD;
    post_json JSON;
BEGIN

    -- Fetch post data
    SELECT
        p.id,
        p.title,
        p.image,
        p.json,
        p.created_at,
        p."estimatedReadingTime",
        p.description,
        p.text,
        json_build_object('id', u.id, 'verified', u.verified, 'name', u.name, 'username', u.username, 'avatar', u.avatar, 'description', u.bio) AS author,
        (
            SELECT json_agg(
                json_build_object(
                    'category', json_build_object('name', c.name, 'id', c.id, 'color', c.color)
                )
            )
            FROM post_categories pc
            JOIN categories c ON pc.category = c.id
            WHERE pc.post = p.id
        ) AS post_categories,
        (
            SELECT COUNT(*)
            FROM likes
            WHERE post = p.id
        ) AS likeCount,
        (
            SELECT COUNT(*)
            FROM comments
            WHERE post = p.id
        ) AS commentCount,
        (
            SELECT json_agg(
                json_build_object('liker', json_build_object('id', liker))
            )
            FROM likes
            WHERE post = p.id
        ) AS likes,
        EXISTS (
            SELECT 1
            FROM likes
            WHERE post = p.id AND liker = current_user_id
        ) AS isLiked,
        EXISTS (
            SELECT 1
            FROM bookmarks
            WHERE post = p.id AND "user" = current_user_id
        ) AS isBookmarked,
        (
            SELECT COUNT(*)
            FROM bookmarks
            WHERE post = p.id
        ) AS bookmarkCount,
        (
            SELECT json_agg(
                json_build_object('user', json_build_object('id', "user"))
            )
            FROM bookmarks
            WHERE post = p.id
        ) AS bookmarks,
        (
            SELECT json_agg(
                json_build_object(
                    'commenter', json_build_object('name', uc.name, 'username', uc.username, 'image', uc.avatar, 'description', uc.bio), 
                    'comment', cm.comment, 
                    'created_at', cm.created_at
                )
            )
            FROM comments cm
            JOIN users uc ON cm.commenter = uc.id
            WHERE cm.post = p.id
        ) AS comments
    INTO
        post_record
    FROM
        posts p
    LEFT JOIN
        users u ON p.author = u.id
    WHERE
        p.id = post_id;

    -- Insert row into watch_history table
    INSERT INTO watch_history (post, user_id, created_at)
    VALUES (post_id, current_user_id, NOW());

    -- Convert record to JSON
    SELECT json_build_object(
        'id', post_record.id,
        'title', post_record.title,
        'image', post_record.image,
        'json', post_record.json,
        'created_at', post_record.created_at,
        'estimatedReadingTime', post_record."estimatedReadingTime",
        'description', post_record.description,
        'text', post_record.text,
        'author', post_record.author,
        'post_categories', post_record.post_categories,
        'likeCount', json_build_array(json_build_object('count', coalesce(post_record.likeCount, 0))),
        'commentCount', json_build_array(json_build_object('count', coalesce(post_record.commentCount, 0))),
        'likes', post_record.likes,
        'isLiked', post_record.isLiked,
        'isBookmarked', post_record.isBookmarked,
        'bookmarkCount', post_record.bookmarkCount,
        'bookmarks', post_record.bookmarks,
        'comments', post_record.comments
    ) INTO post_json;

    RETURN post_json;
END;
$$;

ALTER FUNCTION "public"."get_post_data"("post_id" "uuid", "current_user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_posts_in_category"("category_id" "uuid") RETURNS TABLE("name" "text", "id" "uuid", "image" "text", "postcount" "jsonb", "post_categories" "jsonb", "color" "text")
    LANGUAGE "sql" STABLE
    AS $$
    SELECT
        c.name,
        c.id,
        c.image,
        json_build_array(json_build_object('count', coalesce(pc.count, 0))) AS postCount,
        json_agg(json_build_object('post', json_build_object(
            'id', p.id,
            'title', p.title,
            'created_at', p.created_at,
            'description', p.description,
            'author', json_build_object(
                'id', u.id,
                'name', u.name,
                'username', u.username,
                'avatar', u.avatar,
                'description', u.bio
            ),
            'likeCount', json_build_array(json_build_object('count', coalesce(lc.count, 0))),
            'commentCount', json_build_array(json_build_object('count', coalesce(cc.count, 0))),
            'likes', l.likes,
            'bookmarks', b.bookmarks,
            'image', p.image,
            'categories', all_categories.categories
        ))) AS post_categories,
        c.color
    FROM
        categories c
    LEFT JOIN
        post_categories pc ON c.id = pc.category
    LEFT JOIN
        posts p ON pc.post = p.id
    LEFT JOIN
        users u ON p.author = u.id
    LEFT JOIN
        (
            SELECT post, COUNT(*) AS count
            FROM likes
            GROUP BY post
        ) lc ON p.id = lc.post
    LEFT JOIN
        (
            SELECT post, COUNT(*) AS count
            FROM comments
            GROUP BY post
        ) cc ON p.id = cc.post
    LEFT JOIN
        (
            SELECT post, json_agg(json_build_object('id', liker)) AS likes
            FROM likes
            GROUP BY post
        ) l ON p.id = l.post
    LEFT JOIN
        (
            SELECT post, json_agg(json_build_object('id', "user")) AS bookmarks
            FROM bookmarks
            GROUP BY post
        ) b ON p.id = b.post
    LEFT JOIN
        (
            SELECT pc2.post,
                   json_agg(json_build_object('name', categories.name, 'id', categories.id, 'color', categories.color)) AS categories
            FROM post_categories pc2
            JOIN categories ON pc2.category = categories.id
            GROUP BY pc2.post
        ) all_categories ON p.id = all_categories.post
    WHERE
        c.id = category_id
    GROUP BY
        c.id, p.id;
$$;

ALTER FUNCTION "public"."get_posts_in_category"("category_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.users (id, name, avatar, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'email');
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."manage_categories"("categories" character varying[], OUT "cat_id" "uuid", OUT "cat_name" character varying, OUT "cat_color" character varying) RETURNS SETOF "record"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    FOR cat_name IN SELECT unnest(categories) LOOP
        -- Check if category exists
        SELECT id, color INTO cat_id, cat_color FROM public.categories WHERE name = cat_name;
        
        -- If category doesn't exist, create it
        IF NOT FOUND THEN
            -- Generate random color
            cat_color := CASE floor(random()*4)::int
                             WHEN 0 THEN 'red'
                             WHEN 1 THEN 'green'
                             WHEN 2 THEN 'blue'
                             ELSE 'yellow'
                           END;
            -- Insert new category
            INSERT INTO public.categories (id, name, color) VALUES (gen_random_uuid(), cat_name, cat_color) RETURNING id INTO cat_id;
        END IF;
        
        -- Return category details
        RETURN NEXT;
    END LOOP;
    RETURN;
END;
$$;

ALTER FUNCTION "public"."manage_categories"("categories" character varying[], OUT "cat_id" "uuid", OUT "cat_name" character varying, OUT "cat_color" character varying) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."manage_topics"("topics" character varying[], OUT "top_id" "uuid", OUT "top_name" character varying, OUT "top_color" character varying) RETURNS SETOF "record"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    FOR top_name IN SELECT unnest(topics) LOOP
        -- Check if topic exists
        SELECT id, color INTO top_id, top_color FROM public.topics WHERE name = top_name;
        
        -- If topic doesn't exist, create it
        IF NOT FOUND THEN
            -- Generate random color
            top_color := CASE floor(random()*4)::int
                             WHEN 0 THEN 'red'
                             WHEN 1 THEN 'green'
                             WHEN 2 THEN 'blue'
                             ELSE 'yellow'
                           END;
            -- Insert new topic
            INSERT INTO public.topics (id, name, color) VALUES (gen_random_uuid(), top_name, top_color) RETURNING id INTO top_id;
        END IF;
        
        -- Return topic details
        RETURN NEXT;
    END LOOP;
    RETURN;
END;
$$;

ALTER FUNCTION "public"."manage_topics"("topics" character varying[], OUT "top_id" "uuid", OUT "top_name" character varying, OUT "top_color" character varying) OWNER TO "postgres";

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

CREATE OR REPLACE FUNCTION "public"."match_posts"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "filter_option" "text") RETURNS TABLE("id" "uuid", "title" "text", "created_at" timestamp with time zone, "description" "text", "likecount" "jsonb", "commentcount" "jsonb", "likes" "jsonb", "bookmarks" "jsonb", "image" "text", "author" "jsonb", "post_topics" "jsonb", "similarity" double precision)
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
        'topic',
        json_build_object(
          'name', topics.name,
          'color', topics.color
        )
      )
    ) AS post_topics,
    1 - (posts.embeddings <=> query_embedding) AS similarity
  FROM posts
  LEFT JOIN users ON posts.author = users.id
  LEFT JOIN post_topics ON posts.id = post_topics.post
  LEFT JOIN topics ON post_topics.topic = topics.id
  LEFT JOIN comments ON posts.id = comments.post
  LEFT JOIN likes ON posts.id = likes.post
  WHERE 1 - (posts.embeddings <=> query_embedding) > match_threshold AND posts.scheduled_at IS null
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

CREATE OR REPLACE FUNCTION "public"."related_posts"("post_id" "uuid", "match_threshold" double precision, "match_count" integer) RETURNS TABLE("id" "uuid", "title" "text", "created_at" timestamp with time zone, "description" "text", "likecount" "jsonb", "commentcount" "jsonb", "likes" "jsonb", "bookmarks" "jsonb", "image" "text", "author" "jsonb", "post_topics" "jsonb", "similarity" double precision)
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
          'topic',
          json_build_object(
            'name',
            topics.name,
            'color',
            topics.color
          )
        )
      )
      FROM post_topics pc2
      LEFT JOIN topics ON pc2.topic = topics.id
      WHERE pc2.post = posts.id
    ) AS post_topics,
    1 - (posts.embeddings <=> posts.embeddings) AS similarity
  FROM posts
  LEFT JOIN users ON posts.author = users.id
  LEFT JOIN post_topics ON posts.id = post_topics.post
  LEFT JOIN topics ON post_topics.topic = topics.id
  LEFT JOIN comments ON posts.id = comments.post
  LEFT JOIN post_topics pc ON pc.post = posts.id
  LEFT JOIN posts related_posts ON related_posts.id = pc.post
  WHERE related_posts.id = post_id
    AND posts.id <> post_id -- Exclude the post with the same ID
    AND 1 - (posts.embeddings <=> posts.embeddings) > match_threshold
    AND posts.scheduled_at IS NULL
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

CREATE TABLE IF NOT EXISTS "public"."banned_users" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email" "text" NOT NULL
);

ALTER TABLE "public"."banned_users" OWNER TO "postgres";

ALTER TABLE "public"."banned_users" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."banned_users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

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

CREATE TABLE IF NOT EXISTS "public"."draft_topics" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "draft" "uuid",
    "topic" "uuid"
);

ALTER TABLE "public"."draft_topics" OWNER TO "postgres";

ALTER TABLE "public"."draft_topics" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."draft_categories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."drafts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "json" "jsonb",
    "author" "uuid",
    "image" "text",
    "estimatedReadingTime" smallint,
    "text" "text",
    "edited_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."drafts" OWNER TO "postgres";

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

CREATE TABLE IF NOT EXISTS "public"."hidden_posts" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "post" "uuid",
    "user_id" "uuid"
);

ALTER TABLE "public"."hidden_posts" OWNER TO "postgres";

ALTER TABLE "public"."hidden_posts" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."hidden_posts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."likes" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
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

CREATE TABLE IF NOT EXISTS "public"."notification_settings" (
    "id" bigint NOT NULL,
    "user_id" "uuid",
    "likes" "text"[] DEFAULT '{"In App"}'::"text"[] NOT NULL,
    "comments" "text"[] DEFAULT '{"In App"}'::"text"[] NOT NULL,
    "new_follower" "text"[] DEFAULT '{"In App"}'::"text"[] NOT NULL,
    "following_post" "text"[] DEFAULT '{"In App"}'::"text"[] NOT NULL,
    "scheduled_posts" "text"[] DEFAULT '{"In App"}'::"text"[] NOT NULL,
    "likes_milestone" "text"[] DEFAULT '{"In App"}'::"text"[] NOT NULL,
    "comments_milestone" "text"[] DEFAULT '{"In App"}'::"text"[] NOT NULL,
    "published_posts_milestones" "text"[] DEFAULT '{"In App"}'::"text"[] NOT NULL,
    "followers_milestone" "text"[] DEFAULT '{"In App"}'::"text"[] NOT NULL
);

ALTER TABLE "public"."notification_settings" OWNER TO "postgres";

ALTER TABLE "public"."notification_settings" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."notification_settings_id_seq"
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

CREATE TABLE IF NOT EXISTS "public"."post_topics" (
    "post" "uuid" NOT NULL,
    "topic" "uuid" NOT NULL
);

ALTER TABLE "public"."post_topics" OWNER TO "postgres";

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
    "embeddings" "public"."vector",
    "json" "jsonb",
    "index" bigint NOT NULL,
    "scheduled_at" timestamp with time zone,
    "license" "text"
);
ALTER TABLE ONLY "public"."posts" ALTER COLUMN "embeddings" SET STORAGE EXTENDED;

ALTER TABLE "public"."posts" OWNER TO "postgres";

ALTER TABLE "public"."posts" ALTER COLUMN "index" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."posts_index_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."reports" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "comment" bigint,
    "post" "uuid",
    "type" "text",
    "message" "text",
    "reporter" "uuid"
);

ALTER TABLE "public"."reports" OWNER TO "postgres";

ALTER TABLE "public"."reports" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."reports_id_seq1"
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
    "background" "text",
    "index" bigint NOT NULL,
    "email" "text"
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE "public"."users" ALTER COLUMN "index" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_index_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."watch_history" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "post" "uuid",
    "user_id" "uuid"
);

ALTER TABLE "public"."watch_history" OWNER TO "postgres";

ALTER TABLE "public"."watch_history" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."watch_history_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."banned_users"
    ADD CONSTRAINT "banned_users_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."banned_users"
    ADD CONSTRAINT "banned_users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."comment_likes"
    ADD CONSTRAINT "comment_likes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."draft_topics"
    ADD CONSTRAINT "draft_categories_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."drafts"
    ADD CONSTRAINT "drafts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."followers"
    ADD CONSTRAINT "followers_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."hidden_posts"
    ADD CONSTRAINT "hidden_posts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."notification_settings"
    ADD CONSTRAINT "notification_settings_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."post_topics"
    ADD CONSTRAINT "post_topics_pkey" PRIMARY KEY ("post", "topic");

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_index_key" UNIQUE ("index");

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_pkey1" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."topics"
    ADD CONSTRAINT "topics_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."watch_history"
    ADD CONSTRAINT "unique_post_user" UNIQUE ("user_id", "post");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_index_key" UNIQUE ("index");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");

ALTER TABLE ONLY "public"."watch_history"
    ADD CONSTRAINT "watch_history_pkey" PRIMARY KEY ("id");

CREATE OR REPLACE TRIGGER "addEmbeddings" AFTER INSERT ON "public"."posts" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://vkruooaeaacsdxvfxwpu.supabase.co/functions/v1/genEmbeds', 'POST', '{"Content-type":"application/json"}', '{}', '5000');

CREATE OR REPLACE TRIGGER "check_banned_email_trigger" AFTER INSERT ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."check_banned_email"();

CREATE OR REPLACE TRIGGER "comment_notification_trigger" AFTER INSERT ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."notify_on_comment"();

CREATE OR REPLACE TRIGGER "follow_notification_trigger" AFTER INSERT ON "public"."followers" FOR EACH ROW EXECUTE FUNCTION "public"."notify_on_follow"();

CREATE OR REPLACE TRIGGER "remove_comment_notification_trigger" AFTER DELETE ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."remove_comment_notification"();

CREATE OR REPLACE TRIGGER "unfollow_notification_trigger" AFTER DELETE ON "public"."followers" FOR EACH ROW EXECUTE FUNCTION "public"."remove_follow_notification"();

ALTER TABLE ONLY "public"."comment_likes"
    ADD CONSTRAINT "comment_likes_comment_fkey" FOREIGN KEY ("comment") REFERENCES "public"."comments"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."comment_likes"
    ADD CONSTRAINT "comment_likes_liker_fkey" FOREIGN KEY ("liker") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_commenter_fkey" FOREIGN KEY ("commenter") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_post_fkey" FOREIGN KEY ("post") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."draft_topics"
    ADD CONSTRAINT "draft_categories_category_fkey" FOREIGN KEY ("topic") REFERENCES "public"."topics"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."draft_topics"
    ADD CONSTRAINT "draft_categories_draft_fkey" FOREIGN KEY ("draft") REFERENCES "public"."drafts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."drafts"
    ADD CONSTRAINT "drafts_author_fkey" FOREIGN KEY ("author") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."followers"
    ADD CONSTRAINT "followers_follower_fkey" FOREIGN KEY ("follower") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."followers"
    ADD CONSTRAINT "followers_following_fkey" FOREIGN KEY ("following") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_notifier_fkey" FOREIGN KEY ("notifier") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_post_fkey" FOREIGN KEY ("post") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."post_topics"
    ADD CONSTRAINT "post_categories_category_fkey" FOREIGN KEY ("topic") REFERENCES "public"."topics"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."post_topics"
    ADD CONSTRAINT "post_categories_post_fkey" FOREIGN KEY ("post") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_author_fkey" FOREIGN KEY ("author") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "public_bookmarks_post_fkey" FOREIGN KEY ("post") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "public_bookmarks_user_fkey" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."hidden_posts"
    ADD CONSTRAINT "public_hidden_posts_post_fkey" FOREIGN KEY ("post") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."hidden_posts"
    ADD CONSTRAINT "public_hidden_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "public_likes_liker_fkey" FOREIGN KEY ("liker") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "public_likes_post_fkey" FOREIGN KEY ("post") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."notification_settings"
    ADD CONSTRAINT "public_notification_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "public_reports_comment_fkey" FOREIGN KEY ("comment") REFERENCES "public"."comments"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "public_reports_post_fkey" FOREIGN KEY ("post") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "public_reports_reporter_fkey" FOREIGN KEY ("reporter") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_team_fkey" FOREIGN KEY ("team") REFERENCES "public"."teams"("id");

ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_admin_fkey" FOREIGN KEY ("admin") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."watch_history"
    ADD CONSTRAINT "watch_history_post_fkey" FOREIGN KEY ("post") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."watch_history"
    ADD CONSTRAINT "watch_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Anyone can access posts" ON "public"."posts" FOR SELECT USING (true);

CREATE POLICY "Enable delete access based on their id" ON "public"."comments" FOR DELETE USING (("auth"."uid"() = "commenter"));

CREATE POLICY "Enable delete for everyone" ON "public"."draft_topics" FOR DELETE USING (true);

CREATE POLICY "Enable delete for everyone" ON "public"."post_topics" FOR DELETE USING (true);

CREATE POLICY "Enable delete for users based on liker" ON "public"."likes" FOR DELETE USING (("auth"."uid"() = "liker"));

CREATE POLICY "Enable delete for users based on their id" ON "public"."followers" FOR DELETE USING (("auth"."uid"() = "follower"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."bookmarks" FOR DELETE USING (true);

CREATE POLICY "Enable delete for users based on user_id" ON "public"."drafts" FOR DELETE USING (("auth"."uid"() = "author"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."hidden_posts" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."notifications" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."posts" FOR DELETE USING (("auth"."uid"() = "author"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."team_members" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."watch_history" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."bookmarks" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."comment_likes" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."comments" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."draft_topics" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."drafts" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."followers" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."hidden_posts" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."likes" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."notification_settings" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."notifications" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."post_topics" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."posts" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."team_members" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."topics" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."users" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."watch_history" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable read access based on user ID" ON "public"."watch_history" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable read access based on user_id" ON "public"."drafts" FOR SELECT USING (("auth"."uid"() = "author"));

CREATE POLICY "Enable read access for all users" ON "public"."bookmarks" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."comment_likes" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."comments" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."draft_topics" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."followers" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."likes" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."post_topics" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."team_members" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."topics" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."users" FOR SELECT USING (true);

CREATE POLICY "Enable select access for users based on user_id" ON "public"."notifications" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable select for users based on user_id" ON "public"."hidden_posts" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable select for users based on user_id" ON "public"."notification_settings" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable update access based on user's id" ON "public"."comments" FOR UPDATE USING (("auth"."uid"() = "commenter")) WITH CHECK (("auth"."uid"() = "commenter"));

CREATE POLICY "Enable update access for users based on user_id" ON "public"."notifications" FOR UPDATE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable update based on user's id" ON "public"."users" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "Enable update for authenticated users only" ON "public"."topics" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "Enable update for users based on their id" ON "public"."posts" FOR UPDATE USING (("auth"."uid"() = "author")) WITH CHECK (("auth"."uid"() = "author"));

CREATE POLICY "Enable update for users based on user_id" ON "public"."drafts" FOR UPDATE USING (("auth"."uid"() = "author")) WITH CHECK (("auth"."uid"() = "author"));

CREATE POLICY "Enable update for users based on user_id" ON "public"."notification_settings" FOR UPDATE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable update for users based on user_id" ON "public"."watch_history" FOR UPDATE USING (("auth"."uid"() = "user_id"));

ALTER TABLE "public"."banned_users" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."bookmarks" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."comment_likes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."draft_topics" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."drafts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."followers" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."hidden_posts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."likes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."notification_settings" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."post_topics" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."reports" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."team_members" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."teams" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."topics" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."watch_history" ENABLE ROW LEVEL SECURITY;

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."check_banned_email"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_banned_email"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_banned_email"() TO "service_role";

GRANT ALL ON FUNCTION "public"."check_scheduled_posts"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_scheduled_posts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_scheduled_posts"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_author_data"("author_username" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_author_data"("author_username" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_author_data"("author_username" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_author_data"("author_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_author_data"("author_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_author_data"("author_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_category_data"("category_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_category_data"("category_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_category_data"("category_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_home_data"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_home_data"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_home_data"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_home_data"("current_user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_home_data"("current_user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_home_data"("current_user_uuid" "uuid") TO "service_role";

GRANT ALL ON TABLE "public"."topics" TO "anon";
GRANT ALL ON TABLE "public"."topics" TO "authenticated";
GRANT ALL ON TABLE "public"."topics" TO "service_role";

GRANT ALL ON FUNCTION "public"."get_or_create_categories"("input_categories" character varying[]) TO "anon";
GRANT ALL ON FUNCTION "public"."get_or_create_categories"("input_categories" character varying[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_or_create_categories"("input_categories" character varying[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_post_data"("post_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_post_data"("post_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_post_data"("post_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_post_data"("post_id" "uuid", "current_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_post_data"("post_id" "uuid", "current_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_post_data"("post_id" "uuid", "current_user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_posts_in_category"("category_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_posts_in_category"("category_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_posts_in_category"("category_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."manage_categories"("categories" character varying[], OUT "cat_id" "uuid", OUT "cat_name" character varying, OUT "cat_color" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."manage_categories"("categories" character varying[], OUT "cat_id" "uuid", OUT "cat_name" character varying, OUT "cat_color" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."manage_categories"("categories" character varying[], OUT "cat_id" "uuid", OUT "cat_name" character varying, OUT "cat_color" character varying) TO "service_role";

GRANT ALL ON FUNCTION "public"."manage_topics"("topics" character varying[], OUT "top_id" "uuid", OUT "top_name" character varying, OUT "top_color" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."manage_topics"("topics" character varying[], OUT "top_id" "uuid", OUT "top_name" character varying, OUT "top_color" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."manage_topics"("topics" character varying[], OUT "top_id" "uuid", OUT "top_name" character varying, OUT "top_color" character varying) TO "service_role";

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

GRANT ALL ON TABLE "public"."banned_users" TO "anon";
GRANT ALL ON TABLE "public"."banned_users" TO "authenticated";
GRANT ALL ON TABLE "public"."banned_users" TO "service_role";

GRANT ALL ON SEQUENCE "public"."banned_users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."banned_users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."banned_users_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."bookmarks" TO "anon";
GRANT ALL ON TABLE "public"."bookmarks" TO "authenticated";
GRANT ALL ON TABLE "public"."bookmarks" TO "service_role";

GRANT ALL ON SEQUENCE "public"."bookmarks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."bookmarks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."bookmarks_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."comment_likes" TO "anon";
GRANT ALL ON TABLE "public"."comment_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."comment_likes" TO "service_role";

GRANT ALL ON SEQUENCE "public"."comment_likes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."comment_likes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."comment_likes_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";

GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."draft_topics" TO "anon";
GRANT ALL ON TABLE "public"."draft_topics" TO "authenticated";
GRANT ALL ON TABLE "public"."draft_topics" TO "service_role";

GRANT ALL ON SEQUENCE "public"."draft_categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."draft_categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."draft_categories_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."drafts" TO "anon";
GRANT ALL ON TABLE "public"."drafts" TO "authenticated";
GRANT ALL ON TABLE "public"."drafts" TO "service_role";

GRANT ALL ON TABLE "public"."followers" TO "anon";
GRANT ALL ON TABLE "public"."followers" TO "authenticated";
GRANT ALL ON TABLE "public"."followers" TO "service_role";

GRANT ALL ON SEQUENCE "public"."followers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."followers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."followers_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."hidden_posts" TO "anon";
GRANT ALL ON TABLE "public"."hidden_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."hidden_posts" TO "service_role";

GRANT ALL ON SEQUENCE "public"."hidden_posts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."hidden_posts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."hidden_posts_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."likes" TO "anon";
GRANT ALL ON TABLE "public"."likes" TO "authenticated";
GRANT ALL ON TABLE "public"."likes" TO "service_role";

GRANT ALL ON SEQUENCE "public"."likes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."likes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."likes_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."notification_settings" TO "anon";
GRANT ALL ON TABLE "public"."notification_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."notification_settings" TO "service_role";

GRANT ALL ON SEQUENCE "public"."notification_settings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notification_settings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notification_settings_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";

GRANT ALL ON TABLE "public"."post_topics" TO "anon";
GRANT ALL ON TABLE "public"."post_topics" TO "authenticated";
GRANT ALL ON TABLE "public"."post_topics" TO "service_role";

GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";

GRANT ALL ON SEQUENCE "public"."posts_index_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."posts_index_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."posts_index_seq" TO "service_role";

GRANT ALL ON TABLE "public"."reports" TO "anon";
GRANT ALL ON TABLE "public"."reports" TO "authenticated";
GRANT ALL ON TABLE "public"."reports" TO "service_role";

GRANT ALL ON SEQUENCE "public"."reports_id_seq1" TO "anon";
GRANT ALL ON SEQUENCE "public"."reports_id_seq1" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."reports_id_seq1" TO "service_role";

GRANT ALL ON TABLE "public"."team_members" TO "anon";
GRANT ALL ON TABLE "public"."team_members" TO "authenticated";
GRANT ALL ON TABLE "public"."team_members" TO "service_role";

GRANT ALL ON TABLE "public"."teams" TO "anon";
GRANT ALL ON TABLE "public"."teams" TO "authenticated";
GRANT ALL ON TABLE "public"."teams" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

GRANT ALL ON SEQUENCE "public"."users_index_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_index_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_index_seq" TO "service_role";

GRANT ALL ON TABLE "public"."watch_history" TO "anon";
GRANT ALL ON TABLE "public"."watch_history" TO "authenticated";
GRANT ALL ON TABLE "public"."watch_history" TO "service_role";

GRANT ALL ON SEQUENCE "public"."watch_history_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."watch_history_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."watch_history_id_seq" TO "service_role";

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

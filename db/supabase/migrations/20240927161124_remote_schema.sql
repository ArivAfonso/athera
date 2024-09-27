drop policy "Enable delete for users based on user_id" on "public"."interests";

drop policy "Enable insert for authenticated users only" on "public"."interests";

drop policy "Enable read access for select roles and user_id" on "public"."interests";

drop policy "Enable delete for users based on user_id" on "public"."team_members";

drop policy "Enable insert for authenticated users only" on "public"."team_members";

drop policy "Enable read access for all users" on "public"."team_members";

revoke delete on table "public"."interests" from "anon";

revoke insert on table "public"."interests" from "anon";

revoke references on table "public"."interests" from "anon";

revoke select on table "public"."interests" from "anon";

revoke trigger on table "public"."interests" from "anon";

revoke truncate on table "public"."interests" from "anon";

revoke update on table "public"."interests" from "anon";

revoke delete on table "public"."interests" from "authenticated";

revoke insert on table "public"."interests" from "authenticated";

revoke references on table "public"."interests" from "authenticated";

revoke select on table "public"."interests" from "authenticated";

revoke trigger on table "public"."interests" from "authenticated";

revoke truncate on table "public"."interests" from "authenticated";

revoke update on table "public"."interests" from "authenticated";

revoke delete on table "public"."interests" from "service_role";

revoke insert on table "public"."interests" from "service_role";

revoke references on table "public"."interests" from "service_role";

revoke select on table "public"."interests" from "service_role";

revoke trigger on table "public"."interests" from "service_role";

revoke truncate on table "public"."interests" from "service_role";

revoke update on table "public"."interests" from "service_role";

revoke delete on table "public"."team_members" from "anon";

revoke insert on table "public"."team_members" from "anon";

revoke references on table "public"."team_members" from "anon";

revoke select on table "public"."team_members" from "anon";

revoke trigger on table "public"."team_members" from "anon";

revoke truncate on table "public"."team_members" from "anon";

revoke update on table "public"."team_members" from "anon";

revoke delete on table "public"."team_members" from "authenticated";

revoke insert on table "public"."team_members" from "authenticated";

revoke references on table "public"."team_members" from "authenticated";

revoke select on table "public"."team_members" from "authenticated";

revoke trigger on table "public"."team_members" from "authenticated";

revoke truncate on table "public"."team_members" from "authenticated";

revoke update on table "public"."team_members" from "authenticated";

revoke delete on table "public"."team_members" from "service_role";

revoke insert on table "public"."team_members" from "service_role";

revoke references on table "public"."team_members" from "service_role";

revoke select on table "public"."team_members" from "service_role";

revoke trigger on table "public"."team_members" from "service_role";

revoke truncate on table "public"."team_members" from "service_role";

revoke update on table "public"."team_members" from "service_role";

revoke delete on table "public"."teams" from "anon";

revoke insert on table "public"."teams" from "anon";

revoke references on table "public"."teams" from "anon";

revoke select on table "public"."teams" from "anon";

revoke trigger on table "public"."teams" from "anon";

revoke truncate on table "public"."teams" from "anon";

revoke update on table "public"."teams" from "anon";

revoke delete on table "public"."teams" from "authenticated";

revoke insert on table "public"."teams" from "authenticated";

revoke references on table "public"."teams" from "authenticated";

revoke select on table "public"."teams" from "authenticated";

revoke trigger on table "public"."teams" from "authenticated";

revoke truncate on table "public"."teams" from "authenticated";

revoke update on table "public"."teams" from "authenticated";

revoke delete on table "public"."teams" from "service_role";

revoke insert on table "public"."teams" from "service_role";

revoke references on table "public"."teams" from "service_role";

revoke select on table "public"."teams" from "service_role";

revoke trigger on table "public"."teams" from "service_role";

revoke truncate on table "public"."teams" from "service_role";

revoke update on table "public"."teams" from "service_role";

alter table "public"."interests" drop constraint "interests_topic_fkey";

alter table "public"."interests" drop constraint "interests_user_fkey";

alter table "public"."team_members" drop constraint "team_members_team_fkey";

alter table "public"."team_members" drop constraint "team_members_user_id_fkey";

alter table "public"."teams" drop constraint "teams_admin_fkey";

alter table "public"."interests" drop constraint "interests_pkey";

alter table "public"."team_members" drop constraint "team_members_pkey";

alter table "public"."teams" drop constraint "teams_pkey";

drop index if exists "public"."interests_pkey";

drop index if exists "public"."team_members_pkey";

drop index if exists "public"."teams_pkey";

drop table "public"."interests";

drop table "public"."team_members";

drop table "public"."teams";

alter table "public"."users" alter column "avatar" set default 'https://vkruooaeaacsdxvfxwpu.supabase.co/storage/v1/object/public/avatars/default-pic.png'::text;



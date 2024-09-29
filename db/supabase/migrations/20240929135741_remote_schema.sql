CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION storage.extension(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
_filename text;
BEGIN
    select string_to_array(name, '/') into _parts;
    select _parts[array_length(_parts,1)] into _filename;
    -- @todo return the last part instead of 2
    return split_part(_filename, '.', 2);
END
$function$
;

CREATE OR REPLACE FUNCTION storage.filename(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, '/') into _parts;
    return _parts[array_length(_parts,1)];
END
$function$
;

CREATE OR REPLACE FUNCTION storage.foldername(name text)
 RETURNS text[]
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, '/') into _parts;
    return _parts[1:array_length(_parts,1)-1];
END
$function$
;

create policy "Anyone can read files 1oj01fe_0"
on "storage"."objects"
as permissive
for select
to public
using (true);


create policy "Give Ariv access"
on "storage"."objects"
as permissive
for insert
to public
with check ((((bucket_id = 'categories'::text) AND ((auth.uid())::text = 'd8101ee4-ae24-4f0f-bf00-0674140b4675'::text)) OR ((auth.uid())::text = 'b0156ec3-2660-421e-8aea-bb704cf67ec4'::text)));


create policy "Give anon users access lfwun0_0"
on "storage"."objects"
as permissive
for select
to public
using (true);


create policy "Give anon users access to images"
on "storage"."objects"
as permissive
for select
to public
using (((bucket_id = 'images'::text) AND (storage.extension(name) = 'jpg'::text) AND (storage.extension(name) = 'png'::text) AND (storage.extension(name) = 'svg'::text) AND (storage.extension(name) = 'jpeg'::text) AND (storage.extension(name) = 'webp'::text) AND (lower((storage.foldername(name))[1]) = 'public'::text) AND (auth.role() = 'anon'::text)));


create policy "Give authenticated users access to own folder 1ffg0oo_1"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'images'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give authenticated users access to own folder 1ffg0oo_2"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'images'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give authenticated users access to their own folder"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'images'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to their own folders 1oj01fe_0"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to their own folders 1oj01fe_1"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to their own folders 1oj01fe_2"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users authenticated access to folder lfwun0_1"
on "storage"."objects"
as permissive
for update
to public
using ((((bucket_id = 'categories'::text) AND ((auth.uid())::text = 'd8101ee4-ae24-4f0f-bf00-0674140b4675'::text)) OR ((auth.uid())::text = 'b0156ec3-2660-421e-8aea-bb704cf67ec4'::text)));


create policy "Give users authenticated access to folder lfwun0_2"
on "storage"."objects"
as permissive
for delete
to public
using ((((bucket_id = 'categories'::text) AND ((auth.uid())::text = 'd8101ee4-ae24-4f0f-bf00-0674140b4675'::text)) OR ((auth.uid())::text = 'b0156ec3-2660-421e-8aea-bb704cf67ec4'::text)));




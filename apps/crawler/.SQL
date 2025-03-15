CREATE OR REPLACE FUNCTION manage_topics(topics character varying[], OUT top_id uuid, OUT top_name character varying, OUT top_color character varying)
RETURNS SETOF RECORD AS $$
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
$$ LANGUAGE plpgsql;

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import {
    env,
    pipeline,
} from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Preparation for Deno runtime
env.useBrowserCache = false
env.allowLocalModels = false

const supabase = createClient(
    'https://xyzcompany.supabase.co',
    'public-anon-key'
)

// Construct pipeline outside of serve for faster warm starts
const pipe = await pipeline('feature-extraction', 'Supabase/gte-small')

// Deno Handler
serve(async (req) => {
    const { record } = await req.json()

    const text = record.title + record.description
    // Generate the embedding from the user input
    const output = await pipe(text, {
        pooling: 'mean',
        normalize: true,
    })

    // Get the embedding output
    const embedding = Array.from(output.data)

    // Store the embedding
    const { data, error } = await supabase
        .from('posts')
        .insert({ embeddings: embedding })

    // Return the embedding
    return new Response(
        { new_row: data },
        { headers: { 'Content-Type': 'application/json' } }
    )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.3";

serve(async (req) => {
  // Extract input string from JSON body
  const payload = await req.json();

  console.log(payload);

  // Initialize Supabase client
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const text = payload.record.title + " " + payload.record.description;

  // Generate the embedding from the huggingface inference api
  async function query(data: any) {
    const response = await fetch(
      "https://api-inference.huggingface.co/pipeline/feature-extraction/thenlper/gte-small",
      {
        headers: {
          Authorization: `Bearer ${Deno.env.get("HUGGINGFACE_TOKEN")}`,
        },
        method: "POST",
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    return result;
  }

  const res = await query({
    "inputs": [text],
  });

  if (res.error && res.estimated_time) {
    // Wait for model to load
    await new Promise((resolve) =>
      setTimeout(resolve, res.estimated_time * 1000)
    );
    // Retry the query
    const retryRes = await query({
      "inputs": [text],
    });

    // Update the record with the new embedding
    await supabase
      .from("posts")
      .update({ embeddings: retryRes[0] })
      .eq("id", payload.record.id);
  }

  await supabase
    .from("posts")
    .update({ embeddings: res[0] })
    .eq("id", payload.record.id);

  return new Response(null, {
    status: 200,
  });
});

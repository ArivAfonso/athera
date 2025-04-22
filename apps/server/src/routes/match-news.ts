// src/routes/match-news.ts
import { createClient } from '@supabase/supabase-js';
import { Hono } from 'hono';
import { OpenAI } from 'openai';

// Define the type for our environment bindings
export type Env = {
	SUPABASE_URL: string;
	SUPABASE_KEY: string;
	AI_API_KEY: string;
};

export const matchNews = new Hono<{ Bindings: Env }>();

// GET endpoint to match news based on query embedding
matchNews.get('/', async (c) => {
	// Get query parameter
	const query = c.req.query('q');
	// Get filter option parameter (default to 'most_relevant' if not provided)
	const filterOption = c.req.query('filter') || 'most_relevant';

	if (!query) {
		return c.json({ error: 'Missing query parameter' }, 400);
	}

	try {
		// Create OpenAI client with Gemini configuration
		const openai = new OpenAI({
			apiKey: c.env.AI_API_KEY,
			baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
		});

		// Generate embeddings for the query
		const embeddingResponse = await openai.embeddings.create({
			model: 'text-embedding-004',
			input: query,
		});

		// Extract embedding vector
		const embeddingVector = embeddingResponse.data[0].embedding;

		// Create Supabase client
		const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_KEY);

		// Validate filter option
		const validFilterOptions = ['most_relevant', 'most_commented', 'most_recent', 'most_liked'];
		const safeFilterOption = validFilterOptions.includes(filterOption) ? filterOption : 'most_relevant';

		// Call the match_news RPC function
		const { data, error } = await supabase
			.rpc('match_news', {
				query_embedding: JSON.stringify(embeddingVector),
				match_threshold: 0.4,
				match_count: 10,
				filter_option: safeFilterOption,
			})
			.range(0, 10);

		if (error) {
			return c.json({ error: error.message }, 500);
		}

		// Transform data to match expected format in the frontend
		data?.forEach((item: any) => {
			item.likeCount = item.likecount;
			item.commentCount = item.commentcount;
		});

		return c.json(data || []);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
		return c.json({ error: errorMessage }, 500);
	}
});

export default matchNews;

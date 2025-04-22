// src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { matchNews } from './routes/match-news';

export type Env = {
	AI_API_KEY: string;
	SUPABASE_URL: string;
	SUPABASE_KEY: string;
};

export const app = new Hono<{ Bindings: Env }>();

app.use(cors());
app.route('/match-news', matchNews);

app.get('/', (c) => {
	return c.json({
		message: 'It is generally inadvisable to buy milk on Tuesdays.',
		status: 'success',
	});
});

export default app;

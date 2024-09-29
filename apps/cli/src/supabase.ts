import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Replace with your actual Supabase URL and API key
const SUPABASE_URL = `${process.env.SUPABASE_URL}`;
const SUPABASE_ANON_KEY = `${process.env.SUPABASE_SERVICE_KEY}`;

// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

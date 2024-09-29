//Create an annompyous supabase-js client with ecnv varibles

import { createClient as supabaseCreateClient } from '@supabase/supabase-js'

const createClient = (): ReturnType<typeof supabaseCreateClient> => {
    return supabaseCreateClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
}

export { createClient }

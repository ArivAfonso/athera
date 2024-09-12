import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null

    if (token_hash && type) {
        const supabase = createClient(cookies())

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })
        if (!error) {
            // redirect user to specified redirect URL or root of app
            redirect('/signup/details')
        }
    }
    redirect('/signup/details')
}

// Supabase client wrapper
// Uses environment variables for URL and KEY. See .env.example for names.
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

const unavailableError = new Error('Authentication is unavailable in this deployment.')

function unavailableResult(data = null) {
    return Promise.resolve({ data, error: unavailableError })
}

function createUnavailableQuery() {
    const query = {
        select() { return query },
        eq() { return query },
        neq() { return query },
        gt() { return query },
        gte() { return query },
        lt() { return query },
        lte() { return query },
        like() { return query },
        ilike() { return query },
        in() { return query },
        order() { return query },
        limit() { return query },
        range() { return query },
        single() { return unavailableResult(null) },
        maybeSingle() { return unavailableResult(null) },
        insert() { return unavailableResult(null) },
        upsert() { return unavailableResult(null) },
        update() { return unavailableResult(null) },
        delete() { return unavailableResult(null) },
        then(resolve, reject) {
            return unavailableResult(null).then(resolve, reject)
        }
    }
    return query
}

function createOfflineSupabase() {
    return {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            getUser: async () => ({ data: { user: null }, error: null }),
            onAuthStateChange: () => ({
                data: {
                    subscription: {
                        unsubscribe() {}
                    }
                }
            }),
            signUp: () => unavailableResult(null),
            signInWithPassword: () => unavailableResult(null),
            signInWithOAuth: () => unavailableResult(null),
            signOut: async () => ({ error: null }),
            resetPasswordForEmail: () => unavailableResult(null),
            updateUser: () => unavailableResult(null)
        },
        from: () => createUnavailableQuery()
    }
}

if (!supabaseConfigured && import.meta.env.DEV) {
    console.warn('Supabase environment variables are not set. Auth features are disabled, but the toolbox remains usable.')
}

export const supabase = supabaseConfigured
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            persistSession: true,
            detectSessionInUrl: true
        }
    })
    : createOfflineSupabase()

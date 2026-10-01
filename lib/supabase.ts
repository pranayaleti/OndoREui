import { createClient } from '@supabase/supabase-js'
import config from './config'

/**
 * Shared browser Supabase client with session persistence.
 * Use this for auth (getSession, signIn, signOut) in client components.
 */
export const supabase =
  config.supabase.url && config.supabase.anonKey
    ? createClient(config.supabase.url, config.supabase.anonKey)
    : null

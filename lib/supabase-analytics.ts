/**
 * UNUSED: nothing imports this module, so do not follow older docs that pointed here. Use
 * lib/analytics.ts. It would also not work as written: supabase-js `.from('analytics.x')` does not
 * reach a non-public schema (that needs `.schema('analytics').from('x')`). Kept only until the
 * owner approves deleting it.
 */
import { createClient } from '@supabase/supabase-js'
import config from './config'

const SUPABASE_URL = config.supabase.url
const SUPABASE_ANON_KEY = config.supabase.anonKey

// Single browser-safe client instance
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    })
  : null

type SessionPayload = {
  session_id?: string
  user_id?: string
  anonymous_id?: string
  device?: string
  locale?: string
  user_agent?: string
}

type QueryPayload = {
  session_id?: string
  query_text: string
  normalized_query?: string
  language?: string
  filters?: Record<string, unknown>
  model_version?: string
  embedding_version?: string
  reranker_version?: string
  latency_ms?: number
  result_count?: number
  zero_results?: boolean
  cost_micros?: number
  request_id?: string
  impressions?: Array<{
    document_id: string
    rank: number
    score?: number
    source?: string
    published_at?: string
  }>
}

type ClickPayload = {
  query_id: string
  document_id: string
  rank?: number
  dwell_ms?: number
}

type FeedbackPayload = {
  query_id: string
  document_id?: string
  rating: -1 | 0 | 1 | 2
  comment?: string
}

type ExperimentPayload = {
  session_id: string
  experiment: string
  variant: string
}

type GuardrailPayload = {
  query_id: string
  guardrail: string
  triggered?: boolean
  details?: Record<string, unknown>
}

const requireClient = () => {
  if (!supabase) throw new Error('Supabase not configured (missing URL or anon key)')
  return supabase
}

export const analyticsSupabase = {
  async upsertSession(payload: SessionPayload) {
    const client = requireClient()
    const { data, error } = await client
      .from('analytics.search_sessions')
      .upsert(payload, { onConflict: 'session_id' })
      .select('session_id')
      .single()

    if (error) throw error
    return data.session_id
  },

  async insertQuery(payload: QueryPayload) {
    const client = requireClient()
    const { impressions = [], ...queryFields } = payload

    const { data, error } = await client
      .from('analytics.search_queries')
      .insert(queryFields)
      .select('query_id')
      .single()
    if (error) throw error

    const query_id = data.query_id as string

    if (impressions.length) {
      const { error: impressionError } = await client
        .from('analytics.search_impressions')
        .insert(
          impressions.map((imp) => ({
            query_id,
            ...imp,
          }))
        )
      if (impressionError) throw impressionError
    }

    return query_id
  },

  async insertClick(payload: ClickPayload) {
    const client = requireClient()
    const { error } = await client.from('analytics.search_clicks').insert(payload)
    if (error) throw error
  },

  async insertFeedback(payload: FeedbackPayload) {
    const client = requireClient()
    const { error } = await client.from('analytics.search_feedback').insert(payload)
    if (error) throw error
  },

  async assignExperiment(payload: ExperimentPayload) {
    const client = requireClient()
    const { error } = await client.from('analytics.search_experiments').insert(payload)
    if (error) throw error
  },

  async logGuardrail(payload: GuardrailPayload) {
    const client = requireClient()
    const { error } = await client.from('analytics.search_guardrails').insert(payload)
    if (error) throw error
  },
}

export type {
  SessionPayload,
  QueryPayload,
  ClickPayload,
  FeedbackPayload,
  ExperimentPayload,
  GuardrailPayload,
}



class SupabaseClient {
  constructor(private url: string, private key: string) {}

  private async request<T>(table: string, method: string, body?: any, params?: string): Promise<{ data: T | null; error: Error | null }> {
    const response = await fetch(`${this.url}/rest/v1/${table}${params ? `?${params}` : ''}`, {
      method,
      headers: {
        apikey: this.key,
        Authorization: `Bearer ${this.key}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    })
    if (!response.ok) {
      return { data: null, error: new Error(response.statusText) }
    }
    try {
      const data = (await response.json()) as T
      return { data, error: null }
    } catch {
      return { data: null, error: null }
    }
  }

  from(table: string) {
    return {
      insert: (values: any) => this.request(table, 'POST', values),
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            const { data, error } = await this.request<any[]>(table, 'GET', undefined, `${column}=eq.${value}&select=${columns}`)
            return { data: data && data.length > 0 ? data[0] : null, error }
          }
        })
      }),
      update: (values: any) => ({
        eq: (column: string, value: any) => this.request(table, 'PATCH', values, `${column}=eq.${value}`)
      })
    }
  }
}

export const supabase = new SupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!

  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''


const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
})

export default supabase

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
})

// Basic Supabase client used for server-side queries
// Uses service role key to allow inserts and updates
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabase = createClient(supabaseUrl, serviceRoleKey)

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

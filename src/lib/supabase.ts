// Basic Supabase client used for server-side queries
// Uses service role key to allow inserts and updates
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabase = createClient(supabaseUrl, serviceRoleKey)


import { createClient } from '@supabase/supabase-js'

const supabaseUrl = ''
const supabaseKey = ''
// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
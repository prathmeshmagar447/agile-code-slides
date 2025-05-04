
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ajwtcfatyfodparcmuyi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqd3RjZmF0eWZvZHBhcmNtdXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNDk2NjYsImV4cCI6MjA2MTkyNTY2Nn0.9ArCb8aGHKdBYuTvxoT-Nsx5XT3R_TlG40lYW_2We9c'
// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase

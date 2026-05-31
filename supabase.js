// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabaseUrl = 'https://jdlkfttryktqddgxrxog.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkbGtmdHRyeWt0cWRkZ3hyeG9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MjQxOTYsImV4cCI6MjA5NTIwMDE5Nn0.t0uekZH0TwdFzHZwLe0OnW6iPxIXEwly5z6MY46hLDE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bferxknatakjymihgsbs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmZXJ4a25hdGFranltaWhnc2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDIwNjksImV4cCI6MjA4ODM3ODA2OX0.qPm9Ei0NsezFExpKoOHsu1A322A33ZJeW4Gp5OzhtYo'
export const supabase = createClient(supabaseUrl, supabaseKey)

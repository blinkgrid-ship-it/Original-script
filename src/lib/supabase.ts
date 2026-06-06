import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xjhtkvgkkpgdtfauchlf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaHRrdmdra3BnZHRmYXVjaGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MzY3NzksImV4cCI6MjA5NjMxMjc3OX0.c2qXXhiJyvb0LOMKRx5vDi02YmBk1GGd1OOrwpben70";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
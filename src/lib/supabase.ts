import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fnqseiqrwlrnsliwsgor.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZucXNlaXFyd2xybnNsaXdzZ29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTg1NzQsImV4cCI6MjA5NjIzNDU3NH0.RKo91QOLaEGVMgr56SvcO29wHexIVKgqN-TASaEEeL4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
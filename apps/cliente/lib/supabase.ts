import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vhdpfwtcsscxiwafuxoa.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoZHBmd3Rjc3NjeGl3YWZ1eG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMjYxOTIsImV4cCI6MjA2MDkwMjE5Mn0.ts0BvaKXP9gdTIb-hKZ-f7TkODIrx03FIF36BkU5368'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
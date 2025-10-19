// Cole as suas chaves aqui
const SUPABASE_URL = 'https://tjfvbgopuruguckzvogo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqZnZiZ29wdXJ1Z3Vja3p2b2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NDI5NzQsImV4cCI6MjA3NjQxODk3NH0.TIn4LU58nAQP2QPK6CL5CxVldRzel0lXnzQWGra5KqY';

// Cria o cliente Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Exporte ou disponibilize a variável 'supabase' para o resto do seu código
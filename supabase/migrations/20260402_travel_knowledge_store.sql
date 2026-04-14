-- 1. Enable the pgvector extension to work with embeddings
create extension if not exists vector;

-- 2. Create the travel_knowledge table
create table if not exists public.travel_knowledge (
  id bigint primary key generated always as identity,
  content text not null,                -- The actual travel guide text
  metadata jsonb default '{}'::jsonb, -- Store tags, region, source_url, etc.
  embedding vector(1536)               -- 1536 is standard for OpenAI text-embedding-3-small
);

-- 3. Enable Row Level Security (RLS)
alter table public.travel_knowledge enable row level security;

-- 4. Create a policy to allow public read access (for the n8n agent)
create policy "Allow public read access"
  on public.travel_knowledge
  for select
  using (true);

-- 5. Create an HNSW index for efficient vector search
-- This significantly speeds up search once you have thousands of rows
create index on public.travel_knowledge using hnsw (embedding vector_cosine_ops);

-- 6. Add a comment for better documentation
comment on table public.travel_knowledge is 'Stores curated expert travel knowledge for the Reasoning API.';

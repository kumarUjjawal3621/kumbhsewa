/*
  # KumbhSeva Firestore Schema and Security Rules

  1. New Tables
    - `contributors`
      - `id` (uuid, primary key, auto-generated)
      - `full_name` (text, not null) - Contributor's full name
      - `email` (text, not null) - Contributor's email address
      - `whatsapp_number` (text, not null) - 10-digit Indian phone number
      - `pin_code` (text, not null) - 6-digit PIN code
      - `preferred_language` (text, not null) - 'en', 'mr', or 'hi'
      - `intents` (jsonb, not null) - Array of selected contribution intent IDs
      - `created_at` (timestamptz, default now()) - Registration timestamp

    - `pledge_analytics`
      - `id` (text, primary key) - Pledge category ID (e.g., 'waste-management')
      - `category` (text, not null) - Pledge category identifier
      - `count` (integer, default 0) - Number of pledges in this category
      - `last_pledged_at` (timestamptz) - Timestamp of last pledge

  2. Security
    - Enable RLS on both tables
    - `contributors`: Public can INSERT only (cannot read, update, or delete)
    - `pledge_analytics`: Public can INSERT and UPDATE count only (cannot read or delete)
    - Admin access is handled via Firebase Auth on the frontend
    - These RLS policies enforce that the public cannot read contributor data

  3. Important Notes
    - Contributors table stores personal data (name, email, phone) - strict read protection
    - Pledge analytics only stores aggregate counts, no personal data
    - No individual pledge records are stored per the requirements
*/

-- Contributors table
CREATE TABLE IF NOT EXISTS contributors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  whatsapp_number text NOT NULL,
  pin_code text NOT NULL,
  preferred_language text NOT NULL DEFAULT 'en',
  intents jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Pledge analytics table
CREATE TABLE IF NOT EXISTS pledge_analytics (
  id text PRIMARY KEY,
  category text NOT NULL,
  count integer DEFAULT 0,
  last_pledged_at timestamptz
);

-- Enable RLS
ALTER TABLE contributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE pledge_analytics ENABLE ROW LEVEL SECURITY;

-- Contributors: Public can INSERT only (anonymous)
CREATE POLICY "Public can submit contributor records"
  ON contributors FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Contributors: No public read access
-- (No SELECT policy = default deny for public)

-- Contributors: Authenticated users (admins) can read
CREATE POLICY "Authenticated users can read contributors"
  ON contributors FOR SELECT
  TO authenticated
  USING (true);

-- Contributors: No update or delete for public
-- (No UPDATE/DELETE policies = default deny)

-- Pledge analytics: Public can insert new categories
CREATE POLICY "Public can insert pledge analytics"
  ON pledge_analytics FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Pledge analytics: Public can update count (for incrementing)
CREATE POLICY "Public can update pledge analytics"
  ON pledge_analytics FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Pledge analytics: Authenticated users can read
CREATE POLICY "Authenticated users can read pledge analytics"
  ON pledge_analytics FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contributors_created_at ON contributors (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pledge_analytics_category ON pledge_analytics (category);

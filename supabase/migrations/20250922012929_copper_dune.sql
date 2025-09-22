/*
  # Update RLS Policies for Better User Isolation

  1. Security Updates
    - Drop existing policies and recreate with better isolation
    - Ensure all operations are properly filtered by user_id
    - Add additional security checks

  2. Policy Updates
    - SELECT: Users can only view their own transactions
    - INSERT: Users can only insert transactions with their own user_id
    - UPDATE: Users can only update their own transactions
    - DELETE: Users can only delete their own transactions
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;

-- Enable RLS (in case it's not already enabled)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create new, more secure policies
CREATE POLICY "Users can view own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add index for better performance on user_id queries
CREATE INDEX IF NOT EXISTS transactions_user_id_date_idx 
ON transactions (user_id, date DESC);

-- Ensure user_id is not nullable and has proper foreign key constraint
ALTER TABLE transactions 
ALTER COLUMN user_id SET NOT NULL;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'transactions_user_id_fkey'
  ) THEN
    ALTER TABLE transactions 
    ADD CONSTRAINT transactions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;
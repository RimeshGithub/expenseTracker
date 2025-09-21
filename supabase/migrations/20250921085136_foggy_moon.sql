/*
  # Create transactions table for expense tracker

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `amount` (decimal, not null)
      - `category` (text, not null)
      - `type` (text, not null, expense or income)
      - `date` (date, not null)
      - `notes` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `transactions` table
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount decimal(10,2) NOT NULL CHECK (amount > 0),
  category text NOT NULL,
  type text NOT NULL CHECK (type IN ('expense', 'income')),
  date date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view all transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete transactions"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (true);

-- Create an index on date for better query performance
CREATE INDEX IF NOT EXISTS transactions_date_idx ON transactions (date DESC);

-- Create an index on type for filtering
CREATE INDEX IF NOT EXISTS transactions_type_idx ON transactions (type);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
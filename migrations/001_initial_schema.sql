-- Migration: 001_initial_schema
-- Description: Initial database schema for Bonocoin
-- Created: 2024-11-21

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  telegram_id VARCHAR(50) UNIQUE NOT NULL,
  username VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone_number VARCHAR(20),
  balance DECIMAL(18, 8) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create creators table
CREATE TABLE IF NOT EXISTS creators (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE,
  channel_username VARCHAR(255) UNIQUE NOT NULL,
  handle VARCHAR(255) UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  bio TEXT,
  links JSONB DEFAULT '[]'::jsonb,
  support_link_id VARCHAR(255) UNIQUE NOT NULL,
  balance DECIMAL(18, 8) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  from_user_id BIGINT,
  to_creator_id BIGINT,
  amount DECIMAL(18, 8) NOT NULL,
  admin_fee DECIMAL(18, 8) DEFAULT 0,
  transaction_type VARCHAR(50),
  description TEXT,
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (to_creator_id) REFERENCES creators(id) ON DELETE CASCADE
);

-- Create withdrawal requests table
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id BIGSERIAL PRIMARY KEY,
  creator_id BIGINT NOT NULL,
  amount DECIMAL(18, 8) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  bank_account JSONB,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by BIGINT,
  FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create supporters table (for tracking user-creator relationships)
CREATE TABLE IF NOT EXISTS supporters (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  creator_id BIGINT NOT NULL,
  total_sent DECIMAL(18, 8) DEFAULT 0,
  supporter_name VARCHAR(255),
  first_supported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE CASCADE,
  UNIQUE(user_id, creator_id)
);

-- Create migration tracking table
CREATE TABLE IF NOT EXISTS schema_migrations (
  id BIGSERIAL PRIMARY KEY,
  migration_name VARCHAR(255) UNIQUE NOT NULL,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_creators_user_id ON creators(user_id);
CREATE INDEX IF NOT EXISTS idx_creators_support_link_id ON creators(support_link_id);
CREATE INDEX IF NOT EXISTS idx_creators_handle ON creators(handle);
CREATE INDEX IF NOT EXISTS idx_transactions_from_user ON transactions(from_user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_to_creator ON transactions(to_creator_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_creator ON withdrawal_requests(creator_id);
CREATE INDEX IF NOT EXISTS idx_supporters_user_creator ON supporters(user_id, creator_id);


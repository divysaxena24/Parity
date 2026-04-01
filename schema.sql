-- Parity Neon Direct SQL Schema
-- Execute this in the Neon SQL Console to initialize your tables

-- Enums (Types)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
        CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SubStatus') THEN
        CREATE TYPE "SubStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'DrawStatus') THEN
        CREATE TYPE "DrawStatus" AS ENUM ('OPEN', 'CLOSED', 'COMPLETED');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'DrawMode') THEN
        CREATE TYPE "DrawMode" AS ENUM ('RANDOM', 'ALGORITHMIC');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'WinStatus') THEN
        CREATE TYPE "WinStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PayoutStatus') THEN
        CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');
    END IF;
END $$;

-- Tables
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- Clerk User ID
    name TEXT,
    username TEXT,
    email TEXT UNIQUE,
    role "Role" DEFAULT 'USER',
    subscription_status "SubStatus" DEFAULT 'INACTIVE',
    active_charity_id TEXT,
    donation_percentage INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS charities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT,
    image TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scores (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    date_played TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    status "SubStatus" NOT NULL,
    plan_type TEXT,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS draws (
    id TEXT PRIMARY KEY,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    status "DrawStatus" DEFAULT 'OPEN',
    mode "DrawMode" DEFAULT 'RANDOM',
    total_pool DOUBLE PRECISION,
    draw_numbers INTEGER[],
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS participations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    draw_id TEXT NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
    score_ids TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS winner_claims (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    draw_id TEXT NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
    amount DOUBLE PRECISION NOT NULL,
    status "WinStatus" DEFAULT 'PENDING',
    payout_status "PayoutStatus" DEFAULT 'PENDING',
    proof_url TEXT,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    charity_id TEXT NOT NULL REFERENCES charities(id) ON DELETE CASCADE,
    amount DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Charities
INSERT INTO charities (id, name, slug, category, short_description, is_featured)
VALUES 
    ('c1', 'GreenFairways Foundation', 'green-fairways', 'Environment', 'Sustainable landscaping and reforestation for golf ecosystems.', true),
    ('c2', 'SwingForChange', 'swing-for-change', 'Education', 'Providing golf equipment and coaching to underprivileged youth.', false),
    ('c3', 'Fairways Healthcare', 'fairways-healthcare', 'Health', 'Supporting mental health programs through recreational golf.', false)
ON CONFLICT (slug) DO NOTHING;

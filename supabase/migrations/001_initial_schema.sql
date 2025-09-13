-- Healthcare B2B Platform Database Schema
-- Version: 1.0.0

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS bid_files CASCADE;
DROP TABLE IF EXISTS bids CASCADE;
DROP TABLE IF EXISTS project_files CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- =========================================
-- 1. PROFILES TABLE (extends Supabase Auth)
-- =========================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('buyer', 'supplier', 'both')),
  company_registration_number TEXT,
  business_areas TEXT[],
  is_verified BOOLEAN DEFAULT FALSE,
  is_demo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =========================================
-- 2. PROJECTS TABLE (Bidding Requests)
-- =========================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  region TEXT,
  budget_min DECIMAL(12, 2),
  budget_max DECIMAL(12, 2),
  budget_range TEXT,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  requirements TEXT NOT NULL,
  specifications JSONB,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed', 'awarded', 'cancelled')),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'invited')),
  auto_close BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  closed_at TIMESTAMP WITH TIME ZONE,
  awarded_at TIMESTAMP WITH TIME ZONE
);

-- =========================================
-- 3. PROJECT FILES TABLE
-- =========================================
CREATE TABLE project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =========================================
-- 4. BIDS TABLE
-- =========================================
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  price DECIMAL(12, 2) NOT NULL,
  delivery_days INTEGER NOT NULL,
  warranty_years INTEGER DEFAULT 1,
  payment_terms TEXT,
  proposal TEXT NOT NULL,
  technical_specs JSONB,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'accepted', 'rejected', 'withdrawn')),
  score DECIMAL(5, 2),
  score_breakdown JSONB,
  is_winner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  submitted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(project_id, supplier_id)
);

-- =========================================
-- 5. BID FILES TABLE
-- =========================================
CREATE TABLE bid_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =========================================
-- 6. NOTIFICATIONS TABLE
-- =========================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('new_project', 'new_bid', 'bid_accepted', 'bid_rejected', 'project_closed', 'message', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =========================================
-- 7. SCORING WEIGHTS TABLE
-- =========================================
CREATE TABLE scoring_weights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  price_weight INTEGER DEFAULT 40 CHECK (price_weight >= 0 AND price_weight <= 100),
  quality_weight INTEGER DEFAULT 30 CHECK (quality_weight >= 0 AND quality_weight <= 100),
  delivery_weight INTEGER DEFAULT 20 CHECK (delivery_weight >= 0 AND delivery_weight <= 100),
  service_weight INTEGER DEFAULT 10 CHECK (service_weight >= 0 AND service_weight <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(project_id),
  CHECK (price_weight + quality_weight + delivery_weight + service_weight = 100)
);

-- =========================================
-- INDEXES FOR PERFORMANCE
-- =========================================
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_deadline ON projects(deadline);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

CREATE INDEX idx_bids_project_id ON bids(project_id);
CREATE INDEX idx_bids_supplier_id ON bids(supplier_id);
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_bids_is_winner ON bids(is_winner);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- =========================================
-- HELPER FUNCTIONS
-- =========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Calculate bid score
CREATE OR REPLACE FUNCTION calculate_bid_score(
  p_bid_id UUID
) RETURNS DECIMAL AS $$
DECLARE
  v_score DECIMAL;
  v_weights RECORD;
  v_bid RECORD;
  v_max_price DECIMAL;
  v_min_price DECIMAL;
  v_max_delivery INTEGER;
  v_min_delivery INTEGER;
BEGIN
  -- Get bid details
  SELECT * INTO v_bid FROM bids WHERE id = p_bid_id;
  
  -- Get scoring weights
  SELECT * INTO v_weights FROM scoring_weights WHERE project_id = v_bid.project_id;
  
  -- Get min/max values for normalization
  SELECT MAX(price), MIN(price) INTO v_max_price, v_min_price 
  FROM bids WHERE project_id = v_bid.project_id AND status = 'submitted';
  
  SELECT MAX(delivery_days), MIN(delivery_days) INTO v_max_delivery, v_min_delivery
  FROM bids WHERE project_id = v_bid.project_id AND status = 'submitted';
  
  -- Calculate normalized scores
  v_score := 0;
  
  -- Price score (lower is better)
  IF v_max_price != v_min_price THEN
    v_score := v_score + ((v_max_price - v_bid.price) / (v_max_price - v_min_price)) * v_weights.price_weight;
  END IF;
  
  -- Delivery score (lower is better)
  IF v_max_delivery != v_min_delivery THEN
    v_score := v_score + ((v_max_delivery - v_bid.delivery_days) / (v_max_delivery - v_min_delivery)) * v_weights.delivery_weight;
  END IF;
  
  -- Quality score (simplified - could be based on supplier rating)
  v_score := v_score + 0.8 * v_weights.quality_weight;
  
  -- Service score (based on warranty)
  v_score := v_score + (LEAST(v_bid.warranty_years, 5) / 5.0) * v_weights.service_weight;
  
  RETURN ROUND(v_score, 2);
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- TRIGGERS
-- =========================================

-- Update timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bids_updated_at BEFORE UPDATE ON bids
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-close projects when deadline passes
CREATE OR REPLACE FUNCTION auto_close_expired_projects()
RETURNS void AS $$
BEGIN
  UPDATE projects 
  SET status = 'closed', closed_at = NOW()
  WHERE status = 'open' 
    AND deadline < NOW() 
    AND auto_close = TRUE;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_weights ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Anyone can view open projects" ON projects
  FOR SELECT USING (status IN ('open', 'closed', 'awarded'));

CREATE POLICY "Buyers can create projects" ON projects
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('buyer', 'both'))
  );

CREATE POLICY "Buyers can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Buyers can delete own draft projects" ON projects
  FOR DELETE USING (auth.uid() = user_id AND status = 'draft');

-- Bids policies
CREATE POLICY "Project owners can view all bids" ON bids
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = bids.project_id AND projects.user_id = auth.uid())
  );

CREATE POLICY "Suppliers can view own bids" ON bids
  FOR SELECT USING (supplier_id = auth.uid());

CREATE POLICY "Suppliers can create bids" ON bids
  FOR INSERT WITH CHECK (
    supplier_id = auth.uid() AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('supplier', 'both'))
  );

CREATE POLICY "Suppliers can update own bids" ON bids
  FOR UPDATE USING (supplier_id = auth.uid() AND status = 'draft');

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- =========================================
-- REALTIME SUBSCRIPTIONS
-- =========================================

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Enable realtime for bids (for project owners)
ALTER PUBLICATION supabase_realtime ADD TABLE bids;
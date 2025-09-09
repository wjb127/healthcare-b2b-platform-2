-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users table (will integrate with Supabase Auth later)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE, -- Will link to auth.users.id when auth is implemented
  email TEXT,
  company_name TEXT,
  contact_name TEXT,
  role TEXT CHECK (role IN ('buyer', 'supplier', 'both')),
  is_demo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Projects table (bidding requests)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT,
  region TEXT,
  budget_range TEXT,
  deadline DATE,
  requirements TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'awarded')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Project files table
CREATE TABLE project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  file_name TEXT,
  file_url TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- 4. Bids table
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES users(id) ON DELETE CASCADE,
  price DECIMAL(12, 2),
  delivery_days INTEGER,
  comment TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'accepted', 'rejected')),
  score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Bid files table
CREATE TABLE bid_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_id UUID REFERENCES bids(id) ON DELETE CASCADE,
  file_name TEXT,
  file_url TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- 6. Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT,
  title TEXT,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_deadline ON projects(deadline);
CREATE INDEX idx_bids_project_id ON bids(project_id);
CREATE INDEX idx_bids_supplier_id ON bids(supplier_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for projects table
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Demo mode policies (allow all operations for demo users)
CREATE POLICY "Demo users can do everything" ON users
  FOR ALL USING (is_demo = true);

CREATE POLICY "Demo users can view all projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Demo users can manage their projects" ON projects
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = projects.user_id AND users.is_demo = true
  ));

CREATE POLICY "Demo users can view all bids" ON bids
  FOR SELECT USING (true);

CREATE POLICY "Demo users can manage their bids" ON bids
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = bids.supplier_id AND users.is_demo = true
  ));

CREATE POLICY "Demo users can view all notifications" ON notifications
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = notifications.user_id AND users.is_demo = true
  ));

-- Insert sample demo users
INSERT INTO users (email, company_name, contact_name, role, is_demo) VALUES
  (NULL, '서울대학교병원', '김병원', 'buyer', true),
  (NULL, '삼성서울병원', '이의료', 'buyer', true),
  (NULL, '메디칼솔루션(주)', '박공급', 'supplier', true),
  (NULL, '헬스케어테크(주)', '최기술', 'supplier', true),
  (NULL, '바이오메드(주)', '정바이오', 'supplier', true);
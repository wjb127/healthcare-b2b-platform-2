-- ========================================
-- 헬스케어 B2B 플랫폼 데이터베이스 초기 설정
-- ========================================
-- 이 쿼리를 Supabase SQL Editor에서 실행하세요

-- 기존 테이블 삭제 (필요한 경우)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS bid_files CASCADE;
DROP TABLE IF EXISTS bids CASCADE;
DROP TABLE IF EXISTS project_files CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. Users 테이블
-- ========================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE, -- Supabase Auth 연동용 (나중에 사용)
  email TEXT,
  company_name TEXT,
  contact_name TEXT,
  role TEXT CHECK (role IN ('buyer', 'supplier', 'both')),
  is_demo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 2. Projects 테이블 (비딩 요청)
-- ========================================
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3. Project Files 테이블
-- ========================================
CREATE TABLE project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  file_name TEXT,
  file_url TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 4. Bids 테이블 (응찰)
-- ========================================
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES users(id) ON DELETE CASCADE,
  price DECIMAL(12, 2),
  delivery_days INTEGER,
  comment TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'accepted', 'rejected')),
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 5. Bid Files 테이블
-- ========================================
CREATE TABLE bid_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_id UUID REFERENCES bids(id) ON DELETE CASCADE,
  file_name TEXT,
  file_url TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 6. Notifications 테이블
-- ========================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT,
  title TEXT,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 인덱스 생성 (성능 최적화)
-- ========================================
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_deadline ON projects(deadline);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_bids_project_id ON bids(project_id);
CREATE INDEX idx_bids_supplier_id ON bids(supplier_id);
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_demo ON users(is_demo);

-- ========================================
-- updated_at 자동 업데이트 함수
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Projects 테이블에 트리거 적용
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Row Level Security (RLS) 설정
-- ========================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 데모 모드 정책
-- ========================================
-- 데모 사용자는 모든 작업 가능
CREATE POLICY "Demo users full access to users" ON users
  FOR ALL USING (is_demo = true);

CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Demo buyers can manage their projects" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = projects.user_id 
      AND users.is_demo = true
    )
  );

CREATE POLICY "Anyone can view project files" ON project_files
  FOR SELECT USING (true);

CREATE POLICY "Project owners can manage files" ON project_files
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN users u ON u.id = p.user_id
      WHERE p.id = project_files.project_id
      AND u.is_demo = true
    )
  );

CREATE POLICY "Anyone can view bids" ON bids
  FOR SELECT USING (true);

CREATE POLICY "Demo suppliers can manage their bids" ON bids
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = bids.supplier_id 
      AND users.is_demo = true
    )
  );

CREATE POLICY "Anyone can view bid files" ON bid_files
  FOR SELECT USING (true);

CREATE POLICY "Bid owners can manage files" ON bid_files
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM bids b
      JOIN users u ON u.id = b.supplier_id
      WHERE b.id = bid_files.bid_id
      AND u.is_demo = true
    )
  );

CREATE POLICY "Users can view their notifications" ON notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = notifications.user_id 
      AND users.is_demo = true
    )
  );

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their notifications" ON notifications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = notifications.user_id 
      AND users.is_demo = true
    )
  );

-- ========================================
-- 초기 데모 데이터 삽입
-- ========================================
-- 데모 사용자 생성
INSERT INTO users (email, company_name, contact_name, role, is_demo) VALUES
  (NULL, '서울대학교병원', '김병원', 'buyer', true),
  (NULL, '삼성서울병원', '이의료', 'buyer', true),
  (NULL, '메디칼솔루션(주)', '박공급', 'supplier', true),
  (NULL, '헬스케어테크(주)', '최기술', 'supplier', true),
  (NULL, '바이오메드(주)', '정바이오', 'supplier', true);

-- 샘플 프로젝트 생성 (buyer 사용자 ID를 가져와서 사용)
WITH buyer_ids AS (
  SELECT id, company_name FROM users WHERE role = 'buyer' AND is_demo = true
)
INSERT INTO projects (user_id, title, category, region, budget_range, deadline, requirements, status) 
SELECT 
  (SELECT id FROM buyer_ids WHERE company_name = '서울대학교병원'),
  'MRI 장비 구매 건',
  '의료기기',
  '서울',
  '5억-10억',
  CURRENT_DATE + INTERVAL '30 days',
  '3T MRI 장비, 설치 및 교육 포함, 5년 무상 AS 필수',
  'open'
UNION ALL
SELECT
  (SELECT id FROM buyer_ids WHERE company_name = '서울대학교병원'),
  '병원 전산 시스템 구축',
  'IT 서비스',
  '서울',
  '1억-3억',
  CURRENT_DATE + INTERVAL '45 days',
  'EMR/OCS 통합 시스템, 기존 시스템 데이터 마이그레이션 포함',
  'open'
UNION ALL
SELECT
  (SELECT id FROM buyer_ids WHERE company_name = '삼성서울병원'),
  '수술실 장비 일괄 구매',
  '의료기기',
  '서울',
  '10억-15억',
  CURRENT_DATE + INTERVAL '60 days',
  '수술실 3개 리노베이션, 최신 수술 장비 일괄 구매',
  'open';

-- 샘플 응찰 생성
WITH project_supplier AS (
  SELECT 
    p.id as project_id,
    s.id as supplier_id,
    s.company_name
  FROM projects p
  CROSS JOIN users s
  WHERE s.role = 'supplier' AND s.is_demo = true
  AND p.title = 'MRI 장비 구매 건'
  LIMIT 3
)
INSERT INTO bids (project_id, supplier_id, price, delivery_days, comment, status, score)
SELECT 
  project_id,
  supplier_id,
  CASE company_name
    WHEN '메디칼솔루션(주)' THEN 750000000
    WHEN '헬스케어테크(주)' THEN 680000000
    WHEN '바이오메드(주)' THEN 820000000
  END,
  CASE company_name
    WHEN '메디칼솔루션(주)' THEN 60
    WHEN '헬스케어테크(주)' THEN 45
    WHEN '바이오메드(주)' THEN 50
  END,
  CASE company_name
    WHEN '메디칼솔루션(주)' THEN 'GE Healthcare 최신 3T MRI, 설치 및 교육 포함, 5년 무상 AS 제공'
    WHEN '헬스케어테크(주)' THEN 'Siemens Healthineers MAGNETOM Vida, 빠른 설치 가능, 전문 교육팀 보유'
    WHEN '바이오메드(주)' THEN 'Philips Ingenia Elition 3.0T, 최고 사양, 10년 장기 서비스 계약 가능'
  END,
  'submitted',
  CASE company_name
    WHEN '메디칼솔루션(주)' THEN 85
    WHEN '헬스케어테크(주)' THEN 92
    WHEN '바이오메드(주)' THEN 78
  END
FROM project_supplier;

-- ========================================
-- 데이터 정리 함수 (24시간마다 실행)
-- ========================================
CREATE OR REPLACE FUNCTION clean_demo_data()
RETURNS void AS $$
BEGIN
  -- 24시간 이상 된 데모 데이터 삭제
  DELETE FROM users 
  WHERE is_demo = true 
  AND created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 완료 메시지
-- ========================================
-- 설정이 완료되었습니다!
-- 다음 단계:
-- 1. .env.local 파일에 Supabase URL과 ANON KEY를 입력하세요
-- 2. npm run dev로 개발 서버를 실행하세요
-- 3. http://localhost:3000/demo 에서 데모를 시작하세요
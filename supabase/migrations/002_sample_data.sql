-- Sample data for Healthcare B2B Platform
-- This script populates the database with realistic sample data

-- Insert test users (buyers and suppliers)
INSERT INTO users (email, auth_id, role, company_name, contact_name, phone, is_demo, is_verified, created_at) VALUES
-- Buyers (Hospitals)
('buyer1@snu.ac.kr', 'auth_buyer_1', 'buyer', '서울대학교병원', '김병원', '02-2072-2114', false, true, NOW() - INTERVAL '3 months'),
('buyer2@samsung.com', 'auth_buyer_2', 'buyer', '삼성서울병원', '이의료', '02-3410-2114', false, true, NOW() - INTERVAL '2 months'),
('buyer3@yuhs.ac', 'auth_buyer_3', 'buyer', '연세세브란스병원', '박건강', '02-2228-1000', false, true, NOW() - INTERVAL '6 months'),
('buyer4@amc.seoul.kr', 'auth_buyer_4', 'buyer', '서울아산병원', '최진료', '02-3010-3114', false, true, NOW() - INTERVAL '4 months'),
('buyer5@catholic.ac.kr', 'auth_buyer_5', 'buyer', '가톨릭대학교병원', '정의학', '02-2258-5000', false, true, NOW() - INTERVAL '5 months'),

-- Suppliers (Medical Equipment Companies)
('supplier1@medtech.kr', 'auth_supplier_1', 'supplier', '메디칼솔루션(주)', '강기술', '02-555-1234', false, true, NOW() - INTERVAL '7 months'),
('supplier2@biomedical.co.kr', 'auth_supplier_2', 'supplier', '바이오메디칼(주)', '윤장비', '02-556-5678', false, true, NOW() - INTERVAL '8 months'),
('supplier3@healthtech.kr', 'auth_supplier_3', 'supplier', '헬스테크코리아', '조의료', '02-557-9012', false, true, NOW() - INTERVAL '4 months'),
('supplier4@diagnostic.kr', 'auth_supplier_4', 'supplier', '진단기기전문(주)', '장진단', '02-558-3456', false, true, NOW() - INTERVAL '6 months'),
('supplier5@surgical.co.kr', 'auth_supplier_5', 'supplier', '수술장비코리아', '신수술', '02-559-7890', false, true, NOW() - INTERVAL '9 months'),

-- Test accounts for demonstration
('buyer@demo.com', 'auth_demo_buyer', 'buyer', '데모병원', '테스트구매자', '02-1111-1111', true, true, NOW()),
('supplier@demo.com', 'auth_demo_supplier', 'supplier', '데모공급사', '테스트공급자', '02-2222-2222', true, true, NOW());

-- Insert projects (medical equipment procurement requests)
INSERT INTO projects (title, category, budget_range, deadline, status, requirements, region, user_id) VALUES
-- Active projects
('3T MRI 장비 도입', 'medical_equipment', '50억원 이상', NOW() + INTERVAL '45 days', 'open', 
 '최신 3T MRI 장비를 도입하려고 합니다. 설치 공간은 준비되어 있으며, 기술 지원 및 5년 유지보수 계약을 포함해주세요. 
 필수 요구사항:
 - 70cm 이상 보어 직경
 - Tim 4G 이상 기술
 - 심장 영상 패키지 포함
 - AI 기반 영상 재구성 기능', 
 '서울', (SELECT id FROM users WHERE email = 'buyer1@snu.ac.kr')),

('CT 스캐너 교체', 'medical_equipment', '30-50억원', NOW() + INTERVAL '30 days', 'open',
 '기존 64채널 CT를 256채널 이상으로 교체 예정입니다. 
 요구사항:
 - 256 슬라이스 이상
 - 듀얼 에너지 기능
 - AI 노이즈 감소 기술
 - 연간 유지보수 포함',
 '서울', (SELECT id FROM users WHERE email = 'buyer2@samsung.com')),

('수술 로봇 시스템 구매', 'robotics', '80억원 이상', NOW() + INTERVAL '60 days', 'open',
 '다빈치 Xi 또는 동급 이상의 수술 로봇 시스템 도입
 필수 사항:
 - 4개 이상의 로봇 암
 - 3D HD 비전 시스템
 - 듀얼 콘솔 옵션
 - 교육 프로그램 포함
 - 5년 서비스 계약',
 '서울', (SELECT id FROM users WHERE email = 'buyer3@yuhs.ac')),

('병원 정보 시스템(HIS) 구축', 'software', '20-30억원', NOW() + INTERVAL '90 days', 'open',
 'EMR/PACS/OCS 통합 시스템 구축 프로젝트
 요구사항:
 - 클라우드 기반 아키텍처
 - 모바일 지원
 - AI 진단 보조 기능
 - 빅데이터 분석 플랫폼
 - 기존 시스템 데이터 마이그레이션',
 '경기도', (SELECT id FROM users WHERE email = 'buyer4@amc.seoul.kr')),

('초음파 장비 대량 구매', 'medical_equipment', '10-20억원', NOW() + INTERVAL '21 days', 'open',
 '각 진료과별 초음파 장비 10대 구매
 - 심장초음파 3대
 - 복부초음파 4대
 - 포터블 초음파 3대
 각 장비별 프로브 풀세트 및 3년 워런티',
 '인천', (SELECT id FROM users WHERE email = 'buyer5@catholic.ac.kr')),

('디지털 X-ray 시스템', 'medical_equipment', '5-10억원', NOW() + INTERVAL '15 days', 'open',
 'DR 시스템 2세트 구매
 - Ceiling mounted type
 - 무선 디텍터 포함
 - PACS 연동 가능
 - AI 판독 보조 소프트웨어',
 '서울', (SELECT id FROM users WHERE email = 'buyer1@snu.ac.kr')),

-- Closed projects
('인공호흡기 긴급 구매', 'medical_equipment', '5-10억원', NOW() - INTERVAL '10 days', 'closed',
 '코로나19 대응 인공호흡기 20대 긴급 구매 완료',
 '서울', (SELECT id FROM users WHERE email = 'buyer2@samsung.com')),

('PACS 시스템 업그레이드', 'software', '5-10억원', NOW() - INTERVAL '30 days', 'awarded',
 'PACS 시스템 3.0 업그레이드 완료',
 '경기도', (SELECT id FROM users WHERE email = 'buyer3@yuhs.ac'));

-- Insert bids for active projects
INSERT INTO bids (project_id, supplier_id, price, technical_score, delivery_time, warranty_period, description, status, attachments, created_at) VALUES
-- Bids for MRI project
((SELECT id FROM projects WHERE title = '3T MRI 장비 도입'), 
 (SELECT id FROM users WHERE email = 'supplier1@medtech.kr'),
 5200000000, 95, 60, 60, 
 'Siemens MAGNETOM Vida 3T MRI 제안
 - 70cm 보어 직경
 - BioMatrix 기술로 환자 적응형 스캔
 - Turbo Suite로 검사 시간 50% 단축
 - 5년 풀 서비스 계약 포함',
 'submitted', '["proposal_mri_siemens.pdf", "specs_vida.pdf"]', NOW() - INTERVAL '5 days'),

((SELECT id FROM projects WHERE title = '3T MRI 장비 도입'),
 (SELECT id FROM users WHERE email = 'supplier2@biomedical.co.kr'),
 4800000000, 92, 45, 60,
 'GE SIGNA Premier 3T MRI 제안
 - 70cm Wide Bore
 - AIR Technology 코일
 - HyperSense 기술로 가속화
 - 5년 유지보수 포함',
 'submitted', '["proposal_mri_ge.pdf", "reference_list.pdf"]', NOW() - INTERVAL '3 days'),

-- Bids for CT Scanner project
((SELECT id FROM projects WHERE title = 'CT 스캐너 교체'),
 (SELECT id FROM users WHERE email = 'supplier3@healthtech.kr'),
 3500000000, 94, 30, 36,
 'Canon Aquilion ONE PRISM Edition 제안
 - 320 슬라이스
 - FIRST AI 재구성
 - 듀얼 에너지 스펙트럴 이미징
 - 3년 서비스 계약',
 'submitted', '["proposal_ct_canon.pdf", "clinical_cases.pdf"]', NOW() - INTERVAL '7 days'),

((SELECT id FROM projects WHERE title = 'CT 스캐너 교체'),
 (SELECT id FROM users WHERE email = 'supplier4@diagnostic.kr'),
 3800000000, 96, 35, 48,
 'Philips IQon Spectral CT 제안
 - 256 슬라이스
 - 스펙트럴 디텍터 기술
 - IMR 반복재구성
 - 4년 플래티넘 서비스',
 'submitted', '["proposal_ct_philips.pdf", "warranty_terms.pdf"]', NOW() - INTERVAL '4 days'),

-- Bids for Surgical Robot project
((SELECT id FROM projects WHERE title = '수술 로봇 시스템 구매'),
 (SELECT id FROM users WHERE email = 'supplier5@surgical.co.kr'),
 8500000000, 98, 90, 60,
 'Intuitive da Vinci Xi 시스템
 - 최신 4세대 로봇 수술 시스템
 - 4개의 로봇 암
 - Firefly 형광 영상 시스템
 - 듀얼 콘솔 포함
 - 종합 교육 프로그램 (의사 10명, 간호사 20명)',
 'submitted', '["davinci_proposal.pdf", "training_program.pdf", "service_agreement.pdf"]', NOW() - INTERVAL '2 days'),

-- Bids for HIS project
((SELECT id FROM projects WHERE title = '병원 정보 시스템(HIS) 구축'),
 (SELECT id FROM users WHERE email = 'supplier1@medtech.kr'),
 2500000000, 90, 180, 36,
 '통합 의료정보시스템 구축
 - 마이크로서비스 아키텍처
 - Kubernetes 기반 컨테이너 운영
 - React Native 모바일 앱
 - TensorFlow 기반 AI 진단 보조
 - 3년 유지보수 및 운영 지원',
 'submitted', '["his_proposal.pdf", "architecture.pdf", "timeline.xlsx"]', NOW() - INTERVAL '10 days'),

-- Bids for Ultrasound project
((SELECT id FROM projects WHERE title = '초음파 장비 대량 구매'),
 (SELECT id FROM users WHERE email = 'supplier2@biomedical.co.kr'),
 1200000000, 93, 21, 36,
 'Samsung HERA W10 패키지 제안
 - 프리미엄 심장초음파 3대
 - 고급 복부초음파 4대
 - 포터블 HM70A 3대
 - 전 장비 프로브 풀세트
 - 3년 워런티 및 교육 포함',
 'submitted', '["ultrasound_package.pdf", "training_schedule.pdf"]', NOW() - INTERVAL '1 day');

-- Insert notifications
INSERT INTO notifications (user_id, title, message, type, related_id, read) VALUES
-- Notifications for buyers
((SELECT id FROM users WHERE email = 'buyer1@snu.ac.kr'),
 '새로운 입찰이 등록되었습니다',
 'MRI 장비 도입 프로젝트에 2개의 새로운 입찰이 있습니다.',
 'bid_received',
 (SELECT id FROM projects WHERE title = '3T MRI 장비 도입'),
 false),

((SELECT id FROM users WHERE email = 'buyer2@samsung.com'),
 '입찰 마감 임박',
 'CT 스캐너 교체 프로젝트 입찰이 3일 후 마감됩니다.',
 'deadline_reminder',
 (SELECT id FROM projects WHERE title = 'CT 스캐너 교체'),
 false),

-- Notifications for suppliers
((SELECT id FROM users WHERE email = 'supplier1@medtech.kr'),
 '입찰이 접수되었습니다',
 'MRI 장비 도입 프로젝트 입찰이 성공적으로 접수되었습니다.',
 'bid_submitted',
 (SELECT id FROM projects WHERE title = '3T MRI 장비 도입'),
 true),

((SELECT id FROM users WHERE email = 'supplier5@surgical.co.kr'),
 '새로운 프로젝트가 등록되었습니다',
 '수술 로봇 시스템 구매 프로젝트가 등록되었습니다.',
 'new_project',
 (SELECT id FROM projects WHERE title = '수술 로봇 시스템 구매'),
 false);

-- Update project bid counts
UPDATE projects p
SET bids_count = (
  SELECT COUNT(*) 
  FROM bids b 
  WHERE b.project_id = p.id
);

-- Create some demo data that will always be available
INSERT INTO projects (title, category, budget_range, deadline, status, requirements, region, user_id) VALUES
('데모 MRI 장비 구매', 'medical_equipment', '30억원 이상', NOW() + INTERVAL '30 days', 'open',
 '[데모 프로젝트] 최신 MRI 장비 도입을 위한 입찰입니다. 자유롭게 테스트해보세요.',
 '서울', (SELECT id FROM users WHERE email = 'buyer@demo.com')),

('데모 의료 소프트웨어 개발', 'software', '5-10억원', NOW() + INTERVAL '45 days', 'open',
 '[데모 프로젝트] 병원 관리 시스템 개발 프로젝트입니다. 테스트용 프로젝트입니다.',
 '경기도', (SELECT id FROM users WHERE email = 'buyer@demo.com'));

-- Add sample bid for demo
INSERT INTO bids (project_id, supplier_id, price, technical_score, delivery_time, warranty_period, description, status) VALUES
((SELECT id FROM projects WHERE title = '데모 MRI 장비 구매'),
 (SELECT id FROM users WHERE email = 'supplier@demo.com'),
 3500000000, 95, 30, 36,
 '[데모 입찰] 테스트용 입찰입니다. 자유롭게 수정하고 테스트해보세요.',
 'submitted');
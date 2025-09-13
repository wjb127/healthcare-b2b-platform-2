-- Fixed Sample data for existing table structure
-- Run this after your existing tables are created

-- Insert test users (buyers and suppliers)
INSERT INTO users (email, auth_id, role, company_name, contact_name, created_at) VALUES
-- Buyers (Hospitals)
('buyer1@hospital.kr', 'auth_buyer_1', 'buyer', 'Seoul National Hospital', 'Kim Manager', NOW() - INTERVAL '3 months'),
('buyer2@samsung.kr', 'auth_buyer_2', 'buyer', 'Samsung Medical Center', 'Lee Director', NOW() - INTERVAL '2 months'),
('buyer3@yonsei.kr', 'auth_buyer_3', 'buyer', 'Yonsei Severance', 'Park Chief', NOW() - INTERVAL '6 months'),

-- Suppliers (Medical Equipment Companies)
('supplier1@medtech.kr', 'auth_supplier_1', 'supplier', 'MedTech Solutions', 'Kang Sales', NOW() - INTERVAL '7 months'),
('supplier2@biomedical.kr', 'auth_supplier_2', 'supplier', 'BioMedical Corp', 'Yoon Tech', NOW() - INTERVAL '8 months'),
('supplier3@healthtech.kr', 'auth_supplier_3', 'supplier', 'HealthTech Korea', 'Cho Manager', NOW() - INTERVAL '4 months'),

-- Test accounts for easy login
('buyer@demo.com', 'auth_demo_buyer', 'buyer', 'Demo Hospital', 'Test Buyer', NOW()),
('supplier@demo.com', 'auth_demo_supplier', 'supplier', 'Demo Supplier', 'Test Supplier', NOW());

-- Insert sample projects
INSERT INTO projects (title, category, budget_range, deadline, status, requirements, region, user_id) VALUES
-- Active projects
('MRI Equipment Purchase', 'medical_equipment', 'Over 5B KRW', NOW() + INTERVAL '45 days', 'open', 
 'Looking for latest 3T MRI system with service contract', 
 'Seoul', (SELECT id FROM users WHERE email = 'buyer1@hospital.kr')),

('CT Scanner Replacement', 'medical_equipment', '3-5B KRW', NOW() + INTERVAL '30 days', 'open',
 'Need to replace existing 64-channel CT with 256+ channels',
 'Seoul', (SELECT id FROM users WHERE email = 'buyer2@samsung.kr')),

('Hospital Information System', 'software', '2-3B KRW', NOW() + INTERVAL '90 days', 'open',
 'EMR/PACS/OCS integrated system implementation',
 'Gyeonggi', (SELECT id FROM users WHERE email = 'buyer3@yonsei.kr')),

-- Demo projects
('Demo MRI Purchase', 'medical_equipment', 'Over 3B KRW', NOW() + INTERVAL '30 days', 'open',
 '[DEMO PROJECT] Test project for MRI equipment bidding',
 'Seoul', (SELECT id FROM users WHERE email = 'buyer@demo.com'));

-- Insert sample bids
INSERT INTO bids (project_id, supplier_id, price, technical_score, delivery_time, warranty_period, description, status) VALUES
-- Bid for MRI project
((SELECT id FROM projects WHERE title = 'MRI Equipment Purchase'), 
 (SELECT id FROM users WHERE email = 'supplier1@medtech.kr'),
 5200000000, 95, 60, 60, 
 'Siemens MAGNETOM Vida 3T MRI with 5-year service contract',
 'submitted'),

((SELECT id FROM projects WHERE title = 'MRI Equipment Purchase'),
 (SELECT id FROM users WHERE email = 'supplier2@biomedical.kr'),
 4800000000, 92, 45, 60,
 'GE SIGNA Premier 3T MRI with AIR Technology',
 'submitted'),

-- Bid for CT Scanner project
((SELECT id FROM projects WHERE title = 'CT Scanner Replacement'),
 (SELECT id FROM users WHERE email = 'supplier3@healthtech.kr'),
 3500000000, 94, 30, 36,
 'Canon Aquilion ONE PRISM Edition with AI reconstruction',
 'submitted'),

-- Demo bid
((SELECT id FROM projects WHERE title = 'Demo MRI Purchase'),
 (SELECT id FROM users WHERE email = 'supplier@demo.com'),
 3500000000, 95, 30, 36,
 '[DEMO BID] Test bid for demo project',
 'submitted');

-- Update project bid counts
UPDATE projects p
SET bids_count = (
  SELECT COUNT(*) 
  FROM bids b 
  WHERE b.project_id = p.id
);
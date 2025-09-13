-- Simple sample data for testing
-- Works with existing table structure

-- Insert test users (without auth_id - will be set when actual auth happens)
INSERT INTO users (email, role, company_name, contact_name) VALUES
-- Buyers
('buyer1@hospital.kr', 'buyer', 'Seoul National Hospital', 'Kim Manager'),
('buyer2@samsung.kr', 'buyer', 'Samsung Medical Center', 'Lee Director'),
('buyer3@yonsei.kr', 'buyer', 'Yonsei Severance', 'Park Chief'),

-- Suppliers
('supplier1@medtech.kr', 'supplier', 'MedTech Solutions', 'Kang Sales'),
('supplier2@biomedical.kr', 'supplier', 'BioMedical Corp', 'Yoon Tech'),
('supplier3@healthtech.kr', 'supplier', 'HealthTech Korea', 'Cho Manager'),

-- Test accounts
('buyer@demo.com', 'buyer', 'Demo Hospital', 'Test Buyer'),
('supplier@demo.com', 'supplier', 'Demo Supplier', 'Test Supplier');

-- Insert sample projects
INSERT INTO projects (title, category, budget_range, deadline, status, requirements, user_id) VALUES
('MRI Equipment Purchase', 'medical_equipment', 'Over 5B KRW', NOW() + INTERVAL '45 days', 'open', 
 'Looking for latest 3T MRI system with service contract', 
 (SELECT id FROM users WHERE email = 'buyer1@hospital.kr')),

('CT Scanner Replacement', 'medical_equipment', '3-5B KRW', NOW() + INTERVAL '30 days', 'open',
 'Need to replace existing 64-channel CT with 256+ channels',
 (SELECT id FROM users WHERE email = 'buyer2@samsung.kr')),

('Hospital Information System', 'software', '2-3B KRW', NOW() + INTERVAL '90 days', 'open',
 'EMR/PACS/OCS integrated system implementation',
 (SELECT id FROM users WHERE email = 'buyer3@yonsei.kr')),

('Demo MRI Purchase', 'medical_equipment', 'Over 3B KRW', NOW() + INTERVAL '30 days', 'open',
 '[DEMO PROJECT] Test project for MRI equipment bidding',
 (SELECT id FROM users WHERE email = 'buyer@demo.com'));

-- Insert sample bids
INSERT INTO bids (project_id, supplier_id, price, description, status) VALUES
((SELECT id FROM projects WHERE title = 'MRI Equipment Purchase'), 
 (SELECT id FROM users WHERE email = 'supplier1@medtech.kr'),
 5200000000, 
 'Siemens MAGNETOM Vida 3T MRI with 5-year service contract',
 'submitted'),

((SELECT id FROM projects WHERE title = 'MRI Equipment Purchase'),
 (SELECT id FROM users WHERE email = 'supplier2@biomedical.kr'),
 4800000000,
 'GE SIGNA Premier 3T MRI with AIR Technology',
 'submitted'),

((SELECT id FROM projects WHERE title = 'CT Scanner Replacement'),
 (SELECT id FROM users WHERE email = 'supplier3@healthtech.kr'),
 3500000000,
 'Canon Aquilion ONE PRISM Edition with AI reconstruction',
 'submitted'),

((SELECT id FROM projects WHERE title = 'Demo MRI Purchase'),
 (SELECT id FROM users WHERE email = 'supplier@demo.com'),
 3500000000,
 '[DEMO BID] Test bid for demo project',
 'submitted');
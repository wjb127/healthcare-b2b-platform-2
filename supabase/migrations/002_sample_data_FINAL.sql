-- FINAL VERSION - Works with your exact table structure
-- Super simple sample data

-- 1. Insert users (email, role, company_name, contact_name only)
INSERT INTO users (email, role, company_name, contact_name) VALUES
('buyer@test.com', 'buyer', 'Test Hospital', 'Kim Buyer'),
('supplier@test.com', 'supplier', 'Test Medical', 'Lee Supplier');

-- 2. Insert projects (minimal fields)
INSERT INTO projects (title, category, budget_range, deadline, status, user_id) VALUES
('MRI Purchase', 'equipment', '1-5B', CURRENT_DATE + 30, 'open', 
 (SELECT id FROM users WHERE email = 'buyer@test.com'));

-- 3. Insert bids (using correct column: comment not description)
INSERT INTO bids (project_id, supplier_id, price, comment, status) VALUES
((SELECT id FROM projects WHERE title = 'MRI Purchase'),
 (SELECT id FROM users WHERE email = 'supplier@test.com'),
 2000000000,
 'Good price for MRI',
 'submitted');

-- That's it! Minimal working data.
-- Realistic seed data for JANI AI organization
-- This file runs AFTER Prisma schema is pushed (tables exist)
-- Run with: pnpm db:seed:local
--
-- Login credentials for testing:
-- Email: reggie@jani.ai (Admin/Owner)
-- Email: sarah@jani.ai (Team Member)

-- Clean existing test data (for idempotency)
TRUNCATE TABLE "ReportTrackingEvents", "Reports", "Inventory", "Warehouses", "Harvests", "Farmers", "Equipments", "SentEmail", "ProjectInvite", "Customer", "ProjectUsers", "Project", "Session", "Account", "User", "VerificationToken" CASCADE;

-- Insert users for JANI AI organization
INSERT INTO "User" (id, name, email, "emailVerified", image, source, "defaultWorkspace", "createdAt", "updatedAt")
VALUES
  ('reggie-user', 'Reggie Joseph', 'reggie@jani.ai', NOW(), NULL, 'local', 'jani-ai-1', NOW(), NOW()),
  ('sarah-user', 'Sarah Kimani', 'sarah@jani.ai', NOW(), NULL, 'local', 'jani-ai-1', NOW(), NOW());

-- Insert test project / organization
INSERT INTO "Project" (id, name, slug, logo, plan, "stripeId", "billingCycleStart", "stripeConnectId", "inviteCode", "reportLimit", "farmersLimit", "harvestsLimit", "createdAt", "updatedAt", "usageLastChecked")
VALUES
  ('jani-ai-1', 'JANI AI', 'jani-ai', NULL, 'free', NULL, 1, NULL, 'JANI123', 1000, 5000, 2000, NOW(), NOW(), NOW());

-- Insert project users (Reggie as owner, Sarah as member)
INSERT INTO "ProjectUsers" (id, role, "createdAt", "updatedAt", "userId", "projectId")
VALUES
  ('jani-pu-1', 'owner', NOW(), NOW(), 'reggie-user', 'jani-ai-1'),
  ('jani-pu-2', 'member', NOW(), NOW(), 'sarah-user', 'jani-ai-1');

-- Insert realistic Kenyan farmers in JANI AI network
INSERT INTO "Farmers" (id, "fullName", "phoneNumber", "farmSize", province, country, crops, "quantityCanSupply", project_id, "userId")
VALUES
  ('farmer-001', 'Samuel Mwangi Kariuki', '+254722334455', 12, 'Kiambu', 'Kenya', 'Coffee,Avocado', 2500, 'jani-ai-1', 'reggie-user'),
  ('farmer-002', 'Amina Hassan Mohamed', '+254733445566', 8, 'Mombasa', 'Kenya', 'Tomatoes,Peppers', 1800, 'jani-ai-1', 'reggie-user'),
  ('farmer-003', 'Peter Njoroge Kamau', '+254744556677', 25, 'Nyeri', 'Kenya', 'Tea', 5000, 'jani-ai-1', 'reggie-user'),
  ('farmerharvest records for JANI AI farmers
INSERT INTO "Harvests" (id, date, name, crop, size, "inputsUsed", unit, "farmersId", project_id, "userId")
VALUES
  ('harvest-001', NOW() - INTERVAL '45 days', 'Coffee Cherry Harvest 2024', 'Coffee', 450, 'Organic fertilizer, Mulch', 'kg', 'farmer-001', 'jani-ai-1', 'reggie-user'),
  ('harvest-002', NOW() - INTERVAL '12 days', 'Premium Tomato Batch', 'Tomatoes', 280, 'Drip irrigation, NPK fertilizer', 'kg', 'farmer-002', 'jani-ai-1', 'reggie-user'),
  ('harvest-003', NOW() - INTERVAL '60 days', 'Tea Flush - First Picking', 'Tea', 820, 'Pruning, Manual weeding', 'kg', 'farmer-003', 'jani-ai-1', 'reggie-user'),
  ('harvesJANI AI warehouses
INSERT INTO "Warehouses" (id, name, description, "maxCapacity", unit, project_id)
VALUES
  ('warehouse-nairobi', 'Nairobi Central Hub', 'Main distribution center - temperature controlled', 75000, 'kg', 'jani-ai-1'),
  ('warehouse-mombasa', 'Mombasa Coastal Depot', 'Coastal region storage and export facility', 4um inoculant, Minimal tillage', 'kg', 'farmer-007', 'jani-ai-1', 'sarah-user'),
  ('harvest-008', NOW() - INTERVAL '7 days', 'Sorghum Grain', 'Sorghum', 180, 'Drought-resistant variety', 'kg', 'farmer-008'reggie-user');

-- Insert sample harvests for those farmers
INSERT INTO "Harvests" (id, date, name, crop, size, "inputsUsed", unit, "farmersId", project_id, "userId")
VALUES
  ('jani-harvest-1', NOW() - INTERVAL '7 days', 'Maize Harvest Q1', 'Maize', 150, 'Fertilizer, Seeds', 'kg', 'jani-farmer-1', 'jani-ai-1', 'reggie-user'),
  ('jani-harvest-2',tracking for both warehouses
INSERT INTO "Inventory" (id, name, "inventoryType", "inventoryUnit", description, "estimatedValuePerUnit", "warehousesId")
VALUES
  ('inv-001', 'Arabica Coffee Beans (AA Grade)', 'Processed Crops', 'kg', 'Premium sun-dried Arabica coffee beans', '850', 'warehouse-nairobi'),
  ('inv-002', 'Cherry Tomatoes (Export Grade)', 'Fresh Produce', 'kg', 'Grade A cherry tomatoes for European market', '320', 'warehouse-mombasa'),
  ('inv-003', 'CTC Tea (Premium)', 'Processed Crops', 'kg', 'Crush-Tear-Curl black tea', '680', 'warehouse-nairobi'),
  ('inv-004', 'Yellow Maize (Non-GMO)', 'Grains', 'kg', 'Food-grade maize for milling', '45', 'warehouse-nairobi'),
  ('inv-005', 'Macadamia Nuts (In-Shell)', 'Nuts', 'kg', 'Premium grade macadamia for processing', '1200', 'warehouse-nairobi'),
  ('inv-006', 'NPK Fertilizer (17:17:17)', 'Agricultural Inputs', 'kg', 'Balanced NPK fertilizer for general crops', '85', 'warehouse-nairobi'),
  ('inv-007', 'Avocado (Hass)', 'Fresh Produce', 'kg', 'Export-quality Hass avocados', '280', 'warehouse-mombasa
  ('jani-warehouse-1', 'JANI AI Main Storage', 'Primary storage facility for JANI AI', 50000, 'kg', 'jani-ai-1');

-- Insert iraceability reports for selected harvests
INSERT INTO "Reports" (id, name, "dateCreated", "finishedTracking", "harvestsId", project_id, "userId")
VALUES
  ('report-001', 'Coffee Export Batch KEN2024-C045', NOW() - INTERVAL '40 days', true, 'harvest-001', 'jani-ai-1', 'reggie-user'),
  ('report-002', 'Tomato EU Shipment TOM-0112', NOW() - INTERVAL '10 days', false, 'harvest-002', 'jani-ai-1', 'reggie-user'),
  ('report-003', 'Tea Auction Lot T-882', NOW() - INTERVAL '55 days', true, 'harvest-003', 'jani-ai-1', 'reggie-user'),
  ('report-004', 'Macadamia Export MAC-024', NOW() - INTERVAL '25 days', false, 'harvest-006', 'jani-ai-1', 'sarah-user');

-- Insert detailed tracking events for traceability
INSERT INTO "ReportTrackingEvents" (id, "eventName", "dateCreated", description, "reportId", project_id)
VALUES
  -- Coffee export tracking (completed)
  (Insert equipment records
INSERT INTO "Equipments" (id, name, "equipmentType", "serialNumber", description, "purchaseDate", "lastMaintenanceDate", project_id)
VALUES
  ('equip-001', 'John Deere 5075E Tractor', 'Tractor', 'JD-KE-2023-5075', '75HP utility tractor for field operations', NOW() - INTERVAL '18 months', NOW() - INTERVAL '3 months', 'jani-ai-1'),
  ('equip-002', 'Coffee Pulping Machine', 'Processing Equipment', 'CPM-450-2022', 'Wet mill pulper - 500kg/hour capacity', NOW() - INTERVAL '24 months', NOW() - INTERVAL '6 months', 'jani-ai-1'),
  ('equip-003', 'Drip Irrigation System', 'Irrigation', 'DIS-HAG-2024', '5-hectare drip system with fertigation unit', NOW() - INTERVAL '8 months', NOW() - INTERVAL '1 month', 'jani-ai-1'),
  ('equip-004', 'Solar Cold Room (20 tons)', 'Storage', 'SCR-20T-001', 'Solar-powered cold storage for fresh produce', NOW() - INTERVAL '12 months', NOW() - INTERVAL '2 months,
  ('event-022', 'Size Grading', NOW() - INTERVAL '27 days', 'Sorted into Style 0 (largest premium nuts)', 'report-004
-- Insert test report tracking events
INSERT INTO "ReportTrackingEvents" (id, "eventName", "dateCreated", description, "reportId", project_id)
VALUES
  ('jani-event-1', 'Harvest Collected', NOW() - INTERVAL '5 days', 'Initial harvest collection', 'jani-report-1', 'jani-ai-1'),
  ('jani-event-2', 'Quality Check', NOW() - INTERVAL '4 days', 'Passed quality inspection', 'jani-report-1', 'jani-ai-1'),
  ('jani-event-3', 'Storage', NOW() - INTERVAL '3 days', 'Stored in warehouse', 'jani-report-1', 'jani-ai-1');

-- Additional realistic sample data for JANI AI
INSERT INTO "Farmers" (id, "fullName", "phoneNumber", "farmSize", province, country, crops, "quantityCanSupply", project_id, "userId")
VALUES
  ('jani-farmer-3', 'Peter Njoroge', '+254700000103', 42, 'Kiambu', 'Kenya', 'Coffee', 800, 'jani-ai-1', 'reggie-user'),
  ('jani-farmer-4', 'Grace Wanjiru', '+254700000104', 25, 'Nakuru', 'Kenya', 'Onions,Tomatoes', 400, 'jani-ai-1', 'reggie-user'),
  ('jani-farmer-5', 'Michael Ouma', '+254700000105', 80, 'Kisumu', 'Kenya', 'Rice,Maize', 2000, 'jani-ai-1', 'reggie-user');

INSERT INTO "Harvests" (id, date, name, crop, size, "inputsUsed", unit, "farmersId", project_id, "userId")
VALUES
  ('jani-harvest-3', NOW() - INTERVAL '14 days', 'Coffee Collection', 'Coffee', 400, 'Organic Fertilizer', 'kg', 'jani-farmer-3', 'jani-ai-1', 'reggie-user'),
  ('jani-harvest-4', NOW() - INTERVAL '10 days', 'Onion Bulbs', 'Onions', 120, 'Pesticides', 'kg', 'jani-farmer-4', 'jani-ai-1', 'reggie-user'),
  ('jani-harvest-5', NOW() - INTERVAL '30 days', 'Irrigated Rice', 'Rice', 1800, 'Water,Fertilizer', 'kg', 'jani-farmer-5', 'jani-ai-1', 'reggie-user');

-- More inventory items
INSERT INTO "Inventory" (id, name, "inventoryType", "inventoryUnit", description, "estimatedValuePerUnit", "warehousesId")
VALUES
  ('jani-inventory-3', 'Coffee Beans', 'produce', 'kg', 'Sun-dried Arabica', '1200', 'jani-warehouse-1'),
  ('jani-inventory-4', 'Onion Bulbs', 'produce', 'kg', 'Grade A onions', '200', 'jani-warehouse-1');

-- Extra report for visibility
INSERT INTO "Reports" (id, name, "dateCreated", "finishedTracking", "harvestsId", project_id, "userId")
VALUES
  ('jani-report-2', 'Rice Season Report', NOW() - INTERVAL '20 days', true, 'jani-harvest-5', 'jani-ai-1', 'reggie-user');

INSERT INTO "ReportTrackingEvents" (id, "eventName", "dateCreated", description, "reportId", project_id)
VALUES
  ('jani-event-4', 'Processing', NOW() - INTERVAL '18 days', 'Processed rice harvest for distribution', 'jani-report-2', 'jani-ai-1');

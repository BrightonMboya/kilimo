-- Test data for local development
-- This file runs AFTER Prisma schema is pushed (tables exist)
-- Run with: pnpm db:seed:local

-- Clean existing test data (for idempotency)
TRUNCATE TABLE "ReportTrackingEvents", "Reports", "Inventory", "Warehouses", "Harvests", "Farmers", "Equipments", "SentEmail", "ProjectInvite", "Customer", "ProjectUsers", "Project", "Session", "Account", "User", "VerificationToken" CASCADE;

-- Insert test users (primary admin is Reggie Joseph)
INSERT INTO "User" (id, name, email, "emailVerified", image, source, "defaultWorkspace", "createdAt", "updatedAt")
VALUES
  ('reggie-user', 'Reggie Joseph', 'reggie@jani.ai', NOW(), NULL, 'local', 'jani-ai-1', NOW(), NOW()),
  ('test-user-2', 'Test Member', 'member@test.local', NOW(), NULL, 'local', 'jani-ai-1', NOW(), NOW());

-- Insert test project / organization
INSERT INTO "Project" (id, name, slug, logo, plan, "stripeId", "billingCycleStart", "stripeConnectId", "inviteCode", "reportLimit", "farmersLimit", "harvestsLimit", "createdAt", "updatedAt", "usageLastChecked")
VALUES
  ('jani-ai-1', 'JANI AI', 'jani-ai', NULL, 'free', NULL, 1, NULL, 'JANI123', 1000, 5000, 2000, NOW(), NOW(), NOW());

-- Insert project users (ownership)
INSERT INTO "ProjectUsers" (id, role, "createdAt", "updatedAt", "userId", "projectId")
VALUES
  ('jani-pu-1', 'owner', NOW(), NOW(), 'reggie-user', 'jani-ai-1'),
  ('jani-pu-2', 'member', NOW(), NOW(), 'test-user-2', 'jani-ai-1');

-- Insert sample farmers belonging to JANI AI
INSERT INTO "Farmers" (id, "fullName", "phoneNumber", "farmSize", province, country, crops, "quantityCanSupply", project_id, "userId")
VALUES
  ('jani-farmer-1', 'Samuel Mwangi', '+254700000101', 60, 'Nairobi', 'Kenya', 'Maize,Beans', 1200, 'jani-ai-1', 'reggie-user'),
  ('jani-farmer-2', 'Amina Otieno', '+254700000102', 35, 'Mombasa', 'Kenya', 'Tomatoes', 600, 'jani-ai-1', 'reggie-user');

-- Insert sample harvests for those farmers
INSERT INTO "Harvests" (id, date, name, crop, size, "inputsUsed", unit, "farmersId", project_id, "userId")
VALUES
  ('jani-harvest-1', NOW() - INTERVAL '7 days', 'Maize Harvest Q1', 'Maize', 150, 'Fertilizer, Seeds', 'kg', 'jani-farmer-1', 'jani-ai-1', 'reggie-user'),
  ('jani-harvest-2', NOW() - INTERVAL '3 days', 'Tomato Harvest', 'Tomatoes', 80, 'Pesticides', 'kg', 'jani-farmer-2', 'jani-ai-1', 'reggie-user');

-- Insert test warehouse for JANI AI
INSERT INTO "Warehouses" (id, name, description, "maxCapacity", unit, project_id)
VALUES
  ('jani-warehouse-1', 'JANI AI Main Storage', 'Primary storage facility for JANI AI', 50000, 'kg', 'jani-ai-1');

-- Insert inventory items
INSERT INTO "Inventory" (id, name, "inventoryType", "inventoryUnit", description, "estimatedValuePerUnit", "warehousesId")
VALUES
  ('jani-inventory-1', 'Maize Seeds', 'seed', 'kg', 'High-yield maize seeds', '500', 'jani-warehouse-1'),
  ('jani-inventory-2', 'Fertilizer NPK', 'fertilizer', 'kg', 'NPK 10-10-10', '300', 'jani-warehouse-1');

-- Insert test reports and docs
INSERT INTO "Reports" (id, name, "dateCreated", "finishedTracking", "harvestsId", project_id, "userId")
VALUES
  ('jani-report-1', 'Maize Q1 Report', NOW() - INTERVAL '5 days', false, 'jani-harvest-1', 'jani-ai-1', 'reggie-user');

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

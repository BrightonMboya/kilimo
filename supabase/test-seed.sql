-- Test data for local development
-- This file runs AFTER Prisma schema is pushed (tables exist)
-- Run with: pnpm db:seed:local

-- Clean existing test data (for idempotency)
TRUNCATE TABLE "ReportTrackingEvents", "Reports", "Inventory", "Warehouses", "Harvests", "Farmers", "Equipments", "SentEmail", "ProjectInvite", "Customer", "ProjectUsers", "Project", "Session", "Account", "User", "VerificationToken" CASCADE;

-- Insert test users
INSERT INTO "User" (id, name, email, "emailVerified", image, source, "defaultWorkspace", "createdAt", "updatedAt")
VALUES
  ('test-user-1', 'Test Admin', 'admin@test.local', NOW(), NULL, 'local', 'test-project-1', NOW(), NOW()),
  ('test-user-2', 'Test Member', 'member@test.local', NOW(), NULL, 'local', 'test-project-1', NOW(), NOW());

-- Insert test project
INSERT INTO "Project" (id, name, slug, logo, plan, "stripeId", "billingCycleStart", "stripeConnectId", "inviteCode", "reportLimit", "farmersLimit", "harvestsLimit", "createdAt", "updatedAt", "usageLastChecked")
VALUES
  ('test-project-1', 'Test Kilimo Project', 'test-kilimo', NULL, 'free', NULL, 1, NULL, 'TEST123', 100, 500, 200, NOW(), NOW(), NOW());

-- Insert project users
INSERT INTO "ProjectUsers" (id, role, "createdAt", "updatedAt", "userId", "projectId")
VALUES
  ('test-pu-1', 'owner', NOW(), NOW(), 'test-user-1', 'test-project-1'),
  ('test-pu-2', 'member', NOW(), NOW(), 'test-user-2', 'test-project-1');

-- Insert test farmers
INSERT INTO "Farmers" (id, "fullName", "phoneNumber", "farmSize", province, country, crops, "quantityCanSupply", project_id, "userId")
VALUES
  ('test-farmer-1', 'John Farmer', '+254700000001', 50, 'Nairobi', 'Kenya', 'Maize,Beans', 1000, 'test-project-1', 'test-user-1'),
  ('test-farmer-2', 'Jane Cultivator', '+254700000002', 30, 'Mombasa', 'Kenya', 'Tomatoes', 500, 'test-project-1', 'test-user-1');

-- Insert test harvests
INSERT INTO "Harvests" (id, date, name, crop, size, "inputsUsed", unit, "farmersId", project_id, "userId")
VALUES
  ('test-harvest-1', NOW() - INTERVAL '7 days', 'Maize Harvest Q1', 'Maize', 100, 'Fertilizer, Seeds', 'kg', 'test-farmer-1', 'test-project-1', 'test-user-1'),
  ('test-harvest-2', NOW() - INTERVAL '3 days', 'Tomato Harvest', 'Tomatoes', 50, 'Pesticides', 'kg', 'test-farmer-2', 'test-project-1', 'test-user-1');

-- Insert test warehouse
INSERT INTO "Warehouses" (id, name, description, "maxCapacity", unit, project_id)
VALUES
  ('test-warehouse-1', 'Main Storage', 'Primary storage facility', 10000, 'kg', 'test-project-1');

-- Insert test inventory
INSERT INTO "Inventory" (id, name, "inventoryType", "inventoryUnit", description, "estimatedValuePerUnit", "warehousesId")
VALUES
  ('test-inventory-1', 'Maize Seeds', 'seed', 'kg', 'High-yield maize seeds', '500', 'test-warehouse-1'),
  ('test-inventory-2', 'Fertilizer NPK', 'fertilizer', 'kg', 'NPK 10-10-10', '300', 'test-warehouse-1');

-- Insert test reports
INSERT INTO "Reports" (id, name, "dateCreated", "finishedTracking", "harvestsId", project_id, "userId")
VALUES
  ('test-report-1', 'Maize Q1 Report', NOW() - INTERVAL '5 days', false, 'test-harvest-1', 'test-project-1', 'test-user-1');

-- Insert test report tracking events
INSERT INTO "ReportTrackingEvents" (id, "eventName", "dateCreated", description, "reportId", project_id)
VALUES
  ('test-event-1', 'Harvest Collected', NOW() - INTERVAL '5 days', 'Initial harvest collection', 'test-report-1', 'test-project-1'),
  ('test-event-2', 'Quality Check', NOW() - INTERVAL '4 days', 'Passed quality inspection', 'test-report-1', 'test-project-1'),
  ('test-event-3', 'Storage', NOW() - INTERVAL '3 days', 'Stored in warehouse', 'test-report-1', 'test-project-1');

/**
 * Test fixtures for seeding the test database
 * 
 * This module provides functions to create test data for all entities.
 * Each fixture function returns the created data for use in tests.
 */

import { db } from "@kilimo/db";

// Extra safety guard for destructive cleanup
function ensureSafeDatabase() {
  const url = process.env.DATABASE_URL ?? "";
  if (!url.includes("localhost") && !url.includes("kilimo_test")) {
    throw new Error(`clearDatabase aborted: DATABASE_URL=${url} does not look like a test database`);
  }
}

/**
 * Clear all test data from the database
 * Use this in afterEach or afterAll to clean up
 */
export async function clearDatabase() {
  ensureSafeDatabase();
  // Delete in order to respect foreign key constraints
  await db.reportTrackingEvents.deleteMany({});
  await db.reports.deleteMany({});
  await db.inventory.deleteMany({});
  await db.harvests.deleteMany({});
  await db.farmers.deleteMany({});
  await db.warehouses.deleteMany({});
  await db.equipments.deleteMany({});
  await db.projectInvite.deleteMany({});
  await db.projectUsers.deleteMany({});
  await db.customer.deleteMany({});
  await db.sentEmail.deleteMany({});
  await db.project.deleteMany({});
  await db.session.deleteMany({});
  await db.account.deleteMany({});
  await db.user.deleteMany({});
}

/**
 * Create a test user
 */
export async function createTestUser(data?: {
  id?: string;
  email?: string;
  name?: string;
  source?: string;
  defaultWorkspace?: string;
}) {
  return await db.user.create({
    data: {
      id: data?.id ?? "test-user-id",
      email: data?.email ?? "test@example.com",
      name: data?.name ?? "Test User",
      source: data?.source ?? "credentials",
      defaultWorkspace: data?.defaultWorkspace,
    },
  });
}

/**
 * Create a test project (workspace)
 */
export async function createTestProject(data?: {
  name?: string;
  slug?: string;
  plan?: string;
  billingCycleStart?: number;
  reportLimit?: number;
  farmersLimit?: number;
  harvestsLimit?: number;
}) {
  return await db.project.create({
    data: {
      name: data?.name ?? "Test Workspace",
      slug: data?.slug ?? "test-workspace",
      plan: data?.plan ?? "free",
      billingCycleStart: data?.billingCycleStart ?? 1,
      reportLimit: data?.reportLimit ?? 5,
      farmersLimit: data?.farmersLimit ?? 10,
      harvestsLimit: data?.harvestsLimit ?? 5,
    },
  });
}

/**
 * Create a test farmer
 */
export async function createTestFarmer(
  projectId: string,
  userId?: string,
  data?: {
    fullName?: string;
    phoneNumber?: string;
    farmSize?: number;
    province?: string;
    country?: string;
    crops?: string;
    quantityCanSupply?: number;
  }
) {
  return await db.farmers.create({
    data: {
      fullName: data?.fullName ?? "John Doe",
      phoneNumber: data?.phoneNumber ?? "+1234567890",
      farmSize: data?.farmSize ?? 10,
      province: data?.province ?? "Test Province",
      country: data?.country ?? "Test Country",
      crops: data?.crops ?? "Maize, Wheat",
      quantityCanSupply: data?.quantityCanSupply ?? 1000,
      project_id: projectId,
      userId: userId,
    },
  });
}

/**
 * Create a test harvest
 */
export async function createTestHarvest(
  projectId: string,
  farmerId: string,
  userId?: string,
  data?: {
    name?: string;
    date?: Date;
    crop?: string;
    unit?: string;
    size?: number;
    inputsUsed?: string;
  }
) {
  return await db.harvests.create({
    data: {
      name: data?.name ?? "Spring Harvest 2025",
      date: data?.date ?? new Date("2025-03-15"),
      crop: data?.crop ?? "Maize",
      unit: data?.unit ?? "kg",
      size: data?.size ?? 1500,
      inputsUsed: data?.inputsUsed ?? "Fertilizer, Pesticide",
      farmersId: farmerId,
      project_id: projectId,
      userId: userId,
    },
  });
}

/**
 * Create a test warehouse
 */
export async function createTestWarehouse(
  projectId: string,
  data?: {
    name?: string;
    description?: string;
    maxCapacity?: number;
    unit?: string;
  }
) {
  return await db.warehouses.create({
    data: {
      name: data?.name ?? "Main Storage Facility",
      description: data?.description ?? "Primary warehouse for agricultural products",
      maxCapacity: data?.maxCapacity ?? 5000,
      unit: data?.unit ?? "tons",
      project_id: projectId,
    },
  });
}

/**
 * Create test equipment
 */
export async function createTestEquipment(data?: {
  name?: string;
  type?: string;
  leased?: boolean;
  dateAcquired?: Date;
  purchasePrice?: string;
  estimatedValue?: string;
  brand?: string;
  status?: string;
}) {
  return await db.equipments.create({
    data: {
      name: data?.name ?? "Tractor",
      type: data?.type ?? "Heavy Machinery",
      leased: data?.leased ?? false,
      dateAcquired: data?.dateAcquired ?? new Date("2025-01-01"),
      purchasePrice: data?.purchasePrice ?? "50000",
      estimatedValue: data?.estimatedValue ?? "45000",
      brand: data?.brand ?? "John Deere",
      status: data?.status ?? "Available",
    },
  });
}

/**
 * Create test inventory item
 */
export async function createTestInventory(
  warehouseId: string,
  data?: {
    name?: string;
    inventoryType?: string;
    inventoryUnit?: string;
    description?: string;
    estimatedValuePerUnit?: string;
  }
) {
  return await db.inventory.create({
    data: {
      name: data?.name ?? "Fertilizer NPK",
      inventoryType: data?.inventoryType ?? "Agricultural Input",
      inventoryUnit: data?.inventoryUnit ?? "kg",
      description: data?.description ?? "High-quality nitrogen-phosphorus-potassium fertilizer",
      estimatedValuePerUnit: data?.estimatedValuePerUnit ?? "25.50",
      warehousesId: warehouseId,
    },
  });
}

/**
 * Add a user to a project
 */
export async function addUserToProject(
  userId: string,
  projectId: string,
  role: "owner" | "member" = "member"
) {
  return await db.projectUsers.create({
    data: {
      userId,
      projectId,
      role,
    },
  });
}

/**
 * Create a complete test setup with user, project, and relationships
 * This is useful for tests that need a full working environment
 */
export async function createCompleteTestSetup() {
  const user = await createTestUser();
  const project = await createTestProject();
  await addUserToProject(user.id, project.id, "owner");

  const farmer = await createTestFarmer(project.id, user.id);
  const harvest = await createTestHarvest(project.id, farmer.id, user.id);
  const warehouse = await createTestWarehouse(project.id);
  const equipment = await createTestEquipment();
  const inventory = await createTestInventory(warehouse.id);

  return {
    user,
    project,
    farmer,
    harvest,
    warehouse,
    equipment,
    inventory,
  };
}

/**
 * Create multiple test farmers for a project
 */
export async function createMultipleFarmers(
  projectId: string,
  userId: string,
  count: number = 3
) {
  const farmers = [];
  
  for (let i = 0; i < count; i++) {
    const farmer = await createTestFarmer(projectId, userId, {
      fullName: `Farmer ${i + 1}`,
      phoneNumber: `+123456789${i}`,
      farmSize: 10 + i * 5,
      province: `Province ${i + 1}`,
      crops: i % 2 === 0 ? "Maize, Wheat" : "Rice, Beans",
      quantityCanSupply: 1000 + i * 500,
    });
    farmers.push(farmer);
  }
  
  return farmers;
}

/**
 * Create multiple test harvests for a farmer
 */
export async function createMultipleHarvests(
  projectId: string,
  farmerId: string,
  userId: string,
  count: number = 3
) {
  const harvests = [];
  
  for (let i = 0; i < count; i++) {
    const harvest = await createTestHarvest(projectId, farmerId, userId, {
      name: `Harvest ${i + 1}`,
      date: new Date(2025, i, 15), // Different months
      crop: i % 2 === 0 ? "Maize" : "Wheat",
      size: 1000 + i * 500,
    });
    harvests.push(harvest);
  }
  
  return harvests;
}

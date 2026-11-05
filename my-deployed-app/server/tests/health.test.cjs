const { test, after, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.JWT_SECRET = "test-secret";

const { app, prisma } = require("../dist/app.js");
const originalQueryRaw = prisma.$queryRaw;

afterEach(() => {
  prisma.$queryRaw = originalQueryRaw;
});

after(async () => {
  await prisma.$disconnect();
});

test("health returns 200 when the database responds", async () => {
  prisma.$queryRaw = async () => [{ value: 1 }];
  const response = await request(app).get("/api/health").expect(200);

  assert.equal(response.body.status, "ok");
  assert.equal(response.body.database, "up");
  assert.equal(typeof response.body.version, "string");
  assert.equal(typeof response.body.timestamp, "number");
  assert.equal(typeof response.body.uptime, "number");
  assert.equal(typeof response.body.memory.rss, "number");
  assert.ok(response.headers["x-request-id"]);
});

test("health returns 503 when the database fails", async () => {
  prisma.$queryRaw = async () => {
    throw new Error("Database unavailable");
  };

  const response = await request(app).get("/api/health").expect(503);

  assert.equal(response.body.status, "degraded");
  assert.equal(response.body.database, "down");
});

test("health warns when memory usage exceeds 80%", async (t) => {
  prisma.$queryRaw = async () => [{ value: 1 }];

  const memory = process.memoryUsage();
  const heapLimit = require("node:v8").getHeapStatistics().heap_size_limit;

  t.mock.method(process, "memoryUsage", () => ({
    ...memory,
    heapUsed: heapLimit * 0.9,
  }));

  const response = await request(app).get("/api/health").expect(503);

  assert.equal(response.body.status, "degraded");
  assert.equal(response.body.checks.database, "ok");
  assert.equal(response.body.checks.memory, "warning");
});
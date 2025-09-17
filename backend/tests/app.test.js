const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const connectDB = require("../src/config/db");

beforeAll(async () => {
  // Connect to MongoDB before running any tests
  await connectDB();
});

// Clean DB before each test
beforeEach(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Backend basic tests", () => {
  it("GET /api/server-status should return 200", async () => {
    const res = await request(app).get("/api/server-status");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });

  it("GET /api/test-route should return 200", async () => {
    const res = await request(app).get("/api/test-route");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Test route is working");
  });

  it("POST /api/auth/register should create a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        phone: "1234567890", // ✅ Added phone
        location: { formattedAddress: "123 Test Street" },
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("success", true);
  });

  it("POST /api/auth/login should log in an existing user", async () => {
    // Register first so the user exists
    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email: "login@example.com",
      password: "password123",
      phone: "0987654321", // ✅ Added phone
      location: { formattedAddress: "456 Login Street" },
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("success", true);
  });
});

import request from "supertest";
import { jest } from "@jest/globals";
import {
  connectInMemoryDB,
  clearDatabase,
  closeInMemoryDB,
} from "./testUtils.js";
import app from "../server.js";

jest.setTimeout(30000);

describe("API Endpoints", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.JWT_SECRET = "testsecret";
    process.env.JWT_REFRESH_SECRET = "testrefreshsecret";
    await connectInMemoryDB();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeInMemoryDB();
  });

  const userPayload = {
    username: "testuser",
    email: "test@example.com",
    password: "password123",
  };

  const registerUser = (payload = userPayload) => {
    return request(app).post("/api/auth/register").send(payload);
  };

  const loginUser = (
    payload = { email: userPayload.email, password: userPayload.password },
  ) => {
    return request(app).post("/api/auth/login").send(payload);
  };

  test("register success", async () => {
    const response = await registerUser();

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      username: userPayload.username,
      email: userPayload.email,
      role: "user",
    });
    expect(response.body.accessToken).toBeDefined();
  });

  test("register with existing email", async () => {
    await registerUser();
    const response = await registerUser({
      username: "anotheruser",
      email: userPayload.email,
      password: "newpassword",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toMatchObject({
      email: "Email already in use",
    });
  });

  test("register with missing fields", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "missing@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors.username).toBeDefined();
    expect(response.body.errors.password).toBeDefined();
  });
  test("login success", async () => {
    await registerUser();
    const response = await loginUser();

    expect(response.status).toBe(201);
    expect(response.body.email).toBe(userPayload.email);
    expect(response.body.accessToken).toBeDefined();
  });

  test("login with incorrect password", async () => {
    await registerUser();
    const response = await loginUser({
      email: userPayload.email,
      password: "wrongpassword",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toMatchObject({
      password: "Incorrect password",
    });
  });

  describe("service endpoints", () => {
    let authToken;

    beforeEach(async () => {
      await registerUser();
      const loginResponse = await loginUser();
      authToken = loginResponse.body.accessToken;
    });

    const createService = (payload) => {
      return request(app)
        .post("/api/service")
        .set("Authorization", `Bearer ${authToken}`)
        .send(payload);
    };

    test("fetching services starts empty", async () => {
      const response = await request(app)
        .get("/api/service")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test("creating a service", async () => {
      const serviceDate = new Date();
      serviceDate.setDate(serviceDate.getDate() + 1);

      const response = await createService({
        Name: "knip",
        Date: serviceDate.toISOString(),
        Time: "10:00",
      });
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        Name: "knip",
        Time: "10:00",
        Status: "Gepland",
      });
      expect(response.body.userId).toBeDefined();
    });

    test("deleting own service succeeds and removes it from the list", async () => {
      const serviceDate = new Date();
      serviceDate.setDate(serviceDate.getDate() + 1);

      const createResponse = await createService({
        Name: "knip",
        Date: serviceDate.toISOString(),
        Time: "10:00",
      });
      expect(createResponse.status).toBe(201);
      const serviceId = createResponse.body._id;

      const deleteResponse = await request(app)
        .delete(`/api/service/${serviceId}`)
        .set("Authorization", `Bearer ${authToken}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.message).toMatch(/deleted/i);

      const listResponse = await request(app)
        .get("/api/service")
        .set("Authorization", `Bearer ${authToken}`);
      expect(listResponse.status).toBe(200);
      expect(listResponse.body).toEqual([]);
    });

    test("fetching services without auth fails", async () => {
      const response = await request(app).get("/api/service");

      expect(response.status).toBe(401);
      expect(response.body.error).toMatch(/Authorization token required/i);
    });

    test("cannot delete someone else's service", async () => {
      const secondUser = {
        username: "seconduser",
        email: "other@example.com",
        password: "password123",
      };
      await request(app).post("/api/auth/register").send(secondUser);
      const secondLogin = await request(app).post("/api/auth/login").send({
        email: secondUser.email,
        password: secondUser.password,
      });
      const secondToken = secondLogin.body.accessToken;

      const serviceDate = new Date();
      serviceDate.setDate(serviceDate.getDate() + 1);

      const createResponse = await createService({
        Name: "fade",
        Date: serviceDate.toISOString(),
        Time: "11:00",
      });

      expect(createResponse.status).toBe(201);
      const serviceId = createResponse.body._id;

      const deleteResponse = await request(app)
        .delete(`/api/service/${serviceId}`)
        .set("Authorization", `Bearer ${secondToken}`);

      expect(deleteResponse.status).toBe(404);
      expect(deleteResponse.body.error).toBe("Service not found");
    });
  });
});

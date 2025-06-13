const request = require("supertest");
const app = require("../app");
const {
  convertPayloadToToken,
  convertTokenToPayload,
} = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");
const { sequelize } = require("../models");

let tokenAdminOne = convertPayloadToToken({ id: 1 });
let tokenStaffOne = convertPayloadToToken({ id: 3 });

beforeAll(async () => {
  const users = require("../data/users.json");
  users.forEach((el) => {
    el.password = hashPassword(el.password);
    el.updatedAt = new Date();
    el.createdAt = new Date();
  });

  await sequelize.queryInterface.bulkInsert("Users", users, {});
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete(
    "Users",
    {},
    { truncate: true, cascade: true, restartIdentity: true }
  );
});

//register
describe("POST /register", () => {
  //forbidden
  describe("POST /register - fail", () => {
    it("", async () => {
      const response = await request(app)
        .post("/register")
        .send({ email: "", password: "" })
        .set("Authorization", `Bearer ${tokenStaffOne}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", expect.any(String));
    });
  });

  describe("POST /register - succeed", () => {
    it("", async () => {
      const response = await request(app)
        .post("/register")
        .set("Authorization", `Bearer ${tokenAdminOne}`)
        .send({ email: "test1@mail.com", password: "12345" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });

  //email unique
  describe("POST /register - fail", () => {
    it("", async () => {
      const response = await request(app)
        .post("/register")
        .set("Authorization", `Bearer ${tokenAdminOne}`)
        .send({ email: "test1@mail.com", password: "12345" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", expect.any(Array));
    });
  });

  //min password 5
  describe("POST /register - fail", () => {
    it("", async () => {
      const response = await request(app)
        .post("/register")
        .set("Authorization", `Bearer ${tokenAdminOne}`)
        .send({ email: "test1@mail.com", password: "1234" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", expect.any(Array));
    });
  });

  //format email
  describe("POST /register - fail", () => {
    it("", async () => {
      const response = await request(app)
        .post("/register")
        .set("Authorization", `Bearer ${tokenAdminOne}`)
        .send({ email: "test1", password: "12345" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", expect.any(Array));
    });
  });

  //not empty
  describe("POST /register - fail", () => {
    it("", async () => {
      const response = await request(app)
        .post("/register")
        .set("Authorization", `Bearer ${tokenAdminOne}`)
        .send({ email: "", password: "" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", expect.any(Array));
    });
  });
});

//login
describe("POST /login", () => {
  describe("POST /login - succeed", () => {
    it("", async () => {
      const response = await request(app)
        .post("/login")
        .send({ email: "test1@mail.com", password: "12345" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
    });
  });

  describe("POST /login - fail", () => {
    it("", async () => {
      const response = await request(app)
        .post("/login")
        .send({ email: "", password: "" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", expect.any(String));
    });
  });

  describe("POST /login - fail", () => {
    it("", async () => {
      const response = await request(app)
        .post("/login")
        .send({ email: "wrongEmail@mail.com", password: "12345" });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", expect.any(String));
    });
  });
});

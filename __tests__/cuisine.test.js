const request = require("supertest");
const app = require("../app");
const { convertPayloadToToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");
const { sequelize } = require("../models");

let tokenAdminOne = convertPayloadToToken({ id: 1 });
let tokenAdminTwo = convertPayloadToToken({ id: 2 });
let tokenStaffOne = convertPayloadToToken({ id: 3 });
let tokenStaffTwo = convertPayloadToToken({ id: 4 });

beforeAll(async () => {
  const users = require("../data/users.json");
  users.forEach((el) => {
    el.password = hashPassword(el.password);
    el.updatedAt = new Date();
    el.createdAt = new Date();
  });

  const categories = require("../data/categories.json");
  categories.forEach((el) => {
    el.updatedAt = new Date();
    el.createdAt = new Date();
  });

  const cuisines = require("../data/cuisines.json");
  cuisines.forEach((el) => {
    el.updatedAt = new Date();
    el.createdAt = new Date();
  });

  await sequelize.queryInterface.bulkInsert("Users", users, {});
  await sequelize.queryInterface.bulkInsert("Categories", categories, {});
  await sequelize.queryInterface.bulkInsert("Cuisines", cuisines, {});
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete(
    "Users",
    {},
    { truncate: true, cascade: true, restartIdentity: true }
  );
  await sequelize.queryInterface.bulkDelete(
    "Categories",
    {},
    { truncate: true, cascade: true, restartIdentity: true }
  );
  await sequelize.queryInterface.bulkDelete(
    "Cuisines",
    {},
    { truncate: true, cascade: true, restartIdentity: true }
  );
});

//create cuisine post
describe("POST /cuisines", () => {
  describe("POST /cuisines - suceeed", () => {
    it("code 201, createdPost: anyObject", async () => {
      const response = await request(app)
        .post("/cuisines")
        .set("Authorization", `Bearer ${tokenAdminOne}`)
        .field("name", "Sate Ayam")
        .field("description", "Sate ayam madura")
        .field("price", 15000)
        .field("categoryId", 2)
        .field("authorId", 1)
        .attach(
          "image",
          Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8BTZPYXjcAAAAASUVORK5CYII=",
            "base64"
          ),
          "test.jpg"
        );

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("createdPost", expect.any(Object));
    });
  });

  describe("POST /cuisines - fail", () => {
    it("code: 400", async () => {
      const response = await request(app)
        .post("/cuisines")
        .set("Authorization", `Bearer ${tokenAdminOne}`)
        .field("name", "Sate Ayam")
        .field("description", "Sate ayam madura")
        .field("price", 999)
        .field("categoryId", 2)
        .field("authorId", 1)
        .attach(
          "image",
          Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8BTZPYXjcAAAAASUVORK5CYII=",
            "base64"
          ),
          "test.jpg"
        );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", expect.any(Array));
    });
  });
});

//post cuisines
describe("GET /pub/cuisines", () => {
  describe("GET /pub/cuisines - suceeed", () => {
    it("", async () => {
      const response = await request(app).get("/pub/cuisines");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data", expect.any(Array));
      expect(response.body.data.length).toBeLessThanOrEqual(10);
      expect(response.body).toHaveProperty("size", 10);
    });
  });

  describe("GET /pub/cuisines?search=nasi - suceeed", () => {
    it("", async () => {
      const response = await request(app).get("/pub/cuisines?search=nasi");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data", expect.any(Array));
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /pub/cuisines?search=12345 - fail", () => {
    it("", async () => {
      const response = await request(app).get("/pub/cuisines?search=12345");
      expect(response.body).toHaveProperty("total", 0);
    });
  });

  describe("GET /pub/cuisines?filter=1 - suceeed", () => {
    it("", async () => {
      const response = await request(app).get("/pub/cuisines?filter=1");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data", expect.any(Array));
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].Category).toHaveProperty("id", 1);
    });
  });

  describe("GET /pub/cuisines?sort=DESC - suceeed", () => {
    it("", async () => {
      const response = await request(app).get("/pub/cuisines?sort=ASC");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data", expect.any(Array));
      expect(
        new Date(response.body.data[0].createdAt).getTime()
      ).toBeGreaterThanOrEqual(
        new Date(response.body.data[1].createdAt).getTime()
      );
    });
  });
});

//details cuisine
describe("GET /pub/cuisines/:id", () => {
  describe("GET /pub/cuisines/1 - suceeed", () => {
    it("", async () => {
      const response = await request(app).get("/pub/cuisines/1");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("postDetails", expect.any(Object));
    });
  });

  describe("GET /pub/cuisines/999 - fail", () => {
    it("", async () => {
      const response = await request(app).get("/pub/cuisines/999");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", expect.any(String));
    });
  });
});

//update
describe("PUT /cuisines/:id", () => {
  //update as admin, testin if can change/update other post that authorId is not the admin id
  describe("PUT /cuisines/4 - suceeed", () => {
    it("code 200, updatedPost: anyObject", async () => {
      const response = await request(app)
        .put("/cuisines/4")
        .set("Authorization", `Bearer ${tokenAdminOne}`)
        .field("name", "Sate Ayam")
        .field("description", "Sate ayam madura")
        .field("price", 15000)
        .field("categoryId", 2)
        .field("authorId", 4)
        .attach(
          "image",
          Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8BTZPYXjcAAAAASUVORK5CYII=",
            "base64"
          ),
          "test2.jpg"
        );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("updatedPost", expect.any(Object));
    });
  });

  describe("PUT /cuisines/4 - fail", () => {
    it("code: 400", async () => {
      const response = await request(app)
        .put("/cuisines/4")
        .set("Authorization", `Bearer ${tokenAdminOne}`)
        .field("name", "Sate Ayam")
        .field("description", "Sate ayam madura")
        .field("price", 999)
        .field("categoryId", 2)
        .field("authorId", 4)
        .attach(
          "image",
          Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8BTZPYXjcAAAAASUVORK5CYII=",
            "base64"
          ),
          "test3.jpg"
        );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", expect.any(Array));
    });
  });

  describe("PUT /cuisines/999 - fail", () => {
    it("code: 404", async () => {
      const response = await request(app)
        .put("/cuisines/999")
        .set("Authorization", `Bearer ${tokenAdminOne}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", expect.any(String));
    });
  });

  //staff editing post that posted by em
  describe("PUT /cuisines/3 - fail", () => {
    it("", async () => {
      const response = await request(app)
        .put("/cuisines/3")
        .set("Authorization", `Bearer ${tokenStaffOne}`)
        .field("name", "Sate Ayam")
        .field("description", "Sate ayam madura")
        .field("price", 15000)
        .field("categoryId", 2)
        .field("authorId", 3)
        .attach(
          "image",
          Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8BTZPYXjcAAAAASUVORK5CYII=",
            "base64"
          ),
          "test4.jpg"
        );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("updatedPost", expect.any(Object));
    });
  });

  //staff editing post that posted by other staff
  describe("PUT /cuisines/4 - fail", () => {
    it("", async () => {
      const response = await request(app)
        .put("/cuisines/4")
        .set("Authorization", `Bearer ${tokenStaffOne}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", expect.any(String));
    });
  });
});

//delete posts
describe("DELETE /cuisines/:id", () => {
  //delte as admin, testin if can delete other post that authorId is not the admin id
  describe("DELETE /cuisines/3 - suceeed", () => {
    it("", async () => {
      const response = await request(app)
        .delete("/cuisines/3")
        .set("Authorization", `Bearer ${tokenAdminOne}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });

  describe("DELETE /cuisines/3 - fail", () => {
    it("", async () => {
      const response = await request(app)
        .delete("/cuisines/3")
        .set("Authorization", `Bearer ${tokenAdminOne}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", expect.any(String));
    });
  });

  //staff deleting his own post
  describe("DELETE /cuisines/4 - succeed", () => {
    it("", async () => {
      const response = await request(app)
        .delete("/cuisines/4")
        .set("Authorization", `Bearer ${tokenStaffTwo}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });

  //staff deleting that is not his post
  describe("DELETE /cuisines/5 - fail", () => {
    it("", async () => {
      const response = await request(app)
        .delete("/cuisines/5")
        .set("Authorization", `Bearer ${tokenStaffTwo}`);
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", expect.any(String));
    });
  });
});

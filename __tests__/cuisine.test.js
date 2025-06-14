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
  //blm login
  describe("POST /cuisines - fail - blm login", () => {
    it("code 401, createdPost: anyString", async () => {
      const response = await request(app)
        .post("/cuisines")
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

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", expect.any(String));
    });
  });

  //invalid token
  describe("POST /cuisines - fail - invalid token", () => {
    it("code 401, error: anyString", async () => {
      const response = await request(app)
        .post("/cuisines")
        .set("Authorization", `Bearer FakeToken`)
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

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", expect.any(String));
    });
  });

  //create post
  describe("POST /cuisines - suceeed - create post", () => {
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

  describe("POST /cuisines - fail - validation", () => {
    it("code: 400, error : anyArray", async () => {
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

// cuisines
describe("GET /pub/cuisines", () => {
  describe("GET /pub/cuisines - suceeed - get Cuisines + pagination", () => {
    it("code: 200, expected to have anyObject, data length <= 10, size = 10", async () => {
      const response = await request(app).get("/pub/cuisines");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data", expect.any(Array));
      expect(response.body.data.length).toBeLessThanOrEqual(10);
      expect(response.body).toHaveProperty("size", 10);
    });
  });

  describe("GET /pub/cuisines?search=nasi - suceeed - search", () => {
    it("code: 200, expected data is an Array and length more than 0", async () => {
      const response = await request(app).get("/pub/cuisines?search=nasi");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data", expect.any(Array));
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /pub/cuisines?search=12345 - fail - no cuisine name with 12345", () => {
    it("expected total is 0", async () => {
      const response = await request(app).get("/pub/cuisines?search=12345");
      expect(response.body).toHaveProperty("total", 0);
    });
  });

  describe("GET /pub/cuisines?filter=1 - suceeed", () => {
    it("code : 200, expected data is an array. length more than 0, with data.Category id is 1", async () => {
      const response = await request(app).get("/pub/cuisines?filter=1");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data", expect.any(Array));
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[3].Category).toHaveProperty("id", 1);
    });
  });

  describe("GET /pub/cuisines?sort=DESC - suceeed - sorting", () => {
    it("code: 200, expected data sorted by createdAt DESC", async () => {
      const response = await request(app).get("/pub/cuisines?sort=DESC");
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
  describe("GET /pub/cuisines/1 - suceeed - cuisine details", () => {
    it("code: 200, postDetails: Object", async () => {
      const response = await request(app).get("/pub/cuisines/1");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("postDetails", expect.any(Object));
    });
  });

  describe("GET /pub/cuisines/999 - fail - cant find cuisine", () => {
    it("code: 404, error : string", async () => {
      const response = await request(app).get("/pub/cuisines/999");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", expect.any(String));
    });
  });
});

//update
describe("PUT /cuisines/:id", () => {
  //update, but havent login
  describe("PUT /cuisines/4 - (mustlogin) - fail havent login", () => {
    it("code: 401, error : string", async () => {
      const response = await request(app)
        .put("/cuisines/4")
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

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", expect.any(String));
    });
  });

  //update but token not valid
  describe("PUT /cuisines/4 - fail - token not valid", () => {
    it("code: 401, error : string", async () => {
      const response = await request(app)
        .put("/cuisines/4")
        .set("Authorization", `Bearer FakeToken`)
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

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", expect.any(String));
    });
  });

  //update as admin, testin if can change/update other post that authorId is not the admin id
  describe("PUT /cuisines/4 - suceeed - update as an admin", () => {
    it("code 200, updatedPost: object", async () => {
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

  //validation
  describe("PUT /cuisines/4 - fail - validation", () => {
    it("code: 400, error : array", async () => {
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

  describe("PUT /cuisines/999 - fail - cant find cuisine id", () => {
    it("code: 404, error : string", async () => {
      const response = await request(app)
        .put("/cuisines/999")
        .set("Authorization", `Bearer ${tokenAdminOne}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", expect.any(String));
    });
  });

  //staff editing post that posted by em
  describe("PUT /cuisines/3 - fail - role staff edit his own post", () => {
    it("code: 200, updatedPost: object", async () => {
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
  describe("PUT /cuisines/4 - fail - edit post that not his own post", () => {
    it("code: 403, error : string", async () => {
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
  //must login
  describe("DELETE /cuisines/3 - fail - must login", () => {
    it("code : 401, message: string", async () => {
      const response = await request(app).delete("/cuisines/3");
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", expect.any(String));
    });
  });

  //wrong token
  describe("DELETE /cuisines/3 - fail - invalid token", () => {
    it("code : 401, message: string", async () => {
      const response = await request(app)
        .delete("/cuisines/3")
        .set("Authorization", `Bearer FakeToken`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", expect.any(String));
    });
  });

  //delte as admin, testin if can delete other post that authorId is not the admin id
  describe("DELETE /cuisines/3 - suceeed - admin delete post", () => {
    it("code : 200, message: string", async () => {
      const response = await request(app)
        .delete("/cuisines/3")
        .set("Authorization", `Bearer ${tokenAdminTwo}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });

  //cant find post
  describe("DELETE /cuisines/3 - fail - cant find post id", () => {
    it("code: 404, error : string", async () => {
      const response = await request(app)
        .delete("/cuisines/3")
        .set("Authorization", `Bearer ${tokenAdminTwo}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", expect.any(String));
    });
  });

  //staff deleting his own post
  describe("DELETE /cuisines/4 - succeed - staff deleting his own post", () => {
    it("code : 200, message: string", async () => {
      const response = await request(app)
        .delete("/cuisines/4")
        .set("Authorization", `Bearer ${tokenStaffTwo}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });

  //staff deleting that is not his post
  describe("DELETE /cuisines/5 - fail - staff deleting that is not his own post", () => {
    it("code: 403, error : string", async () => {
      const response = await request(app)
        .delete("/cuisines/5")
        .set("Authorization", `Bearer ${tokenStaffTwo}`);
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", expect.any(String));
    });
  });
});

const request = require("supertest");
const buildApp = require("../../app");
const UserRepo = require("../../repos/user-repo");
const pool = require("../../pool");
const Context = require("../context");

let context;

beforeAll(async () => {
  context = await Context.build();
});

beforeEach(() => {
  context.reset();
});

afterAll(() => {
  context.close();
});

it("can create a user", async () => {
  const startingCount = await UserRepo.count();

  await request(buildApp())
    .post("/users")
    .send({
      username: "test-user",
      bio: "test-bio",
    })
    .expect(200);

  const finishCount = await UserRepo.count();
  expect(finishCount - startingCount).toEqual(1);
});

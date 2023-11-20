import { login } from "../controls/auth.js";
import { UserModel } from "../models/Users.js";
import { expect } from "chai";
import sinon from "sinon";

describe("Unit Test for /auth", () => {
  describe("Testing /login", () => {
    let findOneStub;

    before(() => {
      // Stub UserModel.findOne to return the valid user
      findOneStub = sinon.stub(UserModel, "findOne");
    });

    after(() => {
      // Restore UserModel.findOne to its original behavior
      findOneStub.restore();
    });

    it("Test 1 - should return 400 and an error message if email and password are missing", async () => {
      const req = { body: { email: "", password: "" } };
      const res = {
        status: (code) => {
          expect(code).to.equal(400);
          return {
            json: (data) => {
              expect(data.success).to.be.false;
              expect(data.message).to.equal("Invalid email or password");
            },
          };
        },
      };

      const next = () => {};

      await login(req, res, next);
    });

    it("Test 2 - should return 401 and an error message for invalid credentials", async () => {
      // Stub UserModel.findOne to return null, simulating no user found
      findOneStub.resolves(null);

      const req = {
        body: { email: "nonexistent@example.com", password: "password" },
      };
      const res = {
        status: (code) => {
          expect(code).to.equal(401);
          return {
            json: (data) => {
              expect(data.success).to.be.false;
              expect(data.message).to.equal("Invalid credential");
            },
          };
        },
      };

      const next = () => {};

      await login(req, res, next);
    });

    it("Test 3 - should return 401 and an error message if the user account is locked", async () => {
      const user = {
        f_name: "Tony",
        l_name: "Stary",
        email: "tony@gmail.com",
        email_verified: false,
        encrypted_password:
          "$2b$10$j/RNlYDxhWRGn3S2pJPaL./2E.rF6PREhd90eR8U8IHwOGOC4ScRe",
        role: "member",
        account_lock: true,
      };

      // Stub UserModel.findOne to return the locked user
      findOneStub.resolves(user);

      const req = {
        body: { email: "tony@gmail.com", password: "123456" },
      };
      const res = {
        status: (code) => {
          expect(code).to.equal(401);
          return {
            json: (data) => {
              expect(data.success).to.be.false;
              expect(data.message).to.equal(
                "Account is locked. Reset your password or contact administrator to unlock your account."
              );
            },
          };
        },
      };

      const next = () => {};

      await login(req, res, next);
    });

    it("Test 4 - should return 401 and an error message for invalid credentials", async () => {
      const user = {
        f_name: "Tony",
        l_name: "Stary",
        email: "tony@gmail.com",
        email_verified: false,
        encrypted_password:
          "$2b$10$j/RNlYDxhWRGn3S2pJPaL./2E.rF6PREhd90eR8U8IHwOGOC4ScRe",
        role: "member",
        account_lock: false,
      };

      // Stub UserModel.findOne to return the user with invalid password
      findOneStub.resolves(user);

      const req = {
        body: { email: "tony@gmail.com", password: "1234567" },
      };
      const res = {
        status: (code) => {
          expect(code).to.equal(401);
          return {
            json: (data) => {
              expect(data.success).to.be.false;
              expect(data.message).to.equal("Invalid credential");
            },
          };
        },
      };

      const next = () => {};

      await login(req, res, next);
    });

    it("Test 5 - should return 401 and an error message if the user is already logged in", async () => {
      const user = {
        f_name: "Tony",
        l_name: "Stary",
        email: "tony@gmail.com",
        email_verified: false,
        encrypted_password:
          "$2b$10$j/RNlYDxhWRGn3S2pJPaL./2E.rF6PREhd90eR8U8IHwOGOC4ScRe",
        role: "member",
        account_lock: false,
      };

      // Stub UserModel.findOne to return the user with invalid password
      findOneStub.resolves(user);

      const req = {
        body: { email: "tony@gmail.com", password: "123456" },
        session: { user: { email: "tony@gmail.com" } },
      };
      const res = {
        status: (code) => {
          expect(code).to.equal(401);
          return {
            json: (data) => {
              expect(data.success).to.be.false;
              expect(data.message).to.equal("User is already logged in");
            },
          };
        },
      };

      const next = () => {};

      await login(req, res, next);
    });

    it("Test 6 - should return 401 and an error message if user missing tokens", async () => {
      const user = {
        f_name: "Tony",
        l_name: "Stary",
        email: "tony@gmail.com",
        email_verified: false,
        encrypted_password:
          "$2b$10$j/RNlYDxhWRGn3S2pJPaL./2E.rF6PREhd90eR8U8IHwOGOC4ScRe",
        role: "member",
        account_lock: false,
      };

      // Stub UserModel.findOne to return the user with invalid password
      findOneStub.resolves(user);

      const req = {
        body: { email: "tony@gmail.com", password: "123456" },
        session: {
          user: { email: null },
          save: () => {},
          csrfToken: null,
          destroy: () => {},
        },
        cookies: {
          CSRFToken: null,
        },
      };
      const res = {
        status: (code) => {
          expect(code).to.equal(401);
          return {
            json: (data) => {
              expect(data.success).to.be.false;
              expect(data.message).to.equal("Token not found");
            },
          };
        },
      };

      const next = () => {};

      await login(req, res, next);
    });

    it("Test 7 - should return 401 and an error message if user tokens do not match", async () => {
      const user = {
        f_name: "Tony",
        l_name: "Stary",
        email: "tony@gmail.com",
        email_verified: false,
        encrypted_password:
          "$2b$10$j/RNlYDxhWRGn3S2pJPaL./2E.rF6PREhd90eR8U8IHwOGOC4ScRe",
        role: "member",
        account_lock: false,
      };

      // Stub UserModel.findOne to return the user with invalid password
      findOneStub.resolves(user);

      const req = {
        body: { email: "tony@gmail.com", password: "123456" },
        session: {
          user: { email: null },
          save: () => {},
          csrfToken: "test",
          destroy: () => {},
        },
        cookies: {
          CSRFToken: "test1",
        },
      };
      const res = {
        status: (code) => {
          expect(code).to.equal(401);
          return {
            json: (data) => {
              expect(data.success).to.be.false;
              expect(data.message).to.equal("Invalid token");
            },
          };
        },
        clearCookie: () => {},
        cookie: () => {},
      };

      const next = () => {};

      await login(req, res, next);
    });

    it("Test 8 - should return 200 OK with success message for valid login", async () => {
      const user = {
        f_name: "Tony",
        l_name: "Stary",
        email: "tony@gmail.com",
        email_verified: false,
        encrypted_password:
          "$2b$10$j/RNlYDxhWRGn3S2pJPaL./2E.rF6PREhd90eR8U8IHwOGOC4ScRe",
        role: "member",
        account_lock: false,
      };

      // Stub UserModel.findOne to return the user with invalid password
      findOneStub.resolves(user);

      const req = {
        body: { email: "tony@gmail.com", password: "123456" },
        session: {
          user: { email: null },
          save: () => {},
          csrfToken: "test",
        },
        cookies: {
          CSRFToken: "test",
        },
      };
      const res = {
        status: (code) => {
          expect(code).to.equal(200);
          return {
            json: (data) => {
              expect(data.success).to.be.true;
              expect(data.message).to.equal("Login successfully.");
            },
          };
        },
      };

      const next = () => {};

      await login(req, res, next);
    });
  });
});

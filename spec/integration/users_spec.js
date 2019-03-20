const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {
  beforeEach((done) => {
    sequelize.sync({ force: true })
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });

  });

  describe("GET /users/sign_up", () => {
    it("should render a view with a sign up form", (done) => {
      request.get(`${base}sign_up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign up");
        done();
      });
    });
  });

  describe("GET /users/sign_in", () => {
    it("should render a view with a sign in form", (done) => {
      request.get(`${base}sign_in`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign in");
        done();
      });
    });

    it("should render a view with a sign in form", (done) => {
      request.get(`${base}signin`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign in");
        done();
      });
    });

  });

  describe("POST /users", () => {
    it("should create a new user with valid values and redirect", (done) => {
      const options = {
        url: base + "signup",
        form: {
          email: "user@example.com",
          password: "123456789",
          username: "User Example"
        }
      }
      request.post(options,
        (err, res, body) => {
          User.findOne({ where: { email: "user@example.com" } })
            .then((user) => {
              expect(user).not.toBeNull();
              expect(user.email).toBe("user@example.com");
              expect(user.id).toBe(1);
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        }
      );
    });

    it("should not create a new user with invalid attributes and redirect", (done) => {
      request.post(
        {
          url: base,
          form: {
            email: "no",
            password: "123456789",
            username: "none"
          }
        },
        (err, res, body) => {
          User.findOne({ where: { email: "no" } })
            .then((user) => {
              expect(user).toBeNull();
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        }
      );
    });

    it("should create a new user with default role of standard (0)", (done) => {
      const options = {
        url: base + "signup",
        form: {
          name: "John Bonham",
          email: "JBonham@ledzep.com",
          password: "drumhard"
        }
      }

      request.post(options, (err, res, body) => {
        User.findOne({ where: { email: "JBonham@ledzep.com" } })
          .then((user) => {
            expect(user).not.toBeNull();
            expect(user.email).toBe("JBonham@ledzep.com");
            expect(user.id).toBe(1);
            expect(user.role).toBe(0);
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
      })
    });
  });



});
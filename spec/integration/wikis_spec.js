const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis";
const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("routes : Wikis", () => {

    beforeEach((done) => {
        this.user;
        this.Wiki;
        sequelize.sync({ force: true }).then((res) => {
            User.create({
                userName: "John Paul Jones",
                email: "jpjones@ledzep.com",
                password: "rambleon"
            })
                .then((user) => {
                    this.user = user;

                    Wiki.create({
                        title: "Iconic bass lines.",
                        body: "Best bass riffs ever.",
                        userId: this.user.id,
                        private: false
                    })
                        .then((wiki) => {
                            this.wiki = wiki;
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                });
        });
    });


    //CRUD OPERATIONS
    describe("user performing CRUD actions for Topic", () => {
             beforeEach((done) => {
               User.create({
                 email: "admin@example.com",
                 userName: "Jimmy Page",
                 password: "123456"
               })
               .then((user) => {
                 request.get({         // mock authentication
                   url: "http://localhost:3000/auth/fake",
                   form: {
                     userName: user.userName,     // mock authenticate as admin user
                     userId: user.id,
                     email: user.email
                   }
                 },
                   (err, res, body) => {
                     done();
                   }
                 );
               });
             });


    describe("GET /wikis", () => {
        it("should respond with all wikis", (done) => {
            request.get(base, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Iconic bass lines.");
                done();
            });
        });
    });

    describe("GET /wikis/new", () => {
        it("should render a new wiki form", (done) => {
            request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Wiki");
                done();
            });
        });
    });

    describe("POST /wikis/create", () => {
        it("should create a new wiki and redirect", (done) => {
            const options = {
                url: `${base}create`,
                form: {
                    title: "Jam Bands.",
                    body: "The best jam bands of the 80s.",
                    userId: this.user.id
                }
            };
            request.post(options,
                (err, res, body) => {
                    Wiki.findOne({ where: { title: "Jam Bands." } })
                        .then((wiki) => {
                            expect(wiki.title).toBe("Jam Bands.");
                            expect(wiki.body).toBe("The best jam bands of the 80s.");
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                }
            );
        });
    });

    describe("GET /wikis/:id", () => {
        it("should render a view with the selected wiki", (done) => {
            request.get(`${base}/${this.wiki.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Jam Bands.");
                done();
            });
        });
    });

    describe("POST /wikis/:id/destroy", () => {
        it("should delete the wiki with the associated ID", (done) => {
            Wiki.all()
                .then((wikis) => {
                    const wikiCountBeforeDelete = wikis.length;
                    expect(wikiCountBeforeDelete).toBe(1);
                    request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
                        Wiki.all()
                            .then((wikis) => {
                                expect(err).toBeNull();
                                expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
                                done();
                            })
                    })
                })
        });
    });

    describe("GET /wikis/:id/edit", () => {
        it("should render a view with an edit wiki form", (done) => {
            request.get(`${base}/${this.wiki.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Wiki");
                expect(body).toContain("Jam Bands.");
                done();
            });
        });
    });

    describe("POST /wikis/:id/update", () => {
        it("should update the wiki with the given values", (done) => {
            const options = {
                url: `${base}/${this.wiki.id}/update`,
                form: {
                    title: "Worlds Greatest Drummers.",
                    body: "The best drummers.",
                    userId: this.user.id
                }
            };
            request.post(options,
                (err, res, body) => {
                    expect(err).toBeNull();
                    Wiki.findOne({
                        where: { id: this.wiki.id }
                    })
                        .then((wiki) => {
                            expect(wiki.title).toBe("Worlds Greatest Drummers.");
                            done();
                        });
                });
        });
    });


})
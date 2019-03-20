const sequelize = require("../../src/db/models/index").sequelize;
const user = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("Wiki", () => {

    beforeEach((done) => {
        this.User;
        this.Wiki;
        sequelize.sync({ force: true }).then((res) => {

            User.create({
                userName: "Jimmy Page",
                email: "jpage@ledzep.com",
                password: "stairway2heaven"
            })
                .then((user) => {
                    this.user = user;
                    Wiki.create({
                        title: "Iconic riffs.",
                        body: "The best guitar intro ever.",
                        userId: this.user.id,
                        private: false
                    })
                        .then((Wiki) => {
                            this.Wiki = Wiki;
                            done();
                        });
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });

    });

    describe("#create()", () => {
        it("should create a wiki object with a title, body, and private status", (done) => {
            Wiki.create({
                title: "Amazing guitarists",
                body: "Eric Clapton.",
                userId: this.user.id,
                private: false
            })
                .then((wiki) => {
                    expect(wiki.title).toBe("Amazing guitarists.");
                    expect(wiki.body).toBe("Eric Clapton.");
                    done();

                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });

        it("should not create a wiki missing the title, body, userId, or private status", (done) => {
            Wiki.create({
                title: "Best albums of the 70s.",
            })
                .then((wiki) => {
                    done();
                })
                .catch((err) => {
                    expect(err.message).toContain("Wiki.body cannot be null");
                    expect(err.message).toContain("Wiki.private cannot be null");
                    expect(err.message).toContain("Wiki.userId cannot be null");
                    done();
                });
        });

    });


    describe("#setUser()", () => {
        it("should associate a wiki and a user together", (done) => {
            Wiki.create({
                name: "Robert Plant",
                email: "rplant@ledzep.com",
                password: "frontman1"
            })
                .then((newUser) => {
                    expect(this.wiki.userId).toBe(this.user.id);
                    this.wiki.setUser(newUser)
                        .then((wiki) => {
                            expect(this.wiki.userId).toBe(newUser.id);
                            done();
                        });
                })
        });
    });

    describe("#getUser()", () => {
        it("should return the associated wiki", (done) => {
            this.wiki.getUser()
                .then((associatedUser) => {
                    expect(associatedUser.email).toBe("rplant@ledzep.com");
                    done();
                })
        });
    });



});

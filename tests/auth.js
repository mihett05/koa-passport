const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../app");
const User = require("../models/User");

chai.use(chaiHttp);
const should = chai.should();

const randomString = length => {
    let random = "";
    while (random.length < length) 
        random += Math.random().toString(36).substring(2);
    return random.substring(0, length);
};

const user = {
    login: randomString(12),
    password: randomString(16)
};
let registerAfterToken;
let loginAfterToken;

const verifyAuthBody = res => {
    res.should.have.status(200);
    res.body.should.be.a("object");
    res.body.should.have.property("done").eql(true);
    res.body.should.have.property("token");
    res.body.should.have.property("user");
    res.body.user.should.have.property("login").equal(user.login);
};

const verifyErrorAuthBody = res => {
    res.should.not.have.status(200);
    res.body.should.be.a("object");
    res.body.should.have.property("done").eql(false);
    res.body.should.not.have.property("token");
    res.body.should.not.have.property("user");
    res.body.should.have.property("status");
};

const verifyGetLoginBody = res => {
    res.should.have.status(200);
    res.body.should.be.a("object");
    res.body.should.have.property("done").eql(true);
    res.body.should.have.property("user");
    res.body.user.should.have.property("login").equal(user.login);
}

describe("auth", () => {
    describe("register", () => {
        it("should register user", done => {
            chai.request(server)
                .put("/api/auth")
                .send({ user })
                .end((err, res) => {
                    verifyAuthBody(res);
                    registerAfterToken = res.body.token;
                    done();
                });
        });
        it("should not register user with same login", done => {
            chai.request(server)
                .put("/api/auth")
                .send({ user })
                .end((err, res) => {
                    verifyErrorAuthBody(res);
                    done();
                });
        });
        it("should not register user with missing data", done => {
            chai.request(server)
                .put("/api/auth")
                .send({})
                .end((err, res) => {
                    verifyErrorAuthBody(res);
                    done();
                });
        });
        it("should not register user with incorrect data", done => {
            chai.request(server)
                .put("/api/auth")
                .send({
                    user: {
                        login: "\n \t \t \t    \n \n\n\n \t",
                        password: "\t\t\t     \n"
                    }
                })
                .end((err, res) => {
                    verifyErrorAuthBody(res);
                    done();
                });
        });
    });
    describe("login", () => {
        it("should login user", done => {
            chai.request(server)
                .post("/api/auth")
                .send({ user })
                .end((err, res) => {
                    verifyAuthBody(res);
                    loginAfterToken = res.body.token;
                    done();
                });
        });
        it("should not login with missing data", done => {
            chai.request(server)
                .post("/api/auth")
                .send({})
                .end((err, res) => {
                    verifyErrorAuthBody(res);
                    done();
                });
        });
        it("should not login with incorrect login and password", done => {
            chai.request(server)
                .post("/api/auth")
                .send({
                    user: {
                        login: randomString(14),
                        password: randomString(18)
                    }
                })
                .end((err, res) => {
                    verifyErrorAuthBody(res);
                    done();
                });
        });
    });
    describe("protect routes", () => {
        it("should accept registerAfter token", done => {
            chai.request(server)
                .get("/api/auth")
                .set("Authorization", `Bearer ${registerAfterToken}`)
                .end((err, res) => {
                    verifyGetLoginBody(res);
                    done();
                });
        });
        it("should accept loginAfter token", done => {
            chai.request(server)
                .get("/api/auth")
                .set("Authorization", `Bearer ${loginAfterToken}`)
                .end((err, res) => {
                    verifyGetLoginBody(res);
                    done();
                });
        });
        it("should not accept invalid token", done => {
            let char = loginAfterToken.slice(-1);
            while (char === loginAfterToken.slice(-1))
                char = randomString(1);
            let invalidToken = loginAfterToken.slice(0, -1) + char;
            chai.request(server)
                .get("/api/auth")
                .set("Authorization", `Bearer ${invalidToken}`)
                .end((err, res) => {
                    verifyErrorAuthBody(res);
                    done();
                });
        });
    });
});
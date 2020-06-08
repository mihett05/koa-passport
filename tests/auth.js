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

const verifyAuthBody = body => {
    res.should.have.status(200);
    body.should.be.a("object");
    body.should.have.property("done").eql(true);
    body.should.have.property("user");
    body.user.should.have.property("login").eql(user.login);
};

describe("auth", () => {
    descirbe("register", () => {
        it("should create user", done => {
            chai.request(server)
                .put("/auth")
                .send(user)
                .end((err, res) => {
                    verifyAuthBody(res.body);
                    
                })
        })
    })
});
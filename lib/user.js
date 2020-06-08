const crypto = require("crypto");
const User = require("../models/User");

const verifyUser = user => 
    typeof user === "object" && user !== null && "login" in user && "password" in user &&
    typeof user.login === "string" && user.login.trim().length > 0 &&
    typeof user.password === "string" && user.password.trim().length > 0;

const viewUser = user => {
    if (typeof user === "object" && user !== null && "_doc" in user && ("_id" in user._doc || "password" in user._doc || "__v" in user._doc)) {
        let localUser = { ...user };
        delete localUser._doc.password;
        delete localUser._doc._id;
        delete localUser._doc.__v;
        return localUser._doc;
    }
    return user;
};

const createUser = async (login, password) => {
    const user = await User.findOne({ login });
    if (!verifyUser(user))
    {
        const res = await User.create({
            login,
            password: crypto.createHash("sha256").update(password).digest("hex")
        });
        return res;
    }
    return {};
};

const findUser = async (login, password) => {
    const user = await User.findOne({
        login,
        password: crypto.createHash("sha256").update(password).digest("hex")
    });
    if (verifyUser(user))
        return user;
    return  {};
}

module.exports = { createUser, findUser, verifyUser, viewUser };
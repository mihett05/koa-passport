const crypto = require("crypto");
const User = require("../models/User");

const createUser = async (login, password, name) => {
    const user = await User.findOne({ login });
    if (user !== {})
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
    if (user !== {})
        return user;
    return  {};
}

const verifyUser = user => 
    typeof user === "object" && "login" in user && "password" in user;

module.exports = { createUser, findUser, verifyUser };
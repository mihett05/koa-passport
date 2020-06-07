const { verifyUser } = require("../lib/user");

const verifyUserJson = async (ctx, next) => {
    if (verifyUser(ctx.request.body.user)) {
        await next();
    } else {
        ctx.body = {
            done: false,
            status: "Invalid user"
        };
    }
};

module.exports = verifyUserJson; 
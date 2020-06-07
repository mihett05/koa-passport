const passport = require("koa-passport");
const { verifyUser } = require("../lib/user");

const jwt = (ctx, next) =>
    passport.authenticate("jwt", { session: false }, async (err, user) => {
        if (err || !verifyUser(user)) {
            ctx.body = {
                done: false,
                status: "Unauthorized"
            }
        }
        else
            await next();
    })(ctx, next);

module.exports = jwt;
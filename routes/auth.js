const Router = require("koa-router");

const { authenticate, createToken } = require("../lib/passport");
const { createUser, verifyUser, viewUser } = require("../lib/user");

const verifyUserJson = require("../middleware/verifyUserJson");
const validJson = require("../middleware/validJson");
const jwt = require("../middleware/jwt");

const router = new Router();

router
    .use(validJson)
    .post("/", verifyUserJson, async (ctx, next) => {
        // Login
        try {
            const user = await authenticate(ctx);
            ctx.body = {
                done: true,
                token: createToken(user._id),
                user: viewUser(user)
            };
        } catch (err) {
            ctx.status = 400;
            ctx.body = {
                done: false,
                status: "Incorrect login or password"
            };
        }
    })
    .put("/", verifyUserJson, async ctx => {
        // Register
        const user = await createUser(ctx.request.body.user.login, ctx.request.body.user.password);
        if (verifyUser(user)) {
            ctx.body = {
                done: true,
                user: viewUser(user)
            };
        } else {
            ctx.status = 400;
            ctx.body = {
                done: false,
                status: "Login is already taken by another user"
            };
        }
    })
    .get("/", jwt, async ctx => {
        ctx.body = "Nice";
    })
    

module.exports = router;
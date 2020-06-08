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
            const token = createToken(user._id);
            ctx.body = {
                done: true,
                token,
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
            const token = createToken(user._id);
            ctx.body = {
                done: true,
                user: viewUser(user),
                token
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
        // Get login by token (just for test jwt auth protect)
        ctx.body = {
            done: true,
            user: viewUser(ctx.state.user)
        };
    })
    

module.exports = router;
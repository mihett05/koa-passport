const Router = require("koa-router");
const { authenticate, createToken } = require("../lib/passport");
const validJson = require("../middleware/validJson");

const router = new Router();

router
    .post("/", validJson, async (ctx, next) => {
        console.log(ctx.request.headers);
        console.log(ctx.request.body);
        ctx.body = "Nice";
    })

module.exports = router;
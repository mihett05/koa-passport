const Koa = require("koa");
const Router = require("koa-router");
const passport = require("koa-passport");
const koaBody = require("koa-body");

const app = new Koa();
const router = new Router({ prefix: "/api" });

// Middlewares
app.use(passport.initialize());
app.use(koaBody());

// Importing routes
const userRouter = require("./routes/auth");

// Adding routes
router.use("/auth", userRouter.routes(), userRouter.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());
require("./utils/dbConnect")()
    .then(() => app.listen(3000));
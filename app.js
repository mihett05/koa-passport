const Koa = require("koa");
const Router = require("koa-router");
const passport = require("koa-passport");
const bodyParser = require("koa-bodyparser");

const dbConnect = require("./utils/dbConnect");

const app = new Koa();
const router = new Router({ prefix: "/api" });

process.env.KEY = process.env.KEY || "key";

// Middlewares
app.use(bodyParser({
    enableTypes: ["text", "json"]
}));
app.use(passport.initialize());

// Importing routes
const userRouter = require("./routes/auth");

// Adding routes
router.use("/auth", userRouter.routes(), userRouter.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());
(async () => await dbConnect())();
module.exports = app.listen(3000);
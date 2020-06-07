const validJson = async (ctx, next) => {
    if (!(ctx.method === "GET" || ctx.method === "HEAD") && typeof ctx.request.body !== "object") {
        let parseJson = false;
        if (typeof ctx.request.body == "string") {
            try {
                const data = JSON.parse(ctx.request.body);
                ctx.request.body = data;
                parseJson = true;
            } catch (err) {}
        }
        if (!parseJson) {
            ctx.body = {
                done: false,
                status: "Invalid json"
            };
            return;
        }
    }
    return await next();
};

module.exports = validJson;
const mongoose = require("mongoose");

mongoose.connection.on("error", err => console.log(err));

const connection = {};

async function dbConnect() {
    if (connection.isConnected)
        return;
    const db = await mongoose.connect("mongodb://localhost:27017/koa_passport_template", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
    connection.isConnected = db.connections[0].readyState;
}

module.exports = dbConnect;
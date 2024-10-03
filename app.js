const express = require("express");
const cors = require("cors");
const http = require("http");
const { initialize } = require("./src/utils/socketResponse");
const app = express();
const server = http.createServer(app);
const errorHandler = require("./middlwares/APIerrorHandle");
app.use(cors());
initialize(server);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//const errorHandler = require("./src/utils/errorHandler");

require("./routes/index")(app);

app.use(errorHandler);

module.exports = app;

//server setup
const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
//const server = http.createServer(app);
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

require("dotenv").config();
//importing routes and functions
const { initialize } = require("./src/utils/socketResponse");
const { setUpDirectory } = require("./src/utils/Upload");
const { connectToDatabase } = require("./src/models/dbConnection");
const adminRoutes = require("./src/routes/adminRoutes");
const utilRoutes = require("./src/routes/utilRoutes");
const presenterRoutes = require("./src/routes/presenterRoutes");
const audienceRoutes = require("./src/routes/audienceRoutes");
const errorHandler = require("./middlwares/APIerrorHandle");

//intilaize(Routes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/util", utilRoutes);
app.use("/api/v1/presenter", presenterRoutes);
app.use("/api/v1/audience", audienceRoutes);

app.use(errorHandler);

connectToDatabase();

setUpDirectory();

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});

module.exports = app;

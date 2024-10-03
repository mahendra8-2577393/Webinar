const mongoose = require("mongoose");

connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.Mongodb_Url, {
      dbName: "conference",
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = {
  connectToDatabase,
};

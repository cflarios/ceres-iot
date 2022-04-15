const { connect } = require("mongoose");

(async () => {
  try {
    const db = await connect("mongodb+srv://ceres:ceres123@ceresiot.ayzzg.mongodb.net/ceresIoT?retryWrites=true&w=majority");
    console.log("DB connected to", db.Connection.name);
  } catch (error) {
    console.log(error);
  }
})();

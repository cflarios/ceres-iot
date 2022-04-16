const { connect } = require("mongoose");
const {config} = require('dotenv');
config();
 
(async () => {
  try {
    const db = await connect(process.env.MONGODB_URI);
    console.log("DB connected to", db.Connection.name);
  } catch (error) {
    console.log(error);
  }
})();

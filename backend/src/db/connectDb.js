import mongoose from "mongoose";
import { DB_Name, MONGODB_URI } from "../constants.js";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGODB_URI}/${DB_Name}`
    );
    console.log(
      `DB Connected Successfully !! ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`Error connecting with Database`);
    process.exit(1);
  }
};
export default connectDb;

import connect from "./lib/connect.js";
import User from "./models/User.js";

const db = {};

db.connect = connect;

db.user = User;

export default db;

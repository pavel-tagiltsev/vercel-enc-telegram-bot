import connect from "./lib/connect.js";
import Cache from "./models/Cache.js";
import User from "./models/User.js";

const db = {};

db.connect = connect;

db.user = User;

db.cache = Cache;

export default db;

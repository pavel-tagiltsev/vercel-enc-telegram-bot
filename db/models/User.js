import mongoose from "mongoose";

export default mongoose.model(
  "User",
  new mongoose.Schema({
    id: Number,
    name: String,
    email: String,
    password: String,
    telegram_chat_ids: [Number],
  })
);

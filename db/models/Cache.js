import mongoose from "mongoose";

export default mongoose.model(
  "Сache",
  new mongoose.Schema({
    chatId: {
      type: Number,
      required: true,
    },
    messages: [
      {
        id: {
          type: Number,
          required: true,
        },
        clickedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  })
);

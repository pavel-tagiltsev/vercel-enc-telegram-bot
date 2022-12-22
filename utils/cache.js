import db from "../db";

export async function checkCache(chatId, messageId) {
  await db.connect();

  const chat = await db.cache.findOne({ chatId: chatId });

  if (chat) {
    const isClicked = chat.messages.find((message) => message.id === messageId);

    if (isClicked) {
      return true;
    }

    await addObjectToArray(chat, messageId);
    return false;
  }

  await addObjectToCollection(db.cache, chatId, messageId);
  return false;
}

export async function clearCache(chatId, messageId) {
  try {
    await db.connect();

    await db.cache.updateOne(
      { chatId: chatId },
      { $pull: { messages: { id: messageId } } }
    );
  } catch (error) {
    console.error("error", error);
  }
}

async function addObjectToArray(model, messageId) {
  try {
    model.messages.push({ id: messageId, clickedAt: Date.now() });

    await model.save();
  } catch (error) {
    console.error("error", error);
  }
}

async function addObjectToCollection(model, chatId, messageId) {
  try {
    const newModel = new model({
      chatId: chatId,
      messages: [
        {
          id: messageId,
          clickedAt: Date.now(),
        },
      ],
    });

    await newModel.save();
  } catch (error) {
    console.error("error", error);
  }
}

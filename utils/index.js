import bot from "../bot";

export async function reportError(id, error, rethrow = true) {
  console.error(id, error);

  try {
    await bot.telegram.sendMessage(
      process.env.DEV_CHAT_ID,
      `ERROR - ${id}\r\n${error.message}`
    );
  } catch (err) {
    console.error(err);
  }

  if (rethrow) {
    throw error;
  }

  return;
}

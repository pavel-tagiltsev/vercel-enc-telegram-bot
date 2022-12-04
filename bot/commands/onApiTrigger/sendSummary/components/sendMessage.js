export default function sendMessage(bot, user, chat_id, userUnstatusedLessons) {
  return bot.telegram.sendMessage(
    chat_id,
    createUserMessage(user, userUnstatusedLessons),
    createInlineKeyboard(user)
  );
}

function createUserMessage(user, unstatusedLessons) {
  return `${user.name}, у вас ${unstatusedLessons.length} не отмеченых уроков😉`;
}

function createInlineKeyboard(user) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Открыть список",
            callback_data: `OPEN_LIST-${user.id}`,
          },
        ],
      ],
    },
  };
}

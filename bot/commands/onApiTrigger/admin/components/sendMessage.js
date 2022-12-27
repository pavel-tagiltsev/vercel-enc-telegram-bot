export default function sendMessage(bot, user, max, userUnstatusedLessons) {
  return bot.telegram.sendMessage(
    process.env.DEV_CHAT_ID,
    createUserMessage(user, max, userUnstatusedLessons),
    createInlineKeyboard(user)
  );
}

function createUserMessage(user, max, unstatusedLessons) {
  return `${user.name} имеет ${unstatusedLessons.length} не отмеченых уроков. Самая большая просрочка у занятия составляет ${max} дней.`;
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

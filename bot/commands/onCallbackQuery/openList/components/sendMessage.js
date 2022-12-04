import bot from "../../../..";
import createUrl from "./createUrl.js";
import createMessage from "./createMessage.js";

export default async function sendMessage(
  user_id,
  chat_id,
  lesson,
  group,
  filial
) {
  return bot.telegram.sendMessage(
    chat_id,
    createMessage(lesson, group, filial),
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Удалить",
              url: [
                `https://wa.me/79296713900?text=`,
                encodeURIComponent(
                  [
                    "Нужно удалить занятие:",
                    createMessage(lesson, group, filial),
                    createUrl(user_id, lesson, group, filial),
                  ].join("\r\n")
                ),
              ].join(""),
            },
            {
              text: "Отметить",
              url: createUrl(user_id, lesson, group, filial),
            },
          ],
        ],
      },
    }
  );
}

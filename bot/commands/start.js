import db from "../../db/index.js";
import { reportError } from "../../utils/index.js";

export default async function start(ctx) {
  try {
    if (!ctx.startPayload) {
      ctx.reply("Для активации передайте параметр🧐 /start {параметр}");
      return;
    }

    ctx.reply("Инициализация🕑");

    await db.connect();

    const user = await db.user.findOne({ id: ctx.startPayload });

    if (!user) {
      ctx.reply("Нет пользователя с данным параметром🤷");
      return;
    }

    const chat = user.telegram_chat_ids.find(
      (chat_id) => chat_id === ctx.message.chat.id
    );

    if (chat) {
      ctx.reply(`${user.name}, вы уже подписаны на уведомления😎`);
      return;
    }

    await user.telegram_chat_ids.push(ctx.message.chat.id).save();

    ctx.reply(`${user.name}, вы успешно подписались на уведомления😎`);
  } catch (err) {
    await reportError("START", err);
  }
}

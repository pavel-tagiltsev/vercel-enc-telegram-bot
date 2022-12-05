import db from "../../db";
import { reportError } from "../../utils";

export default async function onStart(ctx) {
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

    user.telegram_chat_ids.push(ctx.message.chat.id);

    await user.save();

    ctx.reply(`${user.name}, вы успешно подписались на уведомления😎`);
  } catch (err) {
    await reportError("START", err);
  }
}

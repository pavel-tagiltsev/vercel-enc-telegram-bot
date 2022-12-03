import { Telegraf } from "telegraf";
import commands from "./commands/index.js";
import { reportError } from "../utils/index.js";

let bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start(async (ctx) => {
  await commands.start(ctx);
});

bot.on("callback_query", async (ctx) => {
  const query_data = ctx.update.callback_query.data.split("-");
  const callback_type = query_data[0];
  const user_id = query_data[1];
  const chat_id = ctx.update.callback_query.message.chat.id;
  // const message_id = ctx.update.callback_query.message.message_id;
  console.log(user_id);

  if (callback_type === "OPEN_LESSONS_LIST") {
    await commands.openList(user_id, chat_id);

    await bot.telegram.answerCbQuery(
      ctx.update.callback_query.id,
      "Лист открыт"
    );
  }
});

bot.catch(async (err, ctx) => {
  ctx.reply("Произошла ошибка😔");
  await reportError("BOT_CATCH", err, false);
});

export default bot;

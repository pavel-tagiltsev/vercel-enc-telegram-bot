import { Telegraf } from "telegraf";
import commands from "./commands";
import { reportError } from "../utils";

let bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start(async (ctx) => {
  await commands.onStart(ctx);
});

bot.on("callback_query", async (ctx) => {
  const [callback_type] = ctx.update.callback_query.data.split("-");

  if (callback_type === "OPEN_LIST") {
    await commands.openList(bot, ctx);
  }
});

bot.catch(async (err, ctx) => {
  ctx.reply("Произошла ошибка😔");
  await reportError("BOT_CATCH", err, false);
});

export default bot;

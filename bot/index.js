import { Telegraf } from "telegraf";
import commands from "./commands";
import { reportError } from "../utils";
import { checkCache, clearCache } from "../utils/cache.js";

let bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start(async (ctx) => {
  await commands.onStart(ctx);
});

bot.on("document", async (ctx) => {
  const { file_name } = ctx.update.message.document;

  if (file_name === "performance.xlsx") {
    await commands.sendSalary(ctx);
  }
});

bot.on("callback_query", async (ctx) => {
  const [callback_type] = ctx.update.callback_query.data.split("-");
  const chatId = ctx.update.callback_query.message.chat.id;
  const messageId = ctx.update.callback_query.message.message_id;

  const isClicked = await checkCache(chatId, messageId);

  if (isClicked) {
    return;
  }

  if (callback_type === "OPEN_LIST") {
    try {
      await commands.openList(ctx);
    } catch (error) {
      await clearCache(chatId, messageId);
    }
  }
});

bot.catch(async (err, ctx) => {
  ctx.reply("Произошла ошибка😔");
  await reportError("BOT_CATCH", err, false);
});

export default bot;

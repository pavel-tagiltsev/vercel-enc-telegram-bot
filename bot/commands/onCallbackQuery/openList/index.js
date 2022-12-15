import showLessons from "./components/showLessons.js";
import { reportError } from "../../../../utils";

export default async function openList(ctx) {
  const {
    id: query_id,
    data: query_data,
    message: {
      chat: { id: chat_id },
      reply_markup,
      message_id,
    },
  } = ctx.update.callback_query;

  const [_, user_id] = query_data.split("-");

  await ctx.telegram.editMessageReplyMarkup(chat_id, message_id, null, null);

  try {
    await showLessons(user_id, chat_id);
  } catch (err) {
    await ctx.telegram.editMessageReplyMarkup(
      chat_id,
      message_id,
      null,
      reply_markup
    );
    await reportError("OPEN_LIST", err);
  }

  await ctx.telegram.answerCbQuery(query_id, "Cписок открыт😀");
}

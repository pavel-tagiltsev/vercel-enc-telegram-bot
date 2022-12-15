import { Input } from "telegraf";
import { Buffer } from "buffer";

export default async function sendGeneral(ctx, users, template, performance) {
  const tempateData = {
    names: users
      .map((user) => user.name)
      .filter((name) =>
        performance.pieceworkTable.find((row) => row.name === name)
      ),
    ...performance,
  };

  const templateBuffer = Buffer.from(template(tempateData), "utf-8");
  const filename = `Общий.html`;
  const file = Input.fromBuffer(templateBuffer, filename);

  await ctx.telegram.sendDocument(process.env.DEV_CHAT_ID, file);
}

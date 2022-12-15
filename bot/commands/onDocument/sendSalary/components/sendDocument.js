import { Input } from "telegraf";
import { Buffer } from "buffer";

export default function sendDocument(
  ctx,
  user,
  chat_id,
  performance,
  template
) {
  const tempateData = {
    names: [user.name],
    ...performance,
  };

  const templateBuffer = Buffer.from(template(tempateData), "utf-8");
  const filename = `${user.name}.html`;
  const file = Input.fromBuffer(templateBuffer, filename);

  return ctx.telegram.sendDocument(chat_id, file);
}

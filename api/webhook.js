import bot from "../bot";

export default async function webhook(req, res) {
  await bot.handleUpdate(req.body, res);
}

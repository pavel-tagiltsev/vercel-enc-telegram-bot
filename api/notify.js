import commands from "../bot/commands";
import { reportError } from "../utils";

export default async function notify(req, res) {
  try {
    const token = req.headers.authentication;

    if (token === process.env.NOTIFY_SECRET) {
      await commands.sendSummary();

      return res.status(200).json({ message: "Notification completed" });
    }

    return res.status(401).json({
      message: "The token is not provided or incorrect",
    });
  } catch (err) {
    await reportError("FUNCTION_NOTIFY", err);
  }
}

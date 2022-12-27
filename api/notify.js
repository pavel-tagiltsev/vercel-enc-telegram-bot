import commands from "../bot/commands";
import { reportError } from "../utils";

export default async function notify(req, res) {
  try {
    const token = req.headers.authentication;
    const type = req.body.type;

    if (token === process.env.NOTIFY_SECRET) {
      if (type === "ADMIN") {
        await commands.sendAdmin();
      } else {
        await commands.sendSummary();
      }

      return res.status(200).json({ message: "Notification completed" });
    }

    return res.status(401).json({
      message: "The token is not provided or incorrect",
    });
  } catch (err) {
    await reportError("FUNCTION_NOTIFY", err);
  }
}

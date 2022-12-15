import bot from "../../..";
import db from "../../../../db";
import api from "../../../../api.js";
import sendMessage from "./components/sendMessage.js";
import checkResults from "../../../../utils/checkResults.js";
import sendInfoReport from "../../../../utils/sendInfoReport.js";
import { reportError } from "../../../../utils";

export default async function sendSummary() {
  try {
    await Promise.all([db.connect(), api.token.set()]);

    const reses = await Promise.all([db.user.find({}), api.lessons.get()]);

    await api.token.revoke();

    const [users, lessons] = reses;

    let infoReport = {
      informedUsers: [],
      uninformedUsers: [],
      unregisteredUsers: [],
    };

    let usersToNotify = [];

    users.forEach((user) => {
      const chat_ids = user.telegram_chat_ids;

      if (chat_ids.length === 0) {
        infoReport.unregisteredUsers.push(user);
        return;
      }

      const userUnstatusedLessons = lessons.filter((lesson) =>
        lesson.teacherIds.find((teacherId) => teacherId === user.id)
      );

      if (userUnstatusedLessons.length === 0) {
        infoReport.uninformedUsers.push(user);
        return;
      }

      chat_ids.forEach((chat_id) => {
        usersToNotify.push({
          user,
          request: sendMessage(bot, user, chat_id, userUnstatusedLessons),
        });
      });
    });

    const results = await Promise.allSettled(
      usersToNotify.map((item) => item.request)
    );

    await checkResults(results, infoReport, usersToNotify);
    await sendInfoReport(bot, infoReport);
  } catch (err) {
    await reportError("NOTIFY", err);
  }
}

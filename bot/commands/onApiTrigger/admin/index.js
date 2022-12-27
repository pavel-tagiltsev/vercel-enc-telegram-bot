import bot from "../../..";
import db from "../../../../db";
import api from "../../../../api";
import sendMessage from "./components/sendMessage.js";
import dayjs from "dayjs";

export default async function sendAdmin() {
  try {
    await Promise.all([db.connect(), api.token.set()]);

    const reses = await Promise.all([db.user.find({}), api.lessons.get()]);

    await api.token.revoke();

    const [users, lessons] = reses;

    let usersToNotify = [];

    users.forEach((user) => {
      const userUnstatusedLessons = lessons.filter((lesson) =>
        lesson.teacherIds.find((teacherId) => teacherId === user.id)
      );

      if (userUnstatusedLessons.length === 0) {
        return;
      }

      const today = dayjs();

      const maxDifference = Math.max(
        ...userUnstatusedLessons.map((object) =>
          Math.abs(dayjs(object.date).diff(today, "day"))
        )
      );

      if (maxDifference >= 2) {
        usersToNotify.push({
          user,
          request: sendMessage(bot, user, maxDifference, userUnstatusedLessons),
        });
      }

      return;
    });

    await Promise.allSettled(usersToNotify.map((user) => user.request));
  } catch (error) {
    console.error(error);
  }
}

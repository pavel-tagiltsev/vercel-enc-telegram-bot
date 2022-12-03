import bot from "../index.js";
import api from "../../api.js";
import { reportError } from "../../utils/index.js";
import dayjs from "dayjs";

export default async function openList(user_id, chat_id) {
  try {
    await api.token.set();

    const reses = await Promise.all([
      api.lessons.getByUserId(user_id),
      api.classes.get(),
      api.filials.get(),
    ]);

    await api.token.revoke();

    const lessons = reses[0];
    const classes = reses[1];
    const filials = reses[2];

    const lessonMessages = [];

    lessons.forEach(async (lesson) => {
      const group = classes.find((group) => group.id === lesson.classId);
      const filial = filials.find((filial) => filial.id === lesson.filialId);

      lessonMessages.push(
        bot.telegram.sendMessage(
          chat_id,
          [
            `Группа: ${group.name}`,
            `Дата: ${dayjs(lesson.date).format("DD.MM.YYYY")}`,
            `Время: ${lesson.beginTime}-${lesson.endTime}`,
            `Место: ${filial.name}`,
          ].join("\r\n"),
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Удалить",
                    url: [
                      `https://wa.me/79296713900?text=`,
                      encodeURIComponent(
                        [
                          `Привет! Нужно удалить данный урок:`,
                          `Группа: ${group.name}`,
                          `Дата: ${dayjs(lesson.date).format("DD.MM.YYYY")}`,
                          `Время: ${lesson.beginTime}-${lesson.endTime}`,
                          `Место: ${filial.name}\r\n`,
                        ].join("\r\n")
                      ),
                      encodeURIComponent(
                        [
                          `https://app.moyklass.com/schedule/calendar?`,
                          `period=day&`,
                          `dateFrom=${new Date(lesson.date).getTime()}&`,
                          `dateTo=${new Date(lesson.date).getTime()}&`,
                          `f=${filial.id}&`,
                          `tm=1665940192&`,
                          `type=all&`,
                          `c=${group.id}&`,
                          `t=${user_id}&`,
                          `r=${lesson.roomId}`,
                        ].join("")
                      ),
                    ].join(""),
                  },
                  {
                    text: "Отметить",
                    url: [
                      `https://app.moyklass.com/schedule/calendar?`,
                      `period=day&`,
                      `dateFrom=${new Date(lesson.date).getTime()}&`,
                      `dateTo=${new Date(lesson.date).getTime()}&`,
                      `f=${filial.id}&`,
                      `tm=1665940192&`,
                      `type=all&`,
                      `c=${group.id}&`,
                      `t=${user_id}&`,
                      `r=${lesson.roomId}`,
                    ].join(""),
                  },
                ],
              ],
            },
          }
        )
      );
    });

    await Promise.all(lessonMessages);
  } catch (err) {
    await reportError("OPEN_LIST", err);
  }
}

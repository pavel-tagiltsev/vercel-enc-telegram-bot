import dayjs from "dayjs";

export default function createMessage(lesson, group, filial) {
  return [
    `Группа: ${group.name}`,
    `Дата: ${dayjs(lesson.date).format("DD.MM.YYYY")}`,
    `Время: ${lesson.beginTime}-${lesson.endTime}`,
    `Место: ${filial.name}`,
  ].join("\r\n");
}

export default function createUrl(user_id, lesson, group, filial) {
  return [
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
  ].join("");
}

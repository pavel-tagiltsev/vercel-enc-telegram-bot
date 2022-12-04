import api from "../../../../../api.js";
import sendMessage from "./sendMessage.js";
import { reportError } from "../../../../../utils";

export default async function showLessons(user_id, chat_id) {
  try {
    await api.token.set();

    const reses = await Promise.all([
      api.lessons.getByUserId(user_id),
      api.classes.get(),
      api.filials.get(),
    ]);

    await api.token.revoke();

    const [lessons, classes, filials] = reses;

    for (let i = 0; i < lessons.length; i++) {
      const group = classes.find((group) => group.id === lessons[i].classId);
      const filial = filials.find(
        (filial) => filial.id === lessons[i].filialId
      );

      await sendMessage(user_id, chat_id, lessons[i], group, filial);
    }
  } catch (err) {
    await reportError("OPEN", err);
  }
}

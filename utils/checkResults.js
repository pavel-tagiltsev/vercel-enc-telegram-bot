import { reportError } from "./index.js";

export default async function checkResults(results, infoReport, usersToNotify) {
  let usersToUnragister = [];
  let usersWithErrors = [];

  results.forEach(async (result, i) => {
    if (result.status === "fulfilled") {
      infoReport.informedUsers.push(usersToNotify[i].user);
    }

    if (result.status === "rejected") {
      if (message === "Forbidden: bot was blocked by the user") {
        infoReport.unregisteredUsers.push(usersToNotify[i].user);

        const chat_id = result.reason.on.payload.chat_id;
        const chat_ids = usersToNotify[i].user.telegram_chat_ids;

        chat_ids.splice(chat_ids.indexOf(chat_id), 1);

        usersToNotify[i].user.telegram_chat_ids = chat_ids;

        usersToUnragister.push(usersToNotify[i].user.save());

        return;
      }

      const message = result.reason.response.description;

      usersWithErrors.push(
        reportError("SEND_NOTIFICATION", { message }, false)
      );
    }
  });

  if (usersToUnragister.length !== 0 || usersWithErrors.length !== 0) {
    try {
      await Promise.all([...usersToUnragister, ...usersWithErrors]);
    } catch (err) {
      await reportError("UNRAGISTER_AND_ERRORS", err, false);
    }
  }
}

import bot from "../index.js";
import db from "../../db/index.js";
import api from "../../api.js";
import { reportError } from "../../utils";

const MESSAGE_BOT_BLOCKED = "Forbidden: bot was blocked by the user";

let infoReport = {
  informedUsers: [],
  uninformedUsers: [],
  unregisteredUsers: [],
};

let usersToNotify = [];

export default async function notify() {
  try {
    await Promise.all([db.connect(), api.token.set()]);

    const res = await Promise.all([db.user.find({}), api.lessons.get()]);

    await api.token.revoke();

    const users = res[0];
    const lessons = res[1];

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
          request: bot.telegram.sendMessage(
            chat_id,
            createUserMessage(user),
            createInlineKeyboard()
          ),
        });
      });
    });

    const results = await Promise.allSettled(
      usersToNotify.map((item) => item.request)
    );

    await checkResults(results);
    await sendInfoReport();
  } catch (err) {
    await reportError("NOTIFY", err);
  }
}

function createUserMessage(user) {
  return `${user.name}, у вас есть не отмеченные уроки😉`;
}

function createInlineKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Отметить",
            url: process.env.REPORT_URL,
          },
        ],
      ],
    },
  };
}

async function checkResults(results) {
  let usersToUnragister = [];
  let usersWithErrors = [];

  results.forEach(async (result, i) => {
    if (result.status === "fulfilled") {
      infoReport.informedUsers.push(usersToNotify[i].user);
    }

    if (result.status === "rejected") {
      if (message === MESSAGE_BOT_BLOCKED) {
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
async function sendInfoReport() {
  const { informedUsers, uninformedUsers, unregisteredUsers } = infoReport;

  const isInformedUsers = informedUsers.length !== 0;
  const isUninformedUsers = uninformedUsers.length !== 0;
  const isBlockedUsers = unregisteredUsers.length !== 0;

  if (isInformedUsers || isUninformedUsers || isBlockedUsers) {
    await bot.telegram.sendMessage(
      process.env.DEV_CHAT_ID,
      createInfoMessage()
    );
  }

  function createInfoMessage() {
    function getList(users) {
      return users.length !== 0
        ? users.map((user) => `${user.name}`).join("\r\n")
        : "-----";
    }

    const informedList = getList(informedUsers);
    const uninformedList = getList(uninformedUsers);
    const unregisteredList = getList(unregisteredUsers);

    return [
      "Оповещение получили:",
      informedList + "\r\n",
      "Оповещение не получили:",
      uninformedList + "\r\n",
      "Незарегестрированные",
      unregisteredList,
    ].join("\r\n");
  }
}

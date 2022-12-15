export default async function sendInfoReport(bot, infoReport) {
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

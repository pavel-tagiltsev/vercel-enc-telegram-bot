import getPerformance from "./components/getPerformance.js";
import sendGeneral from "./components/sendGeneral.js";
import axios from "axios";
import path from "path";
import pug from "pug";
import db from "../../../../db";
import checkResults from "../../../../utils/checkResults.js";
import sendInfoReport from "../../../../utils/sendInfoReport.js";
import sendDocument from "./components/sendDocument.js";

export default async function sendSalary(ctx) {
  const { file_id } = ctx.update.message.document;
  const { href } = await ctx.telegram.getFileLink(file_id);

  const stream = await axios.get(href, { responseType: "stream" });

  let chunks = [];

  await new Promise((resolve, reject) => {
    stream.data
      .on("data", (chunk) => {
        chunks.push(chunk);
      })
      .on("end", async () => {
        const performance = await getPerformance(chunks);

        const template = pug.compileFile(
          path.join(
            __dirname,
            "..",
            "..",
            "..",
            "..",
            "templates",
            "salary.pug"
          )
        );

        await db.connect();

        let infoReport = {
          informedUsers: [],
          uninformedUsers: [],
          unregisteredUsers: [],
        };

        const users = await db.user.find({});

        let usersToSendSalary = [];

        users.forEach((user) => {
          const chat_ids = user.telegram_chat_ids;

          if (chat_ids.length === 0) {
            infoReport.unregisteredUsers.push(user);
            return;
          }

          const isUserInPerformance = performance.pieceworkTable.find(
            (row) => row.name === user.name
          );

          if (!isUserInPerformance) {
            infoReport.uninformedUsers.push(user);
            return;
          }

          chat_ids.forEach((chat_id) => {
            usersToSendSalary.push({
              user,
              request: sendDocument(ctx, user, chat_id, performance, template),
            });
          });
        });

        const results = await Promise.allSettled(usersToSendSalary);

        await checkResults(results, infoReport, usersToSendSalary);

        await sendGeneral(ctx, users, template, performance);

        await sendInfoReport(ctx, infoReport);

        resolve();
      })
      .on("error", (err) => reject(err));
  });
}

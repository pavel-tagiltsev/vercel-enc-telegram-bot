import XLSX from "xlsx";
import { reportError } from "../../../../../utils";

export default async function getPerformance(chunks) {
  const book = XLSX.read(Buffer.concat(chunks), { type: "buffer" });

  const pieceworkSheet = book.Sheets["Сдельная"];
  const incomeSheet = book.Sheets["Начисление"];
  const outcomeSheet = book.Sheets["Вычет"];

  if (!pieceworkSheet || !incomeSheet || !outcomeSheet) {
    await reportError(
      "GET_PERFORMANCE",
      {
        message: "Отсутствют лист/ы в таблице Сдельная, Начисление или Вычет",
      },
      false
    );
  }

  const pieceworkTable = XLSX.utils.sheet_to_json(pieceworkSheet);
  const incomeTable = XLSX.utils.sheet_to_json(incomeSheet);
  const outcomeTable = XLSX.utils.sheet_to_json(outcomeSheet);

  const pieceworkTableMaped = pieceworkTable.map((row) => {
    if (row["Группа"] === "Итого по сотруднику") row["Группа"] = "total";
    if (row["Занятие"] === "Итого по группе") row["Занятие"] = "total";

    return {
      name: row["ФИО"],
      filial: row["Филиал"],
      group: row["Группа"],
      date: row["Занятие"],
      count: row["Занятий проведено"],
      hours: row["Время ас.ч."],
      sum: row["Начислено всего"],
      records: row["Записей"],
      visits: row["Посещений"],
    };
  });

  const incomeTableMaped = incomeTable.map((row) => {
    return {
      name: row["ФИО"],
      description: row["Описание"],
      sum: row["Сумма"],
    };
  });

  const outcomeTableMaped = outcomeTable.map((row) => {
    return {
      name: row["ФИО"],
      description: row["Описание"],
      sum: row["Сумма"],
    };
  });

  return {
    pieceworkTable: pieceworkTableMaped,
    incomeTable: incomeTableMaped,
    outcomeTable: outcomeTableMaped,
  };
}

import sendSummary from "./onApiTrigger/sendSummary";
import sendAdmin from "./onApiTrigger/admin";
import sendSalary from "./onDocument/sendSalary";
import openList from "./onCallbackQuery/openList";
import onStart from "./onStart.js";

export default { onStart, sendSummary, sendSalary, openList, sendAdmin };

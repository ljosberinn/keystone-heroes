import nc from "next-connect";

import { reportHandler } from "../../api/functions/report";

export default nc().get(reportHandler);

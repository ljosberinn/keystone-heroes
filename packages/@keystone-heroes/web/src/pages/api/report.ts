import nc from "next-connect";

import { handler } from "../../../../api/handler/report";

export default nc().get(handler);

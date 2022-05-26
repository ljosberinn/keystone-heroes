import nc from "next-connect";

import { healthCheck } from "../../api/functions/health";

export default nc().get(healthCheck);

import nc from "next-connect";

import { fightHandler } from "../../api/functions/fight";

export default nc().get(fightHandler);

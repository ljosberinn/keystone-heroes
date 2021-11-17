import nc from "next-connect";

import { deleteAllHandler } from "../../../api/functions/deleteAll";

export default nc().get(deleteAllHandler);

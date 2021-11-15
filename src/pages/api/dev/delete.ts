import nc from "next-connect";

import { deleteHandler } from "../../../api/functions/delete";

export default nc().get(deleteHandler);

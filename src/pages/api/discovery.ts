import nc from "next-connect";

import { discoveryHandler } from "../../api/functions/discovery";

export default nc().get(discoveryHandler);

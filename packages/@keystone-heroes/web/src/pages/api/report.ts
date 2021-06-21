import { reportHandler } from "@keystone-heroes/api/functions/report";
import nc from "next-connect";

export default nc().get(reportHandler);

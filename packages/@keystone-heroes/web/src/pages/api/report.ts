import { handler } from "@keystone-heroes/api/handler/report";
import nc from "next-connect";

export default nc().get(handler);

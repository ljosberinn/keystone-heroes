import { handler } from "@keystone-heroes/api/handler/fight";
import nc from "next-connect";

export default nc().get(handler);

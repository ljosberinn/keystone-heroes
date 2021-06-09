import { fightHandler } from "@keystone-heroes/api/functions";
import nc from "next-connect";

export default nc().get(fightHandler);

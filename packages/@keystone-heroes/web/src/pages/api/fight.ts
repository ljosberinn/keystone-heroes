import { fightHandler } from "@keystone-heroes/api/functions/fight";
import nc from "next-connect";

export default nc().get(fightHandler);

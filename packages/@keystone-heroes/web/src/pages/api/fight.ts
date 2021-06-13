import { fightHandler } from "@keystone-heroes/api";
import nc from "next-connect";

export default nc().get(fightHandler);

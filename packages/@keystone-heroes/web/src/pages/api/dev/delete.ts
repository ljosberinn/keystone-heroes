import { deleteHandler } from "@keystone-heroes/api/functions/delete";
import nc from "next-connect";

export default nc().get(deleteHandler);

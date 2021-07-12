import { Role } from "@keystone-heroes/db/types";

export const sortByRole = (a: Role, b: Role): 0 | -1 | 1 => {
  if (b === Role.tank || a === Role.dps) {
    return 1;
  }

  if (b === Role.dps || a === Role.tank) {
    return -1;
  }

  return 0;
};

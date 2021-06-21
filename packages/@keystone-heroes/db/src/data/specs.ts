import type { Spec } from "@prisma/client";

import { classes } from "./classes";

export const specs = classes
  .flatMap<Omit<Spec, "id">>(({ id: classID, specs }) =>
    specs.map(({ name, role }) => ({
      name,
      classID,
      role,
    }))
  )
  .map<Spec>((spec, id) => ({ ...spec, id: id + 1 }));

export const specMapById = Object.fromEntries(
  specs.map((spec) => [spec.id, spec.name])
);

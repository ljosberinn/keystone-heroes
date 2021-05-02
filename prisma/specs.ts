import type { Spec, SpecName } from "@prisma/client";

import { classes } from "./classes";

export const specs = classes
  .flatMap<Omit<Spec, "id">>(({ id: classId, specs }) =>
    specs.map(({ name, role }) => ({
      name,
      classId,
      role,
    }))
  )
  .map<Spec>((spec, id) => ({ ...spec, id: id + 1 }));

export const specMapById = Object.fromEntries(
  specs.map((spec) => [spec.id, spec.name])
);

export const specMapByName = Object.fromEntries(
  specs.map((spec) => [spec.name, spec.id])
) as Record<SpecName, number>;

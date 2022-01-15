import { classes } from "../staticData";

import { classBorderColorMap, classFillColorMap, classTextColorMap } from ".";

type ClassInfo = {
  className: string;
  specName: string;
  colors: {
    border: string;
    text: string;
    fill: string;
  };
};

export const getClassAndSpecName = <T extends { class: number; spec: number }>(
  player: T
): ClassInfo => {
  const { name, specs } = classes[player.class];
  const spec = specs.find((spec) => spec.id === player.spec);

  const lowercasedClassName = name.toLowerCase();

  return {
    className: name,
    specName: spec ? spec.name : "UnknownSpec",
    colors: {
      border: classBorderColorMap[lowercasedClassName],
      text: classTextColorMap[lowercasedClassName],
      fill: classFillColorMap[lowercasedClassName],
    },
  };
};

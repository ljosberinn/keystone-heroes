import type { FightResponse } from "@keystone-heroes/api/functions/fight";
import { isValidReportId } from "@keystone-heroes/wcl/utils";
import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useAbortableFetch } from "src/hooks/useAbortableFetch";

type FightIDProps = {
  cache?: {
    fight: FightResponse | null;
    reportID: string | null;
    fightID: number | null;
  };
};

const useFightURL = (cache: FightIDProps["cache"]) => {
  const { query, isFallback } = useRouter();

  if (isFallback) {
    return {
      url: null,
      reportID: null,
      fightID: null,
    };
  }

  if (cache?.fight) {
    return {
      url: null,
      reportID: cache.reportID,
      fightID: cache.fightID,
    };
  }

  const { reportID, fightID } = query;

  if (!isValidReportId(reportID)) {
    return {
      url: null,
      fightID: null,
      reportID: null,
    };
  }

  if (!fightID || Array.isArray(fightID)) {
    return {
      url: null,
      fightID: null,
      reportID: null,
    };
  }

  const maybeFightID = Number.parseInt(fightID);

  if (!maybeFightID || Number.isNaN(maybeFightID) || maybeFightID < 1) {
    return {
      url: null,
      fightID: null,
      reportID: null,
    };
  }

  const params = new URLSearchParams({
    reportID,
    fightID: `${fightID}`,
  }).toString();

  return {
    url: `/api/fight?${params}`,
    fightID,
    reportID,
  };
};

export default function FightID({ cache }: FightIDProps): JSX.Element | null {
  const { url, fightID, reportID } = useFightURL(cache);

  const [fight] = useAbortableFetch<FightResponse>({
    url,
    initialState: cache?.fight ?? null,
  });

  if (!fightID || !reportID || !fight) {
    return null;
  }

  if ("error" in fight) {
    return <h1>{fight.error}</h1>;
  }

  return (
    <div>
      <Link href={`/report/${reportID}/${fightID === "14" ? 6 : 14}`}>
        <a>to fight {fightID === "14" ? 6 : 14}</a>
      </Link>
      <Map zones={fight.dungeon.zones} />
    </div>
  );
}

type Bar<T, K extends string> = T extends { [P in K]: unknown } ? T[K] : never;

type MapProps = Pick<Bar<FightResponse, "dungeon">, "zones">;

function Map({ zones }: MapProps) {
  const [zoneIndex, setZoneIndex] = useState(0);
  const shouldFocusRef = useRef(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleZoneChange(id: number) {
    setZoneIndex(id);
  }

  useEffect(() => {
    if (shouldFocusRef.current) {
      shouldFocusRef.current = false;
      buttonRefs.current[zoneIndex]?.focus();
    }
  });

  return (
    <>
      <div role="tablist" aria-orientation="horizontal" className="flex">
        {zones.map((zone, index) => {
          const selected = zoneIndex === index;

          function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
            const { key } = event;

            const lookupValue =
              key === "ArrowRight" ? 1 : key === "ArrowLeft" ? -1 : null;

            if (!lookupValue) {
              return;
            }

            event.preventDefault();
            shouldFocusRef.current = true;

            const nextIndex = index + lookupValue;

            if (zones[nextIndex]) {
              setZoneIndex(nextIndex);
            } else {
              setZoneIndex(lookupValue === 1 ? 0 : zones.length - 1);
            }
          }

          return (
            <button
              type="button"
              className={`p-4 focus:outline-none focus:ring ${
                selected ? "border-coolgray-500 font-bold" : ""
              }`}
              role="tab"
              tabIndex={selected ? 0 : -1}
              aria-selected={selected}
              aria-controls={`tabpanel-${zone.id}`}
              id={`tab-${zone.id}`}
              onClick={() => {
                shouldFocusRef.current = false;
                handleZoneChange(index);
              }}
              onKeyDown={handleKeyDown}
              ref={(ref) => {
                buttonRefs.current[index] = ref;
              }}
              key={zone.id}
            >
              {zone.name}
            </button>
          );
        })}
      </div>
      <div>
        {zones.map((zone, index) => {
          return (
            <div
              role="tabpanel"
              id={`tabpanel-${zone.id}`}
              aria-labelledby={`tab-${zone.id}`}
              hidden={zoneIndex !== index}
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              tabIndex={0}
              key={zone.id}
            >
              <picture>
                <img
                  src={`/static/maps/${zone.id}.png`}
                  loading="lazy"
                  alt={zone.name}
                />
              </picture>
            </div>
          );
        })}
      </div>
    </>
  );
}

type StaticPathParams = {
  reportID: string;
  fightID: string;
};

export const getStaticPaths: GetStaticPaths<StaticPathParams> = () => {
  return {
    fallback: true,
    paths: [],
  };
};

export const getStaticProps: GetStaticProps<FightIDProps, StaticPathParams> =
  () => {
    return {
      props: {
        cache: {
          fight: null,
          fightID: null,
          reportID: null,
        },
      },
    };
  };

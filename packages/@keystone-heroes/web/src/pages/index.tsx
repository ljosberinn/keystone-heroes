import { useRouter } from "next/router";
import type { FormEvent, ChangeEvent } from "react";
import { useState } from "react";

import { parseWCLUrl } from "../utils";

export default function Home(): JSX.Element | null {
  const { push } = useRouter();

  const [url, setUrl] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { reportID, fightID } = parseWCLUrl(url);

    if (reportID) {
      const nextPath = `/report/${reportID}${
        fightID ? `?fightID=${fightID}` : ""
      }`;

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      push(nextPath);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="wcl link"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setUrl(event.target.value.trim());
        }}
      />
    </form>
  );
}

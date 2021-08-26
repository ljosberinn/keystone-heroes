import { isValidReportId } from "@keystone-heroes/wcl/utils";
import { useRouter } from "next/router";
import type { FormEvent } from "react";
import { useState } from "react";

export default function Home(): JSX.Element | null {
  const { push } = useRouter();

  const [url, setUrl] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const isReportID = isValidReportId(url);

    if (isReportID) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      push(`/report/${url}`);
      return;
    }

    const { pathname, host } = new URL(url);

    if (host === "www.warcraftlogs.com") {
      const maybeID = pathname.slice(9);

      if (isValidReportId(maybeID)) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        push(`/report/${maybeID}`);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="wcl link"
        onChange={(event) => {
          setUrl(event.target.value.trim());
        }}
      />
    </form>
  );
}

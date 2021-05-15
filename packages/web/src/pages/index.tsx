import Router from "next/router";
import { useState } from "react";

import type { ChangeEvent, FormEvent } from "react";

export default function Home(): JSX.Element {
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);

    try {
      await Router.push(`/report/${code}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setSubmitting(false);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setCode(event.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={submitting}>
        <legend>legend</legend>
        <div>
          <label htmlFor="code">code</label>
          <input
            type="text"
            required
            onChange={handleChange}
            value={code}
            minLength={16}
            id="code"
            aria-label="code"
          />
        </div>

        <button type="submit">submit</button>
      </fieldset>
    </form>
  );
}

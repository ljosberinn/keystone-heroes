import Router from "next/router";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

export default function Home(): JSX.Element {
  const [code, setCode] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // eslint-disable-next-line no-console, promise/prefer-await-to-then
    Router.push(`/report/${code}`).catch(console.error);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setCode(event.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
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

import { useRouter } from "next/router";

type DeleteUtilProps = {
  reportID: string;
  fightID: string;
};

// eslint-disable-next-line import/no-default-export
export default function DeleteUtil({
  reportID,
  fightID,
}: DeleteUtilProps): JSX.Element | null {
  const { push } = useRouter();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  async function handleDelete() {
    await fetch(`/api/dev/delete?reportID=${reportID}`);

    void push({
      pathname: `/report/${reportID}`,
      query: {
        fightID,
      },
    });
  }

  return (
    <button onClick={handleDelete} type="button">
      delete
    </button>
  );
}

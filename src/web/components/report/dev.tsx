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
    <div className="m-auto border-2 border-red-500">
      <h1>DEV ONLY</h1>
      <button
        onClick={() => {
          void handleDelete();
        }}
        type="button"
        className="p-2 m-2 bg-red-900"
      >
        delete report & reload (disable cache must be active)
      </button>
    </div>
  );
}

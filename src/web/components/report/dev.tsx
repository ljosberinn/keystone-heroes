type DeleteUtilProps = {
  reportID: string;
  fightID: string;
};

// eslint-disable-next-line import/no-default-export
export default function DeleteUtil({
  reportID,
  fightID,
}: DeleteUtilProps): JSX.Element | null {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  async function handleDelete() {
    await fetch(`/api/dev/delete?reportID=${reportID}`);

    window.location.href = `/report/${reportID}?fightID=${fightID}`;
  }

  return (
    <button onClick={handleDelete} type="button">
      delete
    </button>
  );
}

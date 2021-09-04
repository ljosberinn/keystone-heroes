// eslint-disable-next-line import/no-default-export
export default function Legend(): JSX.Element {
  return (
    <section
      className="absolute top-0 left-0 w-full h-full p-4 text-white bg-gray-500 dark:bg-coolgray-500 dark:bg-opacity-70 bg-opacity-70"
      aria-labelledby="map-options-heading"
    >
      <h1 id="map-options-heading" className="text-xl font-bold">
        Legend
      </h1>

      <div className="space-y-2">
        <ul>
          <li>SL Season 1 - Manifestation of Pride Icon</li>
          <li>SL Season 2 - Tormented Lieutenant Icons</li>
          <li>Invis Potion Icon</li>
          <li>Shroud of Concealment Icon</li>
          <li>Heroism Icon</li>
        </ul>
      </div>
    </section>
  );
}

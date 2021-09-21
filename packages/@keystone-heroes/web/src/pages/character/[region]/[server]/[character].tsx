import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";

import { createPageContext } from "../../../../context/PageData";

type CharacterProps = {
  character: string;
  region: string;
  server: string;
};

const [, withPageContext] =
  createPageContext<CharacterProps>("CharacterContext");

function Character({ character, region, server }: CharacterProps): JSX.Element {
  return (
    <h1>
      {region}/{server}/{character}
      <Link href="/character/eu/blackmoore/refn">
        <a>asdf</a>
      </Link>
    </h1>
  );
}

export default withPageContext(Character);

type StaticPaths = {
  region: string;
  server: string;
  character: string;
};

export const getStaticPaths: GetStaticPaths<StaticPaths> = async () => {
  return {
    fallback: false,
    paths: [
      {
        params: {
          character: "xepheris",
          region: "eu",
          server: "blackmoore",
        },
      },
      {
        params: {
          character: "refn",
          region: "eu",
          server: "blackmoore",
        },
      },
    ],
  };
};

export const getStaticProps: GetStaticProps<CharacterProps, StaticPaths> =
  async ({ params }) => {
    if (
      !params?.character ||
      !params?.region ||
      !params?.server ||
      Array.isArray(params.character) ||
      Array.isArray(params.region) ||
      Array.isArray(params.server)
    ) {
      throw new Error("invalid params");
    }

    const { character, region, server } = params;

    return {
      props: {
        character,
        region,
        server,
      },
    };
  };

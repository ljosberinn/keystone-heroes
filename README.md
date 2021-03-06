# Keystone Heroes

<img alt="Keystone Heroes Logo" width="350" src="https://github.com/ljosberinn/keystone-heroes/blob/master/public/logo-dark.png">

## Overview

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- docker-compose (see [here](https://docs.docker.com/compose/install/) on how to install on your machine)
- supabase (see [here](https://supabase.io/docs/reference/cli/getting-started) on how to get started)
- Warcraft Logs account for a Warcraft Logs V2 API client (create one [here](https://www.warcraftlogs.com/api/clients/))

### Introduction

This repository initially was bootstrapped with `create-next-app`, was a `yarn workspaces` monorepo for a few months and now is back to being a large repo without individual packages as prisma became fascinatingly slow when importing from a different local package. It's still not blazingly fast but a lot better.

- `src/pages` contains Next.js pages - the folder must be either in `/pages` or `/src/pages` and I don't like having it on top level, so there you go.
- `src/api` contains all Next.js API routes logic, consumed within `/src/pages/api`
- `src/wcl` contains all Warcraft Logs API retrieval & processing logic, consumed within `src/api`
- `src/web` contains the React website consumed within `src/pages`

I'm using React 18 on the `experimental` channel, primarily because I can and being able to codesplit with `next/dynamic` and `Suspense` as well as `SuspenseList` are nice. Other than that, it's pretty straight forward React, Next.js and Tailwind.

The file `src/web/staticData.ts` is generated by `src/web/createStaticData.ts` by running `yarn db:static-data`. Some of the data there is technically duplicated or a trimmed down version of data residing somewhere else in the repo. Treeshaking, even with webpack5, is not smart enough to only include specifically e.g. the `NW` constant from `src/queries/events/dungeons/nw` which is the only bit of logic I need from that file. For whatever reason, `isNwSpearEvent` and all the other Warcraft Logs related parsing utilities will also end up in the frontend bundle.

It will also be run during the build process to avoid having some icons present in prod only so you don't have to worry about updating it yourself.

### Setup

- copy Warcraft Logs client ID and client secret into `.env` at the corresponding spots
- `npm install -g supabase` - globally installs supabase (a requirement on their end)
- `supabase init` - bootstraps supabase locally
- `yarn dev-db:start` - starts the supabase docker containers
- `cp .env.example .env` (create a copy of `.env.example` and rename it to `.env`)
- `yarn db:push` - pushes the `prisma` schema to the local db
- `yarn db:seed` - seeds the supabase dev db with default data (classes, roles, etc.)
- `yarn gql:introspection` - fetches the latest graphql schema from the Warcraft Logs V2 API
- `yarn gql:generate` - generates `graphql-request` files as well as types

If you've setup Docker/Supabase differently than the defaults recommend, adjust your `DATABASE_URL` env variable accordingly.

The `NEXT_PUBLIC_SENTRY_DSN` variable is currently irrelevant as [Sentry](https://sentry.io) is disabled locally.

- `yarn dev` - starts the Next.js dev environment at [http://localhost:3000](http://localhost:3000)

### Storybook

I'd love to have more stories, but that'll come later.

You can start storybook through `yarn storybook:dev`.

### Tests

I'd love to have more tests, but that'll come later. The existing tests are better than nothing.

You can run the individual subfolders tests through `yarn test:api`, `yarn test:wcl` and `yarn test:web` (or just `yarn test` for all). Each has their own `jest.config.*.js`.

### Linting

I'm naturally using my own [ESLint config](https://github.com/ljosberinn/eslint-config-galex). There are a few warnings, I'm aware of them and will fix them eventually.

Errors should be fixed when filing a PR.

### Types

Everything is TypeScript. Don't use `any`, avoid `unknown` unless in generics.

Typechecking can be initiated through `yarn types` and must pass when filing a PR.

### Formatting

[Prettier](https://prettier.io) defaults. Install the recommended VSCode extensions if you didn't already.

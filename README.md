# Keystone Heroes

## Monorepo Overview

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- docker-compose (see [here](https://docs.docker.com/compose/install/) on how to install on your machine)
- supabase (see [here](https://supabase.io/docs/reference/cli/getting-started) on how to get started)

### Setup

- `npm install -g supabase`
- `supabase init`
- `yarn dev-db:start`
- execute `seed` in `db`
- execute `push` in `db`
- execute `copy-env-to-db` in `env`
- execute `wcl-static-data` in `wcl`
- execute `introspection` in `wcl`
- execute `generate` in `wcl`

### /api

- contains any Next.js API routes logic

### /db

- contains all db operations

### /env

### /wcl

- contains any logic related to getting data from WarcraftLogs

### /web

- contains the actual website, consumes all other repos

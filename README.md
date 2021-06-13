```sh
yarn
```

Then:

```sh
cd packages/@keystone-heroes/env
cp .env.example .env
```

Add a database url. (Not strictly necessary for reproduction).  
Then, in the same directory:

```sh
yarn copy-env-to-db
cd ../wcl
yarn introspection
```

This will _work_ with v 2.23.0 and break in v 2.24.0 (or 2.24.1).

When changing dependencies, you need to run `yarn` on the root level due to yarn workspaces.

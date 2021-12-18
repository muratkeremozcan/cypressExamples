# Pokemon API with spok

[spok](https://github.com/thlorenz/spok) _checks a given object against a given set of specifications to keep you from writing boilerplate tests_.

[cy-spok](https://github.com/bahmutov/cy-spok) is the Cypress adaptation of spok.

How to run this repo:

```bash
npm i
npm run cy:open
```

How it was setup:

```bash
npm i -D cypress @bahmutov/cy-api typescript
npx @bahmutov/cly init --typescript
npm i -D eslint eslint-plugin-cypress eslint-plugin-no-only-tests @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser faker @types/faker
# eslint, prettier, renovate settings
# added tsconfig for root & cypress
# added index.d.ts for cypress
```

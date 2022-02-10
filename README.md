# amcat4react

This repository contains components for the amcat4 client and dashboards. For an overview of the components included, see [components.md]

The query components can also be viewed/tested by running the App, which is nice for development:

```bash
npm install
npm start
```

The components to be used in amcat4client can then be exported in src/lib/index.js, and published to NPM.
(don't forget to increment version)

```bash
npm run build_npm
npm publish
```

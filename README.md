# amcat4query

This repository contains components for querying AmCAT4 indices and viewing articles

The query components can be viewed by running the App, which is nice for development

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

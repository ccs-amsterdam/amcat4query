#! /usr/bin/env -S npx ts-node

const docgen = require("react-docgen-typescript");
const fs = require("fs");

const options = {
  savePropValueAsString: true,
};

interface Prop {
  name: string,
  description: string,
  type: {name: string},
  required: boolean
}
interface Component {
  filePath: string,
  description: string,
  displayName: string,
  props: {[key: string]: Prop}
}

function component(c: Component): string {
  const block = "\`\`\`";
  return `#${c.displayName}
Filename:
  
\`\`\`
${c.description}
\`\`\`
  
### Props:

${props(c.props)}
`;
}

function props(props: {[key: string]: Prop}): string {
  const prefix = "Name | Type | Required | Descriptipn\n--- | --- | --- | ---"
  const rows: string[] = Object.keys(props).map((key) => {
    const p = props[key];
    return `${p.name} | ${p.type.name} | ${p.required} | ${p.description}`
  })
  return `${prefix}\n${rows.join("\n")}`
}



// Parse a file for docgen info
const x = docgen.parse("./src/lib/Aggregate/AggregateResult.tsx");
console.log(x)
const p = component(x[0]);
fs.writeFileSync("apidocs.md", p)


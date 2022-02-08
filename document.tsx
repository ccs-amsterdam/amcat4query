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
  return `# ${c.displayName}

Filename: [${c.filePath}](${c.filePath})
  
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
    let type = p.type.name;
    if (type in interfaces) type = `[${type}](src/lib/interfaces.tsx#L${interfaces[type]})`
    else type = `\`${type.replaceAll("|", "\\|")}\``
    return `\`${p.name}\` | ${type} | ${p.required} | ${p.description}`
  })
  return `${prefix}\n${rows.join("\n")}`
}

const files = [
  "src/lib/Article/Article.tsx",
  "src/lib/components/PaginationTable.tsx",
  "src/lib/Index/IndexCreate.tsx",
  "src/lib/Index/Index.tsx",
  "src/lib/Index/IndexDelete.tsx",
  "src/lib/Aggregate/AxisPicker.tsx",
  "src/lib/Aggregate/AggregateResult.tsx",
  "src/lib/Aggregate/AggregateTable.tsx",
  "src/lib/Aggregate/AggregateOptionsChooser.tsx",
  "src/lib/Aggregate/AggregateLineChart.tsx",
  "src/lib/Aggregate/AggregatePane.tsx",
  "src/lib/Aggregate/AggregateBarChart.tsx",
  "src/lib/apis/Amcat.tsx",
  "src/lib/Query/KeywordField.tsx",
  "src/lib/Query/Query.tsx",
  "src/lib/Query/Filters.tsx",
  "src/lib/Query/DateField.tsx",
  "src/lib/Query/FilterButton.tsx",
  "src/lib/Query/QueryString.tsx",
  "src/lib/Articles/Articles.tsx",
  "src/lib/Login/Login.tsx",
] 


const lines = String(fs.readFileSync("src/lib/interfaces.tsx")).split("\n")
const interfaces: {[key: string]: number} = {}
lines.forEach((line, i) => {
    const found = line.match(/export interface (\w+) {/);
    if (found) interfaces[found[1]+1] = i
})

const x = docgen.parse(files);
const p = x.map(component).join("\n\n")
fs.writeFileSync("apidocs.md", p)


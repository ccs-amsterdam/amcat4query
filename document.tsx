#! /usr/bin/env -S npx ts-node

const docgen = require("react-docgen-typescript");
const fs = require("fs");

const options = {
  savePropValueAsString: true,
};

interface Prop {
  name: string;
  description: string;
  type: { name: string };
  required: boolean;
}
interface Component {
  filePath: string;
  description: string;
  displayName: string;
  props: { [key: string]: Prop };
}

function component(c: Component): string {
  const block = "```";
  return `### ${c.displayName}

Filename: [${c.filePath}](${c.filePath})
  
\`\`\`
${c.description}
\`\`\`
  
#### Props:

${props(c.props)}
`;
}

function props(props: { [key: string]: Prop }): string {
  const prefix = "Name | Type | Required | Descriptipn\n--- | --- | --- | ---";
  const rows: string[] = Object.keys(props).map((key) => {
    const p = props[key];
    let type = p.type.name.replaceAll("|", "\\|");
    Object.keys(interfaces).forEach((key) => {
      type = type.replaceAll(key, `[${key}](src/lib/interfaces.tsx#L${interfaces[key]})`);
    });
    //console.log({type, x:type in interfaces})
    //if (type in interfaces) type = `[${type}](src/lib/interfaces.tsx#L${interfaces[type]})`
    //else type = `\`${type.replaceAll("|", "\\|")}\``
    return `\`${p.name}\` | ${type} | ${p.required} | ${p.description}`;
  });
  return `${prefix}\n${rows.join("\n")}`;
}

const sections: { [key: string]: string[] } = {
  "Main components": [
    "src/lib/Login/Login.tsx",
    "src/lib/Login/LoginForm.tsx",
    "src/lib/Login/IndexLogin.tsx",
    "src/lib/Query/Query.tsx",
    "src/lib/Index/Index.tsx",
    "src/lib/Aggregate/AggregateResult.tsx",
    "src/lib/Aggregate/AggregateOptionsChooser.tsx",
    "src/lib/Article/Article.tsx",
    "src/lib/Articles/Articles.tsx",
    "src/lib/Location/LocationHeatmap.tsx",
    "src/lib/Location/LocationPane.tsx",
    "src/lib/Location/LocationOptionChooser.tsx",
  ],
  Aggregation: [
    "src/lib/Aggregate/AxisPicker.tsx",
    "src/lib/Aggregate/AggregateTable.tsx",
    "src/lib/Aggregate/AggregateLineChart.tsx",
    "src/lib/Aggregate/AggregatePane.tsx",
    "src/lib/Aggregate/AggregateBarChart.tsx",
  ],
  Articles: ["src/lib/components/PaginationTable.tsx"],
  "Login & Index": ["src/lib/Index/IndexCreate.tsx", "src/lib/Index/IndexDelete.tsx"],
  Queries: [
    "src/lib/Query/KeywordField.tsx",
    "src/lib/Query/Filters.tsx",
    "src/lib/Query/DateField.tsx",
    "src/lib/Query/FilterButton.tsx",
    "src/lib/Query/QueryString.tsx",
  ],
};

// Parse interface definitions
const lines = String(fs.readFileSync("src/lib/interfaces.tsx")).split("\n");
const interfaces: { [key: string]: number } = {};
lines.forEach((line, i) => {
  const found = line.match(/export interface (\w+) {/);
  if (found) interfaces[found[1]] = i + 1;
});

const content: string[] = [
  "## AmCAT4 React components documentation",
  "Generated with `npx ts-node document.tsx`",
];
// TOC
const toc = Object.keys(sections)
  .map(
    (section) =>
      `1. [${section}](#${section.toLowerCase().replaceAll(" ", "-").replaceAll("&", "")})`
  )
  .join("\n");
content.push(toc);

// Component definitions
Object.keys(sections).forEach((section) => {
  content.push(`## ${section}`);
  const x = docgen.parse(sections[section]);
  const p = x.map(component).join("\n\n");
  content.push(p);
  content.push("---");
});

fs.writeFileSync("components.md", content.join("\n\n"));

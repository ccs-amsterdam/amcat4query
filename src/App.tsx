import { useEffect, useState } from "react";
import { Grid, Menu, Segment } from "semantic-ui-react";

// Left column
import Login from "./lib/Login/Login";
import Index from "./lib/Index/Index";
import Query from "./lib/Query/Query";

// Right column
import Upload from "./lib/Upload/Upload";
import Articles from "./lib/Articles/Articles";
import AggregatePane from "./lib/Aggregate/AggregatePane";
import Amcat from "./lib/apis/Amcat";
import { AmcatQuery } from "./lib/interfaces";

const menuItems = ["Upload", "Articles", "Aggregate"];

/* eslint-disable-next-line */
const testQuery = {
  // options to easily set useState(testQuery)
  queries: ["test"],
  filters: { newsdesk: { values: ["Washington"] } },
};

export default function App() {
  const [selected, setSelected] = useState(menuItems[2]);
  const [amcat, setAmcat] = useState<Amcat>(null);
  const [index, setIndex] = useState<string>(null);
  const [query, setQuery] = useState<AmcatQuery>();

  useEffect(() => {
    setQuery(undefined);
  }, [amcat, index]);

  const render = () => {
    switch (selected) {
      case "Upload":
        return <Upload amcat={amcat} index={index} />;
      case "Articles":
        return <Articles amcat={amcat} index={index} query={query} />;
      case "Aggregate":
        return <AggregatePane amcat={amcat} index={index} query={query} />;
      default:
        return null;
    }
  };
  return (
    <Grid columns={2} style={{ margin: "10px" }}>
      <Grid.Column width={4}>
        <Grid.Row>
          <Login onLogin={setAmcat} />
        </Grid.Row>
        <br />
        <Grid.Row>
          <Index amcat={amcat} index={index} setIndex={setIndex} canCreate canDelete />
        </Grid.Row>
        <br />
        <Grid.Row>
          {index ? <Query amcat={amcat} index={index} value={query} onSubmit={setQuery} /> : null}
        </Grid.Row>
      </Grid.Column>
      <Grid.Column width={12}>
        <ComponentMenu index={index} selected={selected} setSelected={setSelected} />
        {index ? (
          <Segment attached="bottom" style={{ width: "100%" }}>
            {render()}
          </Segment>
        ) : null}
      </Grid.Column>
    </Grid>
  );
}

interface ComponentMenuProps {
  index: string,
  selected: string,
  setSelected: (value: string)=> void
}

function ComponentMenu({ index, selected, setSelected }: ComponentMenuProps) {
  return (
    <Menu attached="top" tabular>
      {menuItems.map((name) => {
        return (
          <Menu.Item
            key={name}
            name={name}
            active={index && selected === name}
            disabled={!index}
            onClick={() => setSelected(name)}
          />
        );
      })}
    </Menu>
  );
}

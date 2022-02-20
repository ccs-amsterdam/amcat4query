import { useEffect, useState } from "react";
import { Grid, Menu, Segment } from "semantic-ui-react";

// Left column
import Login from "./lib/Login/Login";
import Query from "./lib/Query/Query";

// Right column
import Upload from "./lib/Upload/Upload";
import Articles from "./lib/Articles/Articles";
import AggregatePane from "./lib/Aggregate/AggregatePane";
import { AmcatIndex, AmcatQuery, AmcatUser } from "./lib/interfaces";
import IndexPicker from "./lib/Index/IndexPicker";
import LocationPane from "./lib/Location/LocationPane";
import RefreshToken from "./lib/Login/RefreshToken";

const menuItems = ["Upload", "Articles", "Aggregate", "Location"];

/* eslint-disable-next-line */
const testQuery = {
  // options to easily set useState(testQuery)
  queries: ["test"],
  filters: { newsdesk: { values: ["Washington"] } },
};

export default function App() {
  const [selected, setSelected] = useState(menuItems[2]);
  const [user, setUser] = useState<AmcatUser>();
  const [index, setIndex] = useState<AmcatIndex>();
  const [query, setQuery] = useState<AmcatQuery>();

  // Reset index and query if user or index change
  useEffect(() => {
    setIndex(undefined);
  }, [user]);
  useEffect(() => {
    setQuery(undefined);
  }, [index]);

  const render = () => {
    switch (selected) {
      case "Upload":
        return <Upload index={index} />;
      case "Articles":
        return <Articles index={index} query={query} />;
      case "Aggregate":
        return <AggregatePane index={index} query={query} />;
      case "Location":
        return <LocationPane index={index} query={query} />;
      default:
        return null;
    }
  };

  return (
    <Grid columns={2} style={{ margin: "10px" }}>
      <Grid.Column width={4}>
        <Grid.Row>
          <Login value={user} onLogin={setUser} />
          <RefreshToken value={user} onRefresh={setUser} />
        </Grid.Row>
        <br />
        <Grid.Row>
          <IndexPicker user={user} value={index} onChange={setIndex} />
        </Grid.Row>
        <br />
        <Grid.Row>
          {index ? <Query index={index} value={query} onSubmit={setQuery} /> : null}
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
  index: AmcatIndex;
  selected: string;
  setSelected: (value: string) => void;
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

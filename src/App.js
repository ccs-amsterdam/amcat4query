import React, { useState } from "react";
import { Grid, Menu, Segment } from "semantic-ui-react";

// Left column
import Login from "lib/Login/Login";
import Index from "lib/Index/Index";
import Query from "lib/Query/Query";

// Right column
import Upload from "amcat4upload";
import Articles from "lib/Articles/Articles";
import Aggregate from "lib/Aggregate/Aggregate";

const menuItems = ["Upload", "Articles", "Aggregate"];

export default function App() {
  const [selected, setSelected] = useState(menuItems[0]);
  const [amcat, setAmcat] = useState(null);
  const [index, setIndex] = useState(null);
  const [query, setQuery] = useState({});

  const render = () => {
    switch (selected) {
      case "Upload":
        return <Upload amcat={amcat} index={index} />;
      case "Articles":
        return <Articles amcat={amcat} index={index} query={query} />;
      case "Aggregate":
        return <Aggregate amcat={amcat} index={index} query={query} />;
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
          {index ? <Query amcat={amcat} index={index} setQuery={setQuery} /> : null}
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

function ComponentMenu({ index, selected, setSelected }) {
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

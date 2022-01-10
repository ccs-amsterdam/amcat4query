import React, { useState } from "react";
import { Grid, Menu, Segment } from "semantic-ui-react";

// Left column
import { AmcatLogin } from "amcat4auth";
import Index from "lib/Index/Index";
import Query from "lib/Query/Query";

// Right column
import Upload from "lib/Upload/Upload";
import Aggregate from "lib/Aggregate/Aggregate";
import Articles from "lib/Articles/Articles";

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
        return (
          <div>
            <Query amcat={amcat} index={index} query={query} setQuery={setQuery} />
            <Articles amcat={amcat} index={index} query={query} />
          </div>
        );
      case "Aggregate":
        return (
          <div>
            <Query amcat={amcat} index={index} query={query} setQuery={setQuery} />
            <Aggregate amcat={amcat} index={index} query={query} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Grid columns={2} style={{ margin: "10px" }}>
      <Grid.Column width={4}>
        <Grid.Row>
          <AmcatLogin onLogin={setAmcat} />
        </Grid.Row>
        <br />
        <Grid.Row>
          <Index amcat={amcat} index={index} setIndex={setIndex} canCreate canDelete />
        </Grid.Row>
        <br />
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

import React, { useState } from "react";
import { Grid, Menu, Segment } from "semantic-ui-react";

// Left column
import { AmcatLogin } from "amcat4auth";
import AmcatIndex from "lib/AmcatIndex/AmcatIndex";

// Right column
import AmcatUpload from "lib/AmcatUpload/AmcatUpload";
import AmcatAggregate from "lib/AmcatAggregate/AmcatAggregate";
import AmcatArticles from "lib/AmcatArticles/AmcatArticles";

const menuItems = ["AmcatUpload", "AmcatArticles", "AmcatAggregate"];

export default function App() {
  const [amcat, setAmcat] = useState(null);
  const [selected, setSelected] = useState(menuItems[0]);
  const [index, setIndex] = useState(null);

  const render = () => {
    switch (selected) {
      case "AmcatUpload":
        return <AmcatUpload amcat={amcat} index={index} />;
      case "AmcatArticles":
        return <AmcatArticles amcat={amcat} index={index} />;
      case "AmcatAggregate":
        return <AmcatAggregate amcat={amcat} index={index} />;
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
          <AmcatIndex amcat={amcat} index={index} setIndex={setIndex} canCreate canDelete />
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

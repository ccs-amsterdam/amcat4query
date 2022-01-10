import React, { useState } from "react";
import { Grid, Button, Icon } from "semantic-ui-react";
import TextField from "./TextField";
import DateField from "./DateField";
import Filters from "./Filters";

export default function Query({ amcat, index, query, setQuery }) {
  const [queryForm, setQueryForm] = useState({});

  const onClick = () => {
    console.log(queryForm);
    setQuery(queryForm);
  };

  return (
    <Grid style={{ marginBottom: "1em" }}>
      <Grid.Column floated="left" width={8}>
        <Grid.Row>
          <TextField query={queryForm} setQuery={setQueryForm} />
          <DateField field={"date"} query={queryForm} setQuery={setQueryForm} />
          <Button.Group widths="2">
            <Button primary type="submit" onClick={() => onClick()}>
              <Icon name="search" />
              Execute Query
            </Button>
          </Button.Group>
        </Grid.Row>
      </Grid.Column>
      <Grid.Column width={8}>
        <Grid.Row>
          <Filters amcat={amcat} index={index} query={queryForm} setQuery={setQueryForm} />
        </Grid.Row>
      </Grid.Column>
    </Grid>
  );
}

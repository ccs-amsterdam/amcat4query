import React, { useEffect, useState } from "react";
import { Grid, Button, Icon } from "semantic-ui-react";
import TextField from "./FilterForms/TextField";
import Filters from "./Filters";

export default function Query({ amcat, index, setQuery }) {
  const [queryForm, setQueryForm] = useState({});
  const [queryChanged, setQueryChanged] = useState(false);

  useEffect(() => {
    setQueryChanged(true);
  }, [queryForm, setQueryChanged]);

  const onClick = () => {
    setQuery(queryForm);
    setQueryChanged(false);
  };

  return (
    <Grid style={{ marginBottom: "1em" }}>
      <Grid.Row>
        <Grid.Column floated="left" width={16}>
          <TextField query={queryForm} setQuery={setQueryForm} />
          <Button.Group stackable style={{ width: "100%", marginBottom: "10px" }}>
            <Filters amcat={amcat} index={index} query={queryForm} setQuery={setQueryForm} />
          </Button.Group>

          <Button disabled={!queryChanged} fluid primary type="submit" onClick={() => onClick()}>
            <Icon name="search" />
            Execute Query
          </Button>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

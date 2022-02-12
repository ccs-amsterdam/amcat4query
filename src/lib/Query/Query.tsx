import { useEffect, useState } from "react";
import { Grid, Button, Icon } from "semantic-ui-react";
import QueryString from "./QueryString";
import Filters from "./Filters";
import { AmcatFilters, AmcatIndex, AmcatQuery } from "../interfaces";

interface QueryProps {
  index: AmcatIndex;
  /** AmCAT query to be displayed, e.g. {"queries": [...], "filters": {...}} */
  value: AmcatQuery;
  /** callback that will be called with a valid AmCAT query when the user clicks submit */
  onSubmit: (value: AmcatQuery) => void;
}

/**
 * Specify a full AmCAT **query**, i.e. querystrings and filters
 */
export default function Query({ index, value, onSubmit }: QueryProps) {
  const [queryStrings, setQueryStrings] = useState<string>();
  const [filters, setFilters] = useState<AmcatFilters>();

  // Is this the correct way to update the state if value changed?
  useEffect(() => {
    setQueryStrings(value?.queries && value.queries.join("\n"));
    setFilters(value?.filters || {});
  }, [value]);

  const onClick = () => {
    const q: AmcatQuery = {};
    // Split query string and remove empty queries
    if (queryStrings !== undefined && queryStrings.trim() !== "") {
      q.queries = queryStrings.split("\n").filter((e) => e.trim() !== "");
    }
    // Copy filters and remove empty filters
    const filtercopy = filters !== undefined ? { ...filters } : {};
    Object.keys(filtercopy)
      .filter((k) => Object.keys(filtercopy[k]).length === 0)
      .forEach((k) => delete filtercopy[k]);
    if (Object.keys(filtercopy).length !== 0) q.filters = filtercopy;
    console.log(JSON.stringify(q));
    onSubmit(q);
  };

  if (index == null) return null;

  return (
    <Grid style={{ marginBottom: "1em" }}>
      <Grid.Row>
        <Grid.Column floated="left" width={16}>
          <QueryString value={queryStrings} onChange={setQueryStrings} rows={5} />
          <Button.Group style={{ width: "100%", marginBottom: "10px" }}>
            <Filters index={index} value={filters} onChange={setFilters} />
          </Button.Group>{" "}
          <Button fluid primary type="submit" onClick={onClick}>
            <Icon name="search" />
            Execute Query
          </Button>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

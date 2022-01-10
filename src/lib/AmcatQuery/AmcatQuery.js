import React, { useState } from "react";
import { Form, Segment, Button, Icon } from "semantic-ui-react";
import TextQuery from "./TextQuery";
import AmcatFilters from "./AmcatFilters";

export default function AmcatQuery({ amcat, index, setQueryForm }) {
  const [queryString, setQueryString] = useState("");
  const [filters, setFilters] = useState({});

  const onSubmit = () => {
    setQueryForm({ query: queryString, filters: filters });
  };

  return (
    <div>
      <TextQuery queryString={queryString} setQueryString={setQueryString} />
      <Form style={{ marginBottom: "2em" }}>
        <AmcatFilters amcat={amcat} index={index} />
      </Form>
      <Form>
        <Button.Group widths="2">
          <Button primary type="submit" onClick={() => onSubmit()}>
            <Icon name="search" />
            Execute Query
          </Button>
        </Button.Group>
      </Form>
    </div>
  );
}

// const AmcatFilters = () => {
//   return <div>nee</div>;
// };

// const FilterIntField = () => {
//   <FilterNumField integer={true} />;
// };

// const FilterNumField = ({ integer = false }) => {
//   <Input
//     size="mini"
//     value={contextWindow[1]}
//     type="number"
//     labelPosition="right"
//     style={{ width: "6em" }}
//     label={"after"}
//     onChange={(e, d) => setContextWindow([contextWindow[0], Number(d.value)])}
//   />;
// };

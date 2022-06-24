import { useEffect, useState } from "react";
import AggregateResult from "./AggregateResult";
import AggregateOptionsChooser from "./AggregateOptionsChooser";
import { AmcatQuery, AggregationOptions, AmcatIndex } from "../interfaces";
import { Form, Input } from "semantic-ui-react";

/* eslint-disable-next-line */
const testOptions = { display: "barchart", axes: [{ field: "newsdesk" }] };

interface AggregatePaneProps {
  index: AmcatIndex;
  query: AmcatQuery;
}

export default function AggregatePane({ index, query }: AggregatePaneProps) {
  const [options, setOptions] = useState<AggregationOptions>();
  const [scale, setScale] = useState<number>();
  // Reset options if server or index changes as the options are probably no longer valid
  useEffect(() => {
    setOptions(undefined);
  }, [index]);
  return (
    <div>
      <AggregateOptionsChooser index={index} value={options} onSubmit={setOptions} />
      <Form>
        <Input
          label="Scale"
          value={scale || ""}
          onChange={(_e, { value }) => (value == "" ? null : setScale(parseFloat(value)))}
        />
      </Form>
      <AggregateResult index={index} query={query} options={options} scale={scale} />
    </div>
  );
}

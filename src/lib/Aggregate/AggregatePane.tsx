import { useEffect, useState } from "react";
import AggregateResult from "./AggregateResult";
import AggregateOptionsChooser from "./AggregateOptionsChooser";
import { AmcatQuery, AggregationOptions, AmcatIndex } from "../interfaces";

/* eslint-disable-next-line */
const testOptions = { display: "barchart", axes: [{ field: "newsdesk" }] };

interface AggregatePaneProps {
  index: AmcatIndex;
  query: AmcatQuery;
}

export default function AggregatePane({ index, query }: AggregatePaneProps) {
  const [options, setOptions] = useState<AggregationOptions>();
  // Reset options if server or index changes as the options are probably no longer valid
  useEffect(() => {
    setOptions(undefined);
  }, [index]);
  return (
    <div>
      <AggregateOptionsChooser index={index} value={options} onSubmit={setOptions} />
      <AggregateResult index={index} query={query} options={options} />
    </div>
  );
}

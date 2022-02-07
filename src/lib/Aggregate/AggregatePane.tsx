import { useEffect, useState } from "react";
import AggregateResult from "./AggregateResult";
import AggregateOptionsChooser from "./AggregateOptionsChooser";
import Amcat from "../apis/Amcat";
import { AmcatQuery, AggregationOptions } from "../interfaces";

/* eslint-disable-next-line */
const testOptions = { display: "barchart", axes: [{ field: "newsdesk" }] };

interface AggregatePaneProps {
  amcat: Amcat;
  index: string;
  query: AmcatQuery;
}

export default function AggregatePane({ amcat, index, query }: AggregatePaneProps) {
  const [options, setOptions] = useState<AggregationOptions>();
  // Reset options if server or index changes as the options are probably no longer valid
  useEffect(() => {
    setOptions(undefined);
  }, [amcat, index]);
  return (
    <div>
      <AggregateOptionsChooser amcat={amcat} index={index} value={options} onSubmit={setOptions} />
      <AggregateResult amcat={amcat} index={index} query={query} options={options} />
    </div>
  );
}

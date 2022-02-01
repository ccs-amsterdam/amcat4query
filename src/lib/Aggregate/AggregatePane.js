import { useEffect, useState } from "react";
import AggregateResult from "./AggregateResult";
import AggregateOptions from "./AggregateOptions";

/* eslint-disable-next-line */
const testOptions = { display: "barchart", axes: [{ field: "newsdesk" }] };

export default function AggregatePane({ amcat, index, query }) {
  const [options, setOptions] = useState();
  // Reset options if server or index changes as the options are probably no longer valid
  useEffect(() => {
    setOptions();
  }, [amcat, index]);
  return (
    <div>
      <AggregateOptions amcat={amcat} index={index} value={options} onSubmit={setOptions} />
      <AggregateResult amcat={amcat} index={index} query={query} options={options} />
    </div>
  );
}

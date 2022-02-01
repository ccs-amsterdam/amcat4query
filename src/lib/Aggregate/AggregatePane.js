import { useState } from "react";
import AggregateResult from "./AggregateResult";
import AggregateOptions from "./AggregateOptions";

/* eslint-disable-next-line */
const testOptions = { display: "barchart", axes: [{ field: "newsdesk" }] };

export default function AggregatePane({ amcat, index, query }) {
  const [options, setOptions] = useState(testOptions);
  return (
    <div>
      <AggregateOptions amcat={amcat} index={index} value={options} onSubmit={setOptions} />
      <AggregateResult amcat={amcat} index={index} query={query} options={options} />
    </div>
  );
}

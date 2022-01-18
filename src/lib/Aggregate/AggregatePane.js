import { useState } from "react";
import Aggregate from "./Aggregate";
import AggregateOptions from "./AggregateOptions";

export default function AggregatePane({ amcat, index, query }) {
  const [options, setOptions] = useState();
  return (
    <div>
      <AggregateOptions amcat={amcat} index={index} setOptions={setOptions} />
      <Aggregate amcat={amcat} index={index} filters={query} options={options} />
    </div>
  );
}

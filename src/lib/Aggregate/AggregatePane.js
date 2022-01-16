import { useState } from "react";
import Aggregate from "./Aggregate";
import AggregateOptions from "./AggregateOptions";

export default function AggregatePane({ amcat, index, filters }) {
  const [options, setOptions] = useState();
  return (
    <div>
      <AggregateOptions amcat={amcat} index={index} setOptions={setOptions} />
      <Aggregate amcat={amcat} index={index} filter={filters} axes={options} />
    </div>
  );
}

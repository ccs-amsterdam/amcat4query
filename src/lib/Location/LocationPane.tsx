import { useState } from "react";
import { AmcatIndex, AmcatQuery } from "..";
import LocationHeatmap from "./LocationHeatmap";
import LocationOptionChooser from "./LocationOptionChooser";
import { LocationOptions } from "../interfaces";

interface LocationPaneProps {
  index: AmcatIndex;
  query: AmcatQuery;
}

export default function LocationPane({ index, query }: LocationPaneProps) {
  const [options, setOptions] = useState<LocationOptions>();
  if (index == null) return null;
  return (
    <>
      <LocationOptionChooser index={index} value={options} onChange={setOptions} />
      <br />
      <LocationHeatmap index={index} query={query} options={options} />
    </>
  );
}

import { useState } from "react";
import { Button, Dropdown } from "semantic-ui-react";
import useFields from "../components/useFields";

const icon_date = "https://img.icons8.com/material-outlined/24/000000/calendar--v1.png";
const icon_keyword = "https://img.icons8.com/material-outlined/24/000000/activity-feed.png";

export default function AggregateOptions({ amcat, index, setOptions }) {
  const fields = useFields(amcat, index);
  const [axis1, setAxis1] = useState();
  const [axis2, setAxis2] = useState();

  function doSetOptions() {
    const axes = [axis1, axis2].filter((x) => x !== undefined && x !== "");
    setOptions(axes);
  }

  var axisOptions = []; //{ key: "None", value: null, text: "" }];
  for (let f in fields) {
    if (fields[f] === "keyword" || fields[f] === "date")
      axisOptions.push({
        key: f,
        text: f,
        value: f,
        image: { avatar: true, src: fields[f] === "date" ? icon_date : icon_keyword },
      });
  }
  return (
    <div>
      <Dropdown
        placeholder="Primary axis"
        clearable
        fluid
        selection
        options={axisOptions}
        value={axis1}
        onChange={(e, { value }) => setAxis1(value)}
      />
      <Dropdown
        placeholder="Secondary axis"
        clearable
        fluid
        selection
        options={axisOptions}
        value={axis2}
        onChange={(e, { value }) => setAxis2(value)}
      />
      <Button primary onClick={doSetOptions}>
        Submit
      </Button>
    </div>
  );
}

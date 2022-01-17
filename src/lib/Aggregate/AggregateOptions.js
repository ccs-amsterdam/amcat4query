import { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import useFields from "../components/useFields";
import AxisPicker from "./AxisPicker";

const displayOptions = [
  {
    key: 1,
    value: "list",
    text: "List",
    image: { src: "https://img.icons8.com/material-outlined/24/000000/table-1.png" },
  },
  {
    key: 2,
    value: "barchart",
    text: "Bar Chart",
    image: { src: "https://img.icons8.com/material-outlined/24/000000/bar-chart.png" },
  },
  {
    key: 3,
    value: "linechart",
    text: "Line Chart",
    image: { src: "https://img.icons8.com/material-outlined/24/000000/graph.png" },
  },
];

export default function AggregateOptions({ amcat, index, setOptions }) {
  const fields = useFields(amcat, index);
  const [display, setDisplay] = useState();
  const [axis1, setAxis1] = useState(null);
  const [axis2, setAxis2] = useState(null);

  function doSetOptions() {
    const axes = [axis1, axis2].filter((axis) => axis !== null);
    console.log({ axes, display });
    setOptions({ axes, display });
  }

  return (
    <Form>
      <Form.Dropdown
        placeholder="Select result display option"
        clearable
        fluid
        selection
        options={displayOptions}
        label="Display results as"
        value={display}
        onChange={(_e, { value }) => setDisplay(value)}
      />
      <AxisPicker fields={fields} setAxis={setAxis1} label="Primary Aggregation Axis" />
      <AxisPicker fields={fields} setAxis={setAxis2} label="Secondary Aggregation Axis" />

      <Button primary onClick={doSetOptions}>
        Submit
      </Button>
    </Form>
  );
}

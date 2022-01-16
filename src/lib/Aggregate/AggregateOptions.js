import { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import useFields from "../components/useFields";
import AxisPicker from "./AxisPicker";

export default function AggregateOptions({ amcat, index, setOptions }) {
  const fields = useFields(amcat, index);
  const [axis1, setAxis1] = useState(null);
  const [axis2, setAxis2] = useState(null);

  function doSetOptions() {
    const axes = [axis1, axis2].filter((axis) => axis !== null);
    setOptions(axes);
  }

  return (
    <Form>
      <AxisPicker fields={fields} setAxis={setAxis1} label="Primary Aggregation Axis" />
      <AxisPicker fields={fields} setAxis={setAxis2} label="Secondary Aggregation Axis" />

      <Button primary onClick={doSetOptions}>
        Submit
      </Button>
    </Form>
  );
}

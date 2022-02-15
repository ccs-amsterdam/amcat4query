import { useState, useEffect } from "react";
import { Button, Form } from "semantic-ui-react";
import useFields from "../components/useFields";
import AxisPicker from "./AxisPicker";
import { AggregationAxis, DisplayOption, AggregationOptions, AmcatIndex } from "../interfaces";
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

const aggregation_labels = {
  list: ["Group results by", "And then by", "Maximum number of rows"],
  linechart: ["Horizontal (X) axis", "Multiple lines", "Maximum number of lines"],
  barchart: ["Create bars for", "Cluster bars by", "Maximum number of bars"],
};

interface AggregateOptionsChooserProps {
  /** AmCAT index to work on */
  index: AmcatIndex;
  /** Current aggregation options value, i.e. {display: "barchart", axes: [{field: "publisher"}]} */
  value: AggregationOptions;
  /** Callback that will be called if aggregation options are set */
  onSubmit: (value: AggregationOptions) => void;
}

/** Form to select aggregation options (display, axes) */
export default function AggregateOptionsChooser({
  index,
  value,
  onSubmit,
}: AggregateOptionsChooserProps) {
  const fields = useFields(index);
  const [display, setDisplay] = useState<DisplayOption>("list");
  const [axis1, setAxis1] = useState<AggregationAxis>();
  const [axis2, setAxis2] = useState<AggregationAxis>();
  const [limit, setLimit] = useState<number>();

  useEffect(() => {
    setDisplay(value?.display || "list");
    setAxis1(value?.axes?.[0]);
    setAxis2(value?.axes?.[1]);
  }, [value]);
  function doSubmit() {
    const axes = [axis1, axis2].filter((axis) => axis?.field);
    onSubmit({ axes, display, limit });
  }
  const labels = aggregation_labels[display];

  return (
    <Form onSubmit={doSubmit}>
      <Form.Dropdown
        placeholder="Select result display option"
        clearable
        fluid
        selection
        options={displayOptions}
        label="Display results as"
        value={display}
        onChange={(_e, { value }) => setDisplay(value as DisplayOption)}
      />
      <AxisPicker fields={fields} value={axis1} onChange={setAxis1} label={labels[0]} />
      <AxisPicker fields={fields} value={axis2} onChange={setAxis2} label={labels[1]} />
      <Form.Input
        placeholder="Set limit"
        label={labels[2]}
        value={limit || ""}
        onChange={(_e, { value }) => setLimit(parseInt(value))}
        type="number"
      />
      <Button primary onClick={doSubmit}>
        Submit
      </Button>
    </Form>
  );
}

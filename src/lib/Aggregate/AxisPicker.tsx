import { Form } from "semantic-ui-react";
import { AmcatField } from "../interfaces";
import { getField } from "../Amcat";
import { AggregationAxis, AggregationInterval } from "../interfaces";

const date_intervals = [
  { key: "day", text: "day", value: "day" },
  { key: "week", text: "week", value: "week" },
  { key: "month", text: "month", value: "month" },
  { key: "quarter", text: "quarter", value: "quarter" },
  { key: "year", text: "year", value: "year" },
];

interface AxisPickerProps {
  /** index fields to choose from */
  fields: AmcatField[];
  /** Current axis value */
  value: AggregationAxis;
  /** Add 'by query' option? */
  byQuery?: boolean;
  /** Callback to set axis when user changes field or interval */
  onChange: (value: AggregationAxis) => void;
  label?: string;
}

/**
 * Dropdown to select an aggregation axis and possibly interval
 */
export default function AxisPicker({
  fields,
  value,
  onChange,
  label,
  byQuery = false,
}: AxisPickerProps) {
  const axisOptions = fields
    .filter((f) => ["keyword", "tag", "date"].includes(f.type))
    .map((f) => ({
      key: f.name,
      text: f.name,
      value: f.name,
      icon: f.type === "date" ? "calendar outline" : "list",
    }));
  if (byQuery) axisOptions.unshift({ key: "_query", text: "By query", value: "_query", icon: "" });

  const setInterval = (newval: AggregationInterval) => {
    onChange({ ...value, interval: newval });
  };
  const setField = (newval: string) => {
    const ftype = newval === "_query" ? "_query" : getField(fields, newval).type;
    const interval = ftype === "date" ? value.interval : undefined;
    console.log(interval);
    onChange({ interval: interval, field: newval });
  };
  const field = getField(fields, value?.field);
  return (
    <Form.Group widths="equal">
      <Form.Dropdown
        placeholder="Select field for aggregation axis"
        clearable
        fluid
        selection
        options={axisOptions}
        label={label ? label : "Aggregation axis"}
        value={field?.name}
        onChange={(_e, { value }) => setField(value as string)}
      />
      {field?.type === "date" ? (
        <Form.Dropdown
          placeholder="Select interval for date aggregation"
          fluid
          selection
          options={date_intervals}
          label="Interval"
          value={value?.interval}
          onChange={(_e, { value }) => setInterval(value as AggregationInterval)}
        />
      ) : null}
    </Form.Group>
  );
}

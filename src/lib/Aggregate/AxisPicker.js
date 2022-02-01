import { Form } from "semantic-ui-react";

const icon_date = "https://img.icons8.com/material-outlined/24/000000/calendar--v1.png";
const icon_keyword = "https://img.icons8.com/material-outlined/24/000000/activity-feed.png";

const date_intervals = [
  { key: "day", text: "day", value: "day" },
  { key: "week", text: "week", value: "week" },
  { key: "month", text: "month", value: "month" },
  { key: "quarter", text: "quarter", value: "quarter" },
  { key: "year", text: "year", value: "year" },
];

function getField(fields, fieldname) {
  const i = fields.map((f) => f.name).indexOf(fieldname);
  if (i === -1) return undefined;
  return fields[i];
}

/**
 *
 * Dropdown to select an aggregation axis and possibly interval
 * props:
 * - fields: array of {name, type} objects
 * - label: label to be displayed with the axis
 * - value: an object with a field (name) and optional interval: { field: fieldname, interval: interval}
 * - onChange: callback that will be called if the value is changed
 */
export default function AxisPicker({ fields, value, onChange, label }) {
  const axisOptions = fields
    .filter((f) => f.type === "keyword" || f.type === "date")
    .map((f) => ({
      key: f.name,
      text: f.name,
      value: f.name,
      image: { avatar: true, src: f.type === "date" ? icon_date : icon_keyword },
    }));

  const setInterval = (newval) => {
    onChange({ ...value, interval: newval });
  };
  const setField = (newval) => {
    onChange({ ...value, field: newval });
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
        onChange={(_e, { value }) => setField(value)}
      />
      {field?.type === "date" ? (
        <Form.Dropdown
          placeholder="Select interval for date aggregation"
          fluid
          selection
          options={date_intervals}
          label="Interval"
          value={value?.interval}
          onChange={(_e, { value }) => setInterval(value)}
        />
      ) : null}
    </Form.Group>
  );
}

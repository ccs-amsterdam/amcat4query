import { useEffect, useState } from "react";
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

function getAxisSpec(field, type, interval) {
  if (field === undefined || field === "") return null;
  if (type === "date") return { field, interval };
  return { field };
}

export default function AggregateOptions({ fields, setAxis, label }) {
  const [field, setField] = useState();
  const [interval, setInterval] = useState();

  let axisOptions = [];
  for (let f in fields) {
    if (fields[f] === "keyword" || fields[f] === "date")
      axisOptions.push({
        key: f,
        text: f,
        value: f,
        image: { avatar: true, src: fields[f] === "date" ? icon_date : icon_keyword },
      });
  }

  useEffect(() => {
    setAxis(getAxisSpec(field, fields[field], interval));
  }, [interval, field, fields, setAxis]);

  return (
    <Form.Group widths="equal">
      <Form.Dropdown
        placeholder="Select field for aggregation axis"
        clearable
        fluid
        selection
        options={axisOptions}
        label={label ? label : "Aggregation axis"}
        value={field}
        onChange={(_e, { value }) => setField(value)}
      />
      {fields[field] === "date" ? (
        <Form.Dropdown
          placeholder="Select interval for date aggregation"
          fluid
          selection
          options={date_intervals}
          label="Interval"
          value={interval}
          onChange={(_e, { value }) => setInterval(value)}
        />
      ) : null}
    </Form.Group>
  );
}
